package com.merabp.healthcare.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.merabp.healthcare.model.ObservationCode;
import com.merabp.healthcare.model.Patient;
import com.merabp.healthcare.repository.MedicationRepository;
import com.merabp.healthcare.repository.ObservationRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ChatService {

    @Value("${groq.api-key}")
    private String groqApiKey;

    private final ObservationRepository observationRepo;
    private final MedicationRepository  medicationRepo;
    private final ObjectMapper          mapper = new ObjectMapper();

    private record QA(String instruction, String response) {}
    private List<QA> dataset = new ArrayList<>();

    public ChatService(ObservationRepository observationRepo,
                       MedicationRepository medicationRepo) {
        this.observationRepo = observationRepo;
        this.medicationRepo  = medicationRepo;
    }

    @PostConstruct
    public void loadDataset() {
        try {
            var resource = new ClassPathResource("hypertension_dataset_clean.json");
            List<Map<String, String>> raw = mapper.readValue(
                resource.getInputStream(), new TypeReference<>() {});
            dataset = raw.stream()
                .map(m -> new QA(m.get("instruction"), m.get("response")))
                .collect(Collectors.toList());
            System.out.println("[ChatService] Loaded " + dataset.size() + " Q&As");
        } catch (Exception e) {
            System.err.println("[ChatService] Failed to load dataset: " + e.getMessage());
        }
    }

    public String getResponse(String message, List<String> history, Patient patient) {
        try {
            String groqResponse = callGroq(message, history, patient);
            if (groqResponse != null && !groqResponse.isBlank()) return groqResponse;
        } catch (Exception e) {
            System.err.println("[ChatService] Groq failed: " + e.getMessage());
        }
        return searchDataset(message);
    }

    private String buildPatientContext(Patient patient) {
        if (patient == null) return "";

        StringBuilder ctx = new StringBuilder();
        ctx.append("Patient profile: ").append(patient.getName());
        if (patient.getDateOfBirth() != null)
            ctx.append(", DOB: ").append(patient.getDateOfBirth());
        if (patient.getGender() != null)
            ctx.append(", Gender: ").append(patient.getGender());
        ctx.append(".\n");

        // Latest BP readings (last 5)
        try {
            var bpList = observationRepo
                .findAllByPatientIdAndCodeOrderByEffectiveDateTimeDesc(
                    patient.getId(), ObservationCode.BLOOD_PRESSURE);
            if (!bpList.isEmpty()) {
                ctx.append("Recent blood pressure readings (systolic/diastolic mmHg):\n");
                bpList.stream().limit(5).forEach(o ->
                    ctx.append("  - ").append(o.getEffectiveDateTime().toLocalDate())
                       .append(": ").append(o.getValue1().intValue())
                       .append("/").append(o.getValue2() != null ? o.getValue2().intValue() : "?")
                       .append(" mmHg\n")
                );
            }
        } catch (Exception ignored) {}

        // Latest heart rate (last 3)
        try {
            var hrList = observationRepo
                .findAllByPatientIdAndCodeOrderByEffectiveDateTimeDesc(
                    patient.getId(), ObservationCode.HEART_RATE);
            if (!hrList.isEmpty()) {
                ctx.append("Recent heart rate readings:\n");
                hrList.stream().limit(3).forEach(o ->
                    ctx.append("  - ").append(o.getEffectiveDateTime().toLocalDate())
                       .append(": ").append(o.getValue1().intValue()).append(" bpm\n")
                );
            }
        } catch (Exception ignored) {}

        // Medications
        try {
            var meds = medicationRepo.findAllByPatientIdOrderByCreatedAtDesc(patient.getId());
            if (!meds.isEmpty()) {
                ctx.append("Current medications:\n");
                meds.forEach(m ->
                    ctx.append("  - ").append(m.getName())
                       .append(m.getPurpose() != null ? " (" + m.getPurpose() + ")" : "")
                       .append("\n")
                );
            }
        } catch (Exception ignored) {}

        return ctx.toString();
    }

    private String callGroq(String message, List<String> history, Patient patient) throws Exception {
        List<Map<String, String>> messages = new ArrayList<>();

        String patientContext = buildPatientContext(patient);

        messages.add(Map.of("role", "system", "content",
            "You are Bandhu, a friendly hypertension health assistant for Indian patients. " +
            "You have access to the patient's health data below. Use it to give personalised answers. " +
            "Keep answers concise (3-5 sentences), practical, and relevant to Indian context. " +
            "Always recommend consulting a doctor for medical decisions. " +
            "If asked about Indian foods (halwa, biryani, pickle, chai, etc.), give specific BP-related advice. " +
            "Only answer health, diet, medication, or BP-related questions.\n\n" +
            "PATIENT DATA:\n" + patientContext
        ));

        if (history != null) {
            for (String h : history) {
                messages.add(Map.of("role", "user", "content", h));
            }
        }
        messages.add(Map.of("role", "user", "content", message));

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("model", "llama3-8b-8192");
        body.put("messages", messages);
        body.put("max_tokens", 300);
        body.put("temperature", 0.7);

        String requestBody = mapper.writeValueAsString(body);

        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create("https://api.groq.com/openai/v1/chat/completions"))
            .header("Content-Type", "application/json")
            .header("Authorization", "Bearer " + groqApiKey)
            .POST(HttpRequest.BodyPublishers.ofString(requestBody))
            .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            System.err.println("[ChatService] Groq error: " + response.statusCode() + " " + response.body());
            return null;
        }

        JsonNode json = mapper.readTree(response.body());
        return json.path("choices").get(0).path("message").path("content").asText();
    }

    private String searchDataset(String message) {
        if (dataset.isEmpty()) return "I'm sorry, I'm unable to answer right now. Please try again later.";

        String query = message.toLowerCase().trim();
        Set<String> queryTokens = tokenize(query);
        QA best = null;
        double bestScore = 0;

        for (QA qa : dataset) {
            String instr = qa.instruction().toLowerCase();
            Set<String> instrTokens = tokenize(instr);
            double score = instr.contains(query) ? 1000 : 0;
            if (score == 0) {
                int matched = intersection(queryTokens, instrTokens);
                if (matched > 0)
                    score = (double) matched / Math.max(queryTokens.size(), instrTokens.size()) * 100 + matched * 2;
            }
            if (score > bestScore) { bestScore = score; best = qa; }
        }

        if (best != null && bestScore >= 5) return best.response();
        return "I don't have specific information on that topic. Please consult your doctor for personalised advice.";
    }

    private Set<String> tokenize(String text) {
        return Arrays.stream(text.split("[^a-z0-9]+"))
            .filter(w -> w.length() > 2)
            .filter(w -> !STOPWORDS.contains(w))
            .collect(Collectors.toSet());
    }

    private int intersection(Set<String> a, Set<String> b) {
        int count = 0;
        for (String w : a) if (b.contains(w)) count++;
        return count;
    }

    private static final Set<String> STOPWORDS = Set.of(
        "the","and","for","are","but","not","you","all","can","her","was","one",
        "our","out","day","get","has","him","his","how","may","new","now",
        "old","see","two","way","who","boy","did","let","put","say","she",
        "too","use","with","this","that","have","from","they","will","your",
        "been","does","each","into","more","some","than","them","then",
        "when","also","just","most","over","such","take","very",
        "well","were","which","while","about","after","could","other",
        "their","there","these","those","would","should","being","every","given"
    );
}
