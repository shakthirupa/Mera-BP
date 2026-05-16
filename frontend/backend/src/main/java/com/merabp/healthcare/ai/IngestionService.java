package com.merabp.healthcare.ai;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.document.Document;
import org.springframework.ai.reader.tika.TikaDocumentReader;
import org.springframework.ai.transformer.splitter.TokenTextSplitter;
import org.springframework.ai.transformer.splitter.TextSplitter;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class IngestionService {

    private static final Logger log = LoggerFactory.getLogger(IngestionService.class);

    private final VectorStore vectorStore;

    public IngestionService(VectorStore vectorStore) {
        this.vectorStore = vectorStore;
    }

    public void ingestAll() throws Exception {

        Resource[] resources = new PathMatchingResourcePatternResolver()
                .getResources("classpath:/knowledge/*.*");

        TextSplitter splitter = TokenTextSplitter.builder()
                .withChunkSize(300)
                .withMinChunkSizeChars(100)
                .withMinChunkLengthToEmbed(50)
                .withMaxNumChunks(10000)
                .withKeepSeparator(true)
                .build();

        List<Document> allDocs = new ArrayList<>();

        for (Resource resource : resources) {

            String filename = resource.getFilename();
            if (filename == null) continue;

            String lower = filename.toLowerCase();

            // ✅ Only process PDF & DOCX
            if (!(lower.endsWith(".pdf") || lower.endsWith(".docx"))) {
                log.warn("[AI] Skipping unsupported file: {}", filename);
                continue;
            }

            log.info("[AI] Processing file: {}", filename);

            try {
                TikaDocumentReader reader = new TikaDocumentReader(resource);
                List<Document> docs = splitter.apply(reader.get());

                for (Document doc : docs) {
                    if (doc.getText() == null || doc.getText().isBlank()) continue;

                    doc.getMetadata().put("source", filename);
                    doc.getMetadata().put("type", lower.endsWith(".pdf") ? "pdf" : "docx");

                    allDocs.add(doc);
                }

            } catch (Exception e) {
                log.error("[AI] Failed to process file: {}", filename, e);
            }
        }

        if (allDocs.isEmpty()) {
            log.warn("[AI] No valid documents found for ingestion.");
            return;
        }

        vectorStore.add(allDocs);

        log.info("[AI] Ingestion complete. Total chunks stored: {}", allDocs.size());
    }
}