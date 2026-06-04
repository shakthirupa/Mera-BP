package com.merabp.healthcare.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.merabp.healthcare.model.ObservationCode;
import com.merabp.healthcare.model.Patient;
import com.merabp.healthcare.repository.MedicationRepository;
import com.merabp.healthcare.repository.ObservationRepository;
import jakarta.transaction.Transactional;
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

    @Value("${huggingface.api-key:}")
    private String hfApiKey;

    @Value("${local.model.url:https://shakthirupan-bandhu-inference.hf.space}")
    private String localModelUrl;

    private static final String HF_MODEL = "shakthirupan/bandhu-hypertension-lora";

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
            var resource    = new ClassPathResource("hypertension_dataset_clean.json");
            var inputStream = resource.getInputStream();
            var reader      = new java.io.InputStreamReader(inputStream, java.nio.charset.StandardCharsets.UTF_8);
            List<Map<String, Object>> raw = mapper.readValue(reader, new TypeReference<>() {});
            dataset = raw.stream()
                .map(m -> {
                    // Support both formats: messages[] and instruction/response
                    if (m.containsKey("messages")) {
                        @SuppressWarnings("unchecked")
                        List<Map<String, String>> msgs = (List<Map<String, String>>) m.get("messages");
                        String instr = msgs.stream().filter(msg -> "user".equals(msg.get("role")))
                            .map(msg -> msg.get("content")).findFirst().orElse(null);
                        String resp  = msgs.stream().filter(msg -> "assistant".equals(msg.get("role")))
                            .map(msg -> msg.get("content")).findFirst().orElse(null);
                        return new QA(instr, resp);
                    }
                    return new QA((String) m.get("instruction"), (String) m.get("response"));
                })
                .filter(qa -> qa.instruction() != null && qa.response() != null)
                .collect(Collectors.toList());
            System.out.println("[ChatService] Loaded " + dataset.size() + " Q&As");
        } catch (Exception e) {
            System.err.println("[ChatService] Failed to load dataset: " + e.getMessage());
        }
    }

    private static final Set<String> PERSONAL_KEYWORDS = Set.of(
        "my", "mine", "i have", "i am", "i'm", "latest", "recent", "last",
        "reading", "result", "report", "medication", "medicine", "my bp",
        "my blood", "my heart", "my glucose", "my sugar", "my hba1c",
        "should i", "am i", "is my", "are my", "what is my", "how is my"
    );

    private boolean isPersonalQuestion(String message) {
        String lower = message.toLowerCase();
        return PERSONAL_KEYWORDS.stream().anyMatch(lower::contains);
    }

    @Transactional
    public String getResponse(String message, List<Map<String, String>> history, Patient patient) {
        String patientContext = buildPatientContext(patient);

        // Layer 1 — fine-tuned model (HuggingFace Space)
        try {
            String localResponse = callLocalModel(message, patientContext);
            if (localResponse != null && !localResponse.isBlank()) {
                System.out.println("[ChatService] Answered by fine-tuned model");
                return localResponse;
            }
        } catch (Exception e) {
            System.err.println("[ChatService] Fine-tuned model failed: " + e.getMessage());
        }

        // Layer 2 — Groq API
        try {
            String groqResponse = callGroq(message, history, patientContext);
            if (groqResponse != null && !groqResponse.isBlank()) {
                System.out.println("[ChatService] Answered by Groq");
                return groqResponse;
            }
        } catch (Exception e) {
            System.err.println("[ChatService] Groq failed: " + e.getMessage());
        }

        // Layer 3 — HuggingFace (general questions only)
        if (!isPersonalQuestion(message) && hfApiKey != null && !hfApiKey.isBlank()) {
            try {
                String hfResponse = callHuggingFace(message, patientContext);
                if (hfResponse != null && !hfResponse.isBlank()) {
                    System.out.println("[ChatService] Answered by HuggingFace");
                    return hfResponse;
                }
            } catch (Exception e) {
                System.err.println("[ChatService] HuggingFace failed: " + e.getMessage());
            }
        }

        // Layer 4 — dataset keyword search
        System.out.println("[ChatService] Answered by dataset fallback");
        return searchDataset(message);
    }

    private String buildPatientContext(Patient patient) {
        if (patient == null) {
            System.err.println("[ChatService] buildPatientContext: patient is null");
            return "No patient data available.";
        }

        StringBuilder ctx = new StringBuilder();
        ctx.append("Patient DOB: ").append(patient.getDateOfBirth());
        if (patient.getGender() != null) ctx.append(", Gender: ").append(patient.getGender());
        ctx.append(".\n");

        Long pid = patient.getId();

        var bpList = observationRepo.findAllByPatientIdAndCodeOrderByEffectiveDateTimeDesc(pid, ObservationCode.BLOOD_PRESSURE);
        if (!bpList.isEmpty()) {
            ctx.append("Recent BP (systolic/diastolic mmHg):\n");
            bpList.stream().limit(5).forEach(o ->
                ctx.append("  - ").append(o.getEffectiveDateTime().toLocalDate())
                   .append(": ").append(o.getValue1().intValue())
                   .append("/").append(o.getValue2() != null ? o.getValue2().intValue() : "?").append(" mmHg")
                   .append(o.getNotes() != null && !o.getNotes().isBlank() ? " (" + o.getNotes() + ")" : "")
                   .append("\n")
            );
        } else {
            ctx.append("No BP readings recorded yet.\n");
        }

        var hrList = observationRepo.findAllByPatientIdAndCodeOrderByEffectiveDateTimeDesc(pid, ObservationCode.HEART_RATE);
        if (!hrList.isEmpty()) {
            ctx.append("Recent heart rate:\n");
            hrList.stream().limit(3).forEach(o ->
                ctx.append("  - ").append(o.getEffectiveDateTime().toLocalDate())
                   .append(": ").append(o.getValue1().intValue()).append(" bpm\n")
            );
        }

        var bgList = observationRepo.findAllByPatientIdAndCodeOrderByEffectiveDateTimeDesc(pid, ObservationCode.BLOOD_GLUCOSE);
        if (!bgList.isEmpty()) {
            ctx.append("Recent blood glucose:\n");
            bgList.stream().limit(3).forEach(o ->
                ctx.append("  - ").append(o.getEffectiveDateTime().toLocalDate())
                   .append(": ").append(o.getValue1().intValue()).append(" mg/dL")
                   .append(o.getContext() != null ? " (" + o.getContext() + ")" : "")
                   .append("\n")
            );
        }

        var hbList = observationRepo.findAllByPatientIdAndCodeOrderByEffectiveDateTimeDesc(pid, ObservationCode.HBA1C);
        if (!hbList.isEmpty()) {
            ctx.append("Recent HbA1c:\n");
            hbList.stream().limit(2).forEach(o ->
                ctx.append("  - ").append(o.getEffectiveDateTime().toLocalDate())
                   .append(": ").append(o.getValue1()).append("%\n")
            );
        }

        var meds = medicationRepo.findAllByPatientIdOrderByCreatedAtDesc(pid);
        if (!meds.isEmpty()) {
            ctx.append("Current medications:\n");
            meds.forEach(m ->
                ctx.append("  - ").append(m.getName())
                   .append(m.getPurpose() != null ? " (" + m.getPurpose() + ")" : "")
                   .append(m.getInstructions() != null ? " — " + m.getInstructions() : "")
                   .append("\n")
            );
        } else {
            ctx.append("No medications recorded.\n");
        }

        System.out.println("[ChatService] Patient context built for id=" + pid + ":\n" + ctx);
        return ctx.toString();
    }

    private String callLocalModel(String message, String patientContext) throws Exception {
        // Trim context to keep prompt short and inference fast
        String trimmedContext = patientContext.length() > 600
            ? patientContext.substring(0, 600)
            : patientContext;

        Map<String, String> body = new LinkedHashMap<>();
        body.put("message", message);
        body.put("patient_context", trimmedContext);

        String requestBody = mapper.writeValueAsString(body);

        HttpClient client = HttpClient.newBuilder()
            .connectTimeout(java.time.Duration.ofSeconds(10))
            .build();
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(localModelUrl + "/chat"))
            .header("Content-Type", "application/json")
            .timeout(java.time.Duration.ofSeconds(120))
            .POST(HttpRequest.BodyPublishers.ofString(requestBody))
            .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            System.err.println("[ChatService] Fine-tuned model error: " + response.statusCode());
            return null;
        }

        JsonNode json = mapper.readTree(response.body());
        return json.path("response").asText().trim();
    }

    private String callHuggingFace(String message, String patientContext) throws Exception {
        String systemPrompt =
            "You are Bandhu, a helpful hypertension health assistant for Indian patients. " +
            "Answer only health, BP, diet, and medication related questions. " +
            "Use the patient data below to personalise your answer.\n\nPATIENT DATA:\n" + patientContext;

        String prompt =
            "<|begin_of_text|>" +
            "<|start_header_id|>system<|end_header_id|>\n" + systemPrompt + "<|eot_id|>" +
            "<|start_header_id|>user<|end_header_id|>\n" + message + "<|eot_id|>" +
            "<|start_header_id|>assistant<|end_header_id|>\n";

        Map<String, Object> parameters = new LinkedHashMap<>();
        parameters.put("max_new_tokens", 300);
        parameters.put("temperature", 0.3);
        parameters.put("do_sample", true);
        parameters.put("return_full_text", false);

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("inputs", prompt);
        body.put("parameters", parameters);

        String requestBody = mapper.writeValueAsString(body);

        HttpClient client = HttpClient.newBuilder()
            .connectTimeout(java.time.Duration.ofSeconds(30))
            .build();
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create("https://api-inference.huggingface.co/models/" + HF_MODEL))
            .header("Content-Type", "application/json")
            .header("Authorization", "Bearer " + hfApiKey)
            .timeout(java.time.Duration.ofSeconds(60))
            .POST(HttpRequest.BodyPublishers.ofString(requestBody))
            .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() == 503) return null;
        if (response.statusCode() != 200) {
            System.err.println("[ChatService] HuggingFace error: " + response.statusCode());
            return null;
        }

        JsonNode json = mapper.readTree(response.body());
        if (json.isArray() && json.size() > 0)
            return json.get(0).path("generated_text").asText().trim();
        return null;
    }

    private String callGroq(String message, List<Map<String, String>> history, String patientContext) throws Exception {
        List<Map<String, String>> messages = new ArrayList<>();

        messages.add(Map.of("role", "system", "content",
            "You are Bandhu, a hypertension health assistant for Indian patients. " +
            "Answer ONLY questions about blood pressure, hypertension, medications, diet, and related health topics. " +
            "For unrelated questions, politely say you can only help with hypertension and BP topics. " +
            "Use the patient's data below to give personalised, accurate answers. " +
            "Keep answers concise (3-5 sentences), factual, and practical. " +
            "Always recommend consulting a doctor for medical decisions. " +
            "IMPORTANT: If the patient asks about their readings or medications but the data shows none recorded, " +
            "tell them clearly that no readings have been recorded yet and ask them to log their data in the app. " +
            "Do NOT make up values or invent readings not present in the patient data.\n\n" +
            "PATIENT DATA:\n" + patientContext
        ));

        if (history != null) {
            for (Map<String, String> turn : history) {
                String role    = turn.getOrDefault("role", "user");
                String content = turn.getOrDefault("content", "");
                if (!content.isBlank() && (role.equals("user") || role.equals("assistant")))
                    messages.add(Map.of("role", role, "content", content.substring(0, Math.min(content.length(), 400))));
            }
        }
        messages.add(Map.of("role", "user", "content", message));

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("model", "llama-3.3-70b-versatile");
        body.put("messages", messages);
        body.put("max_tokens", 300);
        body.put("temperature", 0.3);

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
