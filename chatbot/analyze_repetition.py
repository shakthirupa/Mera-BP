import json
from collections import defaultdict

f = open(r"e:\MERABP\chatbot\hypertension_dataset_clean.json", "r", encoding="utf-8")
data = json.load(f)
f.close()

print(f"Total entries: {len(data)}\n")

# Group by first 60 chars of assistant response
response_groups = defaultdict(list)
for i, entry in enumerate(data):
    msgs = entry["messages"]
    asst = next((m["content"] for m in msgs if m["role"] == "assistant"), "")
    key = asst[:60].strip().lower()
    response_groups[key].append(i)

# Show groups with 3+ identical response starts
print("=== RESPONSE GROUPS WITH 3+ NEAR-IDENTICAL ANSWERS ===\n")
total_dupes = 0
dupe_groups = sorted([(k, v) for k, v in response_groups.items() if len(v) >= 3], key=lambda x: -len(x[1]))
for key, indices in dupe_groups[:20]:
    print(f"[{len(indices)}x] '{key[:70]}'")
    for i in indices[:3]:
        msgs = data[i]["messages"]
        user = next((m["content"] for m in msgs if m["role"] == "user"), "")
        print(f"       Q: {user[:70]}")
    print()
    total_dupes += len(indices) - 1

print(f"Total redundant entries: {total_dupes}")
print(f"Unique response groups with 3+ dupes: {len(dupe_groups)}")
