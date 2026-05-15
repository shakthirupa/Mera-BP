package com.merabp.healthcare.controller;

import com.merabp.healthcare.ai.IngestionService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final IngestionService ingestionService;

    public AdminController(IngestionService ingestionService) {
        this.ingestionService = ingestionService;
    }

    @PostMapping("/ingest")
    public String ingest(
            @RequestHeader("x-api-key") String key
    ) throws Exception {

        // 🔐 Simple security (change this key!)
        if (!"my-secret-key".equals(key)) {
            throw new RuntimeException("Unauthorized");
        }

        ingestionService.ingestAll();

        return "Ingestion completed";
    }
}