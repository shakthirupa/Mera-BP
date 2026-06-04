from fastapi import FastAPI
from pydantic import BaseModel
from transformers import AutoModelForCausalLM, AutoTokenizer
from peft import PeftModel
import torch
import uvicorn

# ─────────────────────────────────────────────────────────────
# CONFIG
# ─────────────────────────────────────────────────────────────

BASE_MODEL = "microsoft/Phi-3-mini-4k-instruct"

MAX_NEW_TOKENS = 100
TEMPERATURE = 0.3
TOP_P = 0.9

# ─────────────────────────────────────────────────────────────
# DEVICE SETUP
# ─────────────────────────────────────────────────────────────

DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

print(f"[Bandhu] Using device: {DEVICE}")

if DEVICE == "cuda":
    print(f"[Bandhu] GPU: {torch.cuda.get_device_name(0)}")

# ─────────────────────────────────────────────────────────────
# LOAD TOKENIZER
# ─────────────────────────────────────────────────────────────

print("[Bandhu] Loading tokenizer...")

tokenizer = AutoTokenizer.from_pretrained(
    BASE_MODEL,
    use_fast=True
)

# Fix padding token
if tokenizer.pad_token is None:
    tokenizer.pad_token = tokenizer.eos_token

# ─────────────────────────────────────────────────────────────
# LOAD MODEL
# ─────────────────────────────────────────────────────────────

print("[Bandhu] Loading base model...")

model = AutoModelForCausalLM.from_pretrained(
    BASE_MODEL,

    # 4-bit quantization
    load_in_4bit=True,

    # Faster inference
    torch_dtype=torch.float16 if DEVICE == "cuda" else torch.float32,

    # Automatic GPU mapping
    device_map="auto" if DEVICE == "cuda" else None,

    # Reduce RAM usage
    low_cpu_mem_usage=True
)

# ─────────────────────────────────────────────────────────────
# LOAD LORA
# ─────────────────────────────────────────────────────────────

print("[Bandhu] Loading LoRA adapter...")

model = PeftModel.from_pretrained(
    model,
    "."
)

model.eval()

print("[Bandhu] Model ready!")

print("[Bandhu] CUDA Available:", torch.cuda.is_available())

if torch.cuda.is_available():
    print("[Bandhu] GPU:", torch.cuda.get_device_name(0))

# ─────────────────────────────────────────────────────────────
# FASTAPI APP
# ─────────────────────────────────────────────────────────────

app = FastAPI()

# ─────────────────────────────────────────────────────────────
# REQUEST / RESPONSE MODELS
# ─────────────────────────────────────────────────────────────

class ChatRequest(BaseModel):
    message: str
    patient_context: str = ""

class ChatResponse(BaseModel):
    response: str

# ─────────────────────────────────────────────────────────────
# SYSTEM PROMPT
# ─────────────────────────────────────────────────────────────

SYSTEM_PROMPT = """
You are Bandhu, an intelligent healthcare assistant for Indian patients.

Your responsibilities:
- Answer hypertension and blood pressure related questions
- Explain symptoms, precautions, causes, and healthy habits
- Provide beginner-friendly health guidance
- Suggest healthy diet and lifestyle improvements
- Explain BP values, sugar levels, HbA1c, heart rate, BMI, and cholesterol
- Give practical and medically safe advice

Rules:
- Give detailed and natural responses
- Avoid overly short answers
- Be conversational and easy to understand
- Avoid repeating the same sentences
- Recommend consulting a doctor for emergencies or medication changes
"""

# ─────────────────────────────────────────────────────────────
# CHAT ENDPOINT
# ─────────────────────────────────────────────────────────────

@app.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest):

    print("\n[Bandhu] Request received")

    context = req.patient_context.strip()

    system_prompt = SYSTEM_PROMPT

    # Add patient context
    if context:
        system_prompt += f"""

Patient Information:
{context}

Use this information while answering.
"""

    # Create prompt
    prompt = (
        f"<|system|>\n{system_prompt}<|end|>\n"
        f"<|user|>\n{req.message}<|end|>\n"
        f"<|assistant|>\n"
    )

    # Tokenize
    inputs = tokenizer(
        prompt,
        return_tensors="pt",
        truncation=True,
        max_length=1024
    )

    # Move to device
    inputs = {
        k: v.to(model.device)
        for k, v in inputs.items()
    }

    # Generate response
    with torch.inference_mode():

        outputs = model.generate(
            input_ids=inputs["input_ids"],
            attention_mask=inputs["attention_mask"],
            max_new_tokens=MAX_NEW_TOKENS,
            temperature=TEMPERATURE,
            top_p=TOP_P,
            do_sample=True,
            repetition_penalty=1.15,
            use_cache=True,
            pad_token_id=tokenizer.eos_token_id,
            eos_token_id=tokenizer.eos_token_id
        )

    # Extract generated tokens
    new_tokens = outputs[0][inputs["input_ids"].shape[1]:]

    # Decode response
    response = tokenizer.decode(
        new_tokens,
        skip_special_tokens=True
    )

    # Cleanup
    response = response.split("<|end|>")[0]
    response = response.replace("<|assistant|>", "")
    response = response.strip()

    print("[Bandhu] Response generated")

    return ChatResponse(response=response)

# ─────────────────────────────────────────────────────────────
# HEALTH CHECK
# ─────────────────────────────────────────────────────────────

@app.get("/health")
def health():

    return {
        "status": "ok",
        "device": DEVICE,
        "cuda": torch.cuda.is_available()
    }

# ─────────────────────────────────────────────────────────────
# MAIN
# ─────────────────────────────────────────────────────────────

if __name__ == "__main__":

    uvicorn.run(
        app,
        host="0.0.0.0",
        port=7860
    )