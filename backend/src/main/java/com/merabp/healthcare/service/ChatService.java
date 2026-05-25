package com.merabp.healthcare.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ChatService {

    private record QA(String instruction, String response) {}

    private List<QA> dataset = new ArrayList<>();

    @PostConstruct
    public void loadDataset() {
        try {
            var resource = new ClassPathResource("hypertension_dataset_clean.json");
            var mapper   = new ObjectMapper();
            List<Map<String, String>> raw = mapper.readValue(
                resource.getInputStream(),
                new TypeReference<>() {}
            );
            dataset = raw.stream()
                .map(m -> new QA(m.get("instruction"), m.get("response")))
                .collect(Collectors.toList());
        } catch (Exception e) {
            System.err.println("[ChatService] Failed to load dataset: " + e.getMessage());
        }
    }

    public String getResponse(String message, List<String> history) {
        if (dataset.isEmpty()) return "I'm sorry, I'm unable to answer right now. Please try again later.";

        String query = message.toLowerCase().trim();

        // Score each QA by keyword overlap
        QA best      = null;
        int bestScore = 0;

        Set<String> queryTokens = tokenize(query);

        for (QA qa : dataset) {
            Set<String> instrTokens = tokenize(qa.instruction().toLowerCase());
            int score = intersection(queryTokens, instrTokens);
            if (score > bestScore) {
                bestScore = score;
                best      = qa;
            }
        }

        if (best != null && bestScore >= 1) return best.response();

        return "I don't have specific information on that. Please consult your doctor for personalised advice about your blood pressure and health.";
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
        "too","use","what","with","this","that","have","from","they","will","your",
        "been","does","each","into","more","some","than","them","then",
        "when","also","just","like","most","over","such","take","very",
        "well","were","which","while","about","after","could","other",
        "their","there","these","those","would","should","being","every","given",
        "help","high","blood","pressure","hypertension"
    );
}
