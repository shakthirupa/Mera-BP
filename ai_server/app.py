from pathlib import Path
import json
import os
import re

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from transformers import AutoTokenizer, AutoModelForCausalLM
from peft import PeftModel
import torch

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

LORA_MODEL = Path(__file__).resolve().parents[1] / "chatbot"
with (LORA_MODEL / "adapter_config.json").open("r", encoding="utf-8") as config_file:
    adapter_config = json.load(config_file)

BASE_MODEL = os.getenv(
    "BASE_MODEL",
    adapter_config.get("base_model_name_or_path", "mistralai/Mistral-7B-Instruct-v0.2"),
)

tokenizer = None
model = None
dataset = []
dataset_index = []
exact_answers = {}
token_to_indices = {}
STOP_WORDS = {
    "a", "an", "and", "are", "as", "at", "be", "can", "do", "does", "for", "from",
    "how", "i", "in", "is", "it", "my", "of", "on", "or", "should", "the", "to",
    "what", "when", "why", "with", "you", "your"
}

device = "cuda" if torch.cuda.is_available() else "cpu"
dtype = torch.float16 if device == "cuda" else torch.float32

with (LORA_MODEL / "hypertension_dataset_clean.json").open("r", encoding="utf-8") as dataset_file:
    dataset = json.load(dataset_file)

print(f"Loaded {len(dataset)} fast chatbot answers.")


def normalize_text(value: str) -> str:
    return re.sub(r"[^a-z0-9\s/]", " ", value.lower()).strip()


def tokenize(value: str) -> set[str]:
    return {
        token
        for token in normalize_text(value).split()
        if len(token) > 1 and token not in STOP_WORDS
    }


for dataset_item in dataset:
    instruction = dataset_item.get("instruction", "")
    tokens = tokenize(instruction)
    response = dataset_item.get("response")
    exact_answers.setdefault(normalize_text(instruction), response)
    dataset_index.append({
        "instruction": instruction,
        "instruction_norm": normalize_text(instruction),
        "tokens": tokens,
        "response": response,
    })
    entry_index = len(dataset_index) - 1
    for token in tokens:
        token_to_indices.setdefault(token, set()).add(entry_index)


def similarity(message_norm: str, message_tokens: set[str], item: dict) -> float:
    item_tokens = item["tokens"]
    overlap = message_tokens & item_tokens
    if not overlap:
        return 0.0

    word_score = len(overlap) / max(len(message_tokens | item_tokens), 1)
    coverage_score = len(overlap) / max(len(message_tokens), 1)
    item_coverage_score = len(overlap) / max(len(item_tokens), 1)
    phrase_bonus = 0.15 if item["instruction_norm"] in message_norm or message_norm in item["instruction_norm"] else 0.0
    return (word_score * 0.35) + (coverage_score * 0.35) + (item_coverage_score * 0.30) + phrase_bonus


def blood_pressure_answer(message: str) -> str | None:
    match = re.search(r"\b(\d{2,3})\s*(?:/|over)\s*(\d{2,3})\b", message.lower())
    if not match:
        return None

    systolic = int(match.group(1))
    diastolic = int(match.group(2))
    if systolic >= 180 or diastolic >= 120:
        category = "a hypertensive crisis range"
        action = "Rest for 5 minutes and recheck. If it remains this high or you have chest pain, breathlessness, severe headache, weakness, or vision changes, seek emergency care immediately."
    elif systolic >= 140 or diastolic >= 90:
        category = "Stage 2 hypertension"
        action = "Please discuss it with your doctor promptly, especially if repeated readings stay in this range."
    elif systolic >= 130 or diastolic >= 80:
        category = "Stage 1 hypertension"
        action = "Track readings regularly and discuss your average readings with your doctor."
    elif systolic >= 120 and diastolic < 80:
        category = "elevated blood pressure"
        action = "Lifestyle steps like reducing salt, regular walking, good sleep, and weight management can help prevent progression."
    else:
        category = "a normal blood pressure range for many adults"
        action = "Keep monitoring as advised by your clinician."

    return (
        f"A BP reading of {systolic}/{diastolic} mmHg is in {category}. "
        "One reading alone is not a diagnosis, so measure again using proper technique and look at repeated readings. "
        f"{action}"
    )


