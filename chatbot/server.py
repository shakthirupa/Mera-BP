from fastapi import FastAPI
from pydantic import BaseModel
from transformers import AutoModelForCausalLM, AutoTokenizer
from peft import PeftModel
import torch
import uvicorn
import os

# ── Config ────────────────────────────────────────────────────────────────────
MAX_NEW_TOKENS = 100
TEMPERATURE    = 0.3

# ── Load model ───────────────────────────────────────────────────────────────
base_model = "microsoft/Phi-3-mini-4k-instruct"

print("[Bandhu] Loading tokenizer...")
tokenizer = AutoTokenizer.from_pretrained(base_model)

print("[Bandhu] Loading base model...")
model = AutoModelForCausalLM.from_pretrained(
    base_model,
    torch_dtype=torch.float32,
    device_map="cpu"
)

print("[Bandhu] Loading LoRA adapter...")
model = PeftModel.from_pretrained(model, ".")
model.eval()

print("[Bandhu] Model ready on cpu")

# ── FastAPI app ───────────────────────────────────────────────────────────────
app = FastAPI()

class ChatRequest(BaseModel):
    message: str
    patient_context: str = ""

class ChatResponse(BaseModel):
    response: str

SYSTEM_PROMPT = (
    "You are Bandhu, a helpful hypertension health assistant for Indian patients. "
    "Answer only health, blood pressure, diet, and medication related questions. "
    "Keep answers concise, factual, and practical. "
    "Always recommend consulting a doctor for medical decisions."
)

@app.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    context = req.patient_context.strip()
    system  = SYSTEM_PROMPT
    if context:
        system += f"\n\nPATIENT DATA:\n{context}"

    prompt = (
        f"<|system|>\n{system}<|end|>\n"
        f"<|user|>\n{req.message}<|end|>\n"
        f"<|assistant|>\n"
    )

    print("[Bandhu] Request received")

    inputs = tokenizer(prompt, return_tensors="pt")

    with torch.no_grad():
        outputs = model.generate(
            input_ids=inputs["input_ids"],
            attention_mask=inputs["attention_mask"],
            max_new_tokens=80,
            temperature=0.3,
            do_sample=True,
            top_p=0.9,
            repetition_penalty=1.1,
            pad_token_id=tokenizer.eos_token_id,
            eos_token_id=tokenizer.eos_token_id,
        )  

    new_tokens = outputs[0][inputs["input_ids"].shape[1]:]
    response   = tokenizer.decode(new_tokens, skip_special_tokens=True).strip()

    print("[Bandhu] Response generated")

    return ChatResponse(response=response)

@app.get("/health")
def health():
    return {"status": "ok", "device": "cpu"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=7860)
