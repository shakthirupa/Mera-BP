import json
import re

INPUT  = r"e:\MERABP\chatbot\hypertension_dataset_clean.json"
OUTPUT = r"e:\MERABP\chatbot\hypertension_dataset_clean.json"

# ── Step 1: Recover all valid entries ────────────────────────────────────────
with open(INPUT, "r", encoding="utf-8") as f:
    raw = f.read()

objects = []
decoder = json.JSONDecoder()
i = 0
while i < len(raw):
    while i < len(raw) and raw[i] in " \t\n\r,[]":
        i += 1
    if i >= len(raw):
        break
    if raw[i] == "{":
        try:
            obj, end = decoder.raw_decode(raw, i)
            if isinstance(obj, dict):
                # Handle both formats
                if "instruction" in obj and "response" in obj:
                    instr = obj["instruction"].strip()
                    resp  = obj["response"].strip()
                    if instr and resp:
                        objects.append({"instruction": instr, "response": resp})
                elif "messages" in obj:
                    msgs = obj["messages"]
                    if len(msgs) >= 2:
                        objects.append(obj)
            i = end
        except Exception:
            i += 1
    else:
        i += 1

print(f"Recovered: {len(objects)} entries")

# ── Step 2: Deduplicate ───────────────────────────────────────────────────────
seen = set()
unique = []
for obj in objects:
    if "instruction" in obj:
        key = obj["instruction"].strip().lower()
    else:
        key = obj["messages"][0]["content"].strip().lower()
    if key and key not in seen:
        seen.add(key)
        unique.append(obj)

print(f"After dedup: {len(unique)} entries")

# ── Step 3: Convert to conversational messages format ────────────────────────
SYSTEM = (
    "You are Bandhu, a friendly and knowledgeable hypertension health assistant for Indian patients. "
    "Speak naturally and warmly, like a knowledgeable friend — not a textbook. "
    "Use simple language, be specific, and always recommend consulting a doctor for medical decisions."
)

def make_conversational(text):
    """Make responses more conversational"""
    # Remove robotic starters
    text = re.sub(r'^(Yes,?\s+)', 'Yes! ', text)
    text = re.sub(r'^(No,?\s+)', 'No, ', text)
    # Remove trailing "Please consult..." if already in text
    return text.strip()

converted = []
for obj in unique:
    if "messages" in obj:
        converted.append(obj)
        continue

    instr = obj["instruction"].strip()
    resp  = make_conversational(obj["response"].strip())

    converted.append({
        "messages": [
            {"role": "system",    "content": SYSTEM},
            {"role": "user",      "content": instr},
            {"role": "assistant", "content": resp}
        ]
    })

print(f"Converted: {len(converted)} entries")

# ── Step 4: Save ──────────────────────────────────────────────────────────────
with open(OUTPUT, "w", encoding="utf-8") as f:
    json.dump(converted, f, ensure_ascii=False, indent=2)

# ── Step 5: Verify ────────────────────────────────────────────────────────────
with open(OUTPUT, "r", encoding="utf-8") as f:
    verify = json.load(f)

print(f"Verified: {len(verify)} entries — JSON valid")
print()
print("Sample entry:")
print(json.dumps(verify[0], indent=2, ensure_ascii=False))