def find_fast_answer(message: str) -> str | None:
    bp_answer = blood_pressure_answer(message)
    if bp_answer:
        return bp_answer

    message_norm = normalize_text(message)
    exact_answer = exact_answers.get(message_norm)
    if exact_answer:
        return exact_answer

    message_tokens = tokenize(message)
    if not message_tokens:
        return None

    candidate_indices = set()
    for token in message_tokens:
        candidate_indices.update(token_to_indices.get(token, set()))

    best_score = 0.0
    best_response = None

    for index in candidate_indices:
        item = dataset_index[index]
        score = similarity(message_norm, message_tokens, item)
        if score > best_score:
            best_score = score
            best_response = item["response"]

    if best_score >= float(os.getenv("FAST_ANSWER_THRESHOLD", "0.45")):
        return best_response

    return None


def load_model():
    global tokenizer, model

    if model is not None and tokenizer is not None:
        return tokenizer, model

    print(f"Loading model on {device}...")
    tokenizer = AutoTokenizer.from_pretrained(LORA_MODEL)
    tokenizer.pad_token = tokenizer.eos_token

    base_model = AutoModelForCausalLM.from_pretrained(
        BASE_MODEL,
        torch_dtype=dtype,
        low_cpu_mem_usage=False,
    )
    model = PeftModel.from_pretrained(base_model, LORA_MODEL, low_cpu_mem_usage=False)
    model.to(device)
    model.eval()
    print("Model ready.")
    return tokenizer, model


class ChatRequest(BaseModel):
    message: str
    history: list[str] = []


class ChatResponse(BaseModel):
    message: str


def clean_response_text(response_text: str) -> str:
    replacements = {
        "\u00e2\u0080\u0094": "-",
        "\u00e2\u0080\u0093": "-",
        "\u00e2\u0080\u0098": "'",
        "\u00e2\u0080\u0099": "'",
        "\u00e2\u0080\u009c": '"',
        "\u00e2\u0080\u009d": '"',
        "\u00e2\u0080\u00a6": "...",
        "\u2014": "-",
        "\u2013": "-",
        "\u2018": "'",
        "\u2019": "'",
        "\u201c": '"',
        "\u201d": '"',
        "\u2026": "...",
        "â": "-",
        "â€”": "-",
        "â€“": "-",
        "â€˜": "'",
        "â€™": "'",
        "â€œ": '"',
        "â€": '"',
        "â€¦": "...",
    }
    cleaned = response_text.encode("utf-8", "ignore").decode("utf-8")
    for bad_text, replacement in replacements.items():
        cleaned = cleaned.replace(bad_text, replacement)
    return cleaned


def chat_json(response_text: str) -> JSONResponse:
    return JSONResponse(
        content={"message": clean_response_text(response_text)},
        media_type="application/json",
    )


@app.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    fast_answer = find_fast_answer(req.message)
    if fast_answer:
        return chat_json(fast_answer)

    if os.getenv("RETRIEVAL_ONLY", "true").lower() == "true":
        return chat_json(
            (
                "I could not find a close trained answer for that. Please ask about blood pressure readings, "
                "hypertension symptoms, diet, exercise, medicines, or home BP monitoring."
            )
        )

    active_tokenizer, active_model = load_model()
    history = "\n".join(f"Previous user question: {item}" for item in req.history[-3:])
    prompt = f"""<s>[INST]
You are a healthcare education assistant.

Rules:
- Never prescribe medicines
- Never provide dosages
- Never replace a doctor
- Never recommend starting or stopping medication
- Provide educational information only

Conversation context:
{history}

Question:
{req.message}
[/INST]
"""
    model_device = next(active_model.parameters()).device
    inputs = active_tokenizer(prompt, return_tensors="pt").to(model_device)

    with torch.no_grad():
        outputs = active_model.generate(
            **inputs,
            max_new_tokens=int(os.getenv("MAX_NEW_TOKENS", "128")),
            temperature=0.7,
            do_sample=True,
            pad_token_id=active_tokenizer.eos_token_id,
        )

    decoded = active_tokenizer.decode(outputs[0], skip_special_tokens=True)
    answer = decoded.split("[/INST]")[-1].strip()
    return chat_json(answer)


@app.get("/health")
def health():
    return {"status": "ok"}
