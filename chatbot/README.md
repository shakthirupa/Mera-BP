---
title: Bandhu Hypertension Assistant
emoji: 🩺
colorFrom: blue
colorTo: indigo
sdk: docker
pinned: true
hardware: t4-small
---

# Bandhu — Hypertension Health Assistant API

FastAPI inference server for the Bandhu fine-tuned hypertension model.

## Endpoint

`POST /chat`

```json
{
  "message": "What is hypertension?",
  "patient_context": "Patient: John, DOB: 1980-01-01..."
}
```

Response:
```json
{
  "response": "Hypertension means..."
}
```

`GET /health` — health check
