import json
import re
from collections import defaultdict

INPUT = r"e:\MERABP\chatbot\hypertension_dataset_clean.json"

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
            if isinstance(obj, dict) and "messages" in obj:
                msgs = obj["messages"]
                has_user = any(m.get("role") == "user" for m in msgs)
                has_asst = any(m.get("role") == "assistant" for m in msgs)
                if has_user and has_asst:
                    objects.append(obj)
            i = end
        except Exception:
            i += 1
    else:
        i += 1

print(f"Recovered: {len(objects)} entries")

# ── Step 2: Analyze repetition ───────────────────────────────────────────────
response_groups = defaultdict(list)
for i, entry in enumerate(objects):
    msgs = entry["messages"]
    asst = next((m["content"] for m in msgs if m["role"] == "assistant"), "")
    key = asst[:60].strip().lower()
    response_groups[key].append(i)

dupe_groups = sorted(
    [(k, v) for k, v in response_groups.items() if len(v) >= 3],
    key=lambda x: -len(x[1])
)
print(f"\nResponse groups with 3+ near-identical answers: {len(dupe_groups)}")
for key, indices in dupe_groups[:10]:
    print(f"  [{len(indices)}x] {key[:70]}")

# ── Step 3: Keep only first of each duplicate group, remove rest ─────────────
keep_indices = set()
for key, indices in response_groups.items():
    keep_indices.add(indices[0])  # keep first occurrence only

# Also keep all multi-turn entries regardless
for i, entry in enumerate(objects):
    if len(entry["messages"]) > 3:  # system + user + asst + more
        keep_indices.add(i)

deduped = [objects[i] for i in sorted(keep_indices)]
print(f"\nAfter removing duplicates: {len(deduped)} entries")

# ── Step 4: Add varied responses for key topics ──────────────────────────────
SYSTEM = (
    "You are Bandhu, a friendly hypertension health assistant for Indian patients. "
    "Speak naturally and warmly. Use simple language, be specific, and always recommend "
    "consulting a doctor for medical decisions."
)

def e(user, *asst_user_pairs):
    """Create entry with optional multi-turn"""
    msgs = [{"role": "system", "content": SYSTEM}, {"role": "user", "content": user}]
    for item in asst_user_pairs:
        role = "assistant" if len(msgs) % 2 == 0 else "user"
        msgs.append({"role": role, "content": item})
    return {"messages": msgs}

varied_entries = [

    # ── SMOKING (4 variations) ────────────────────────────────────────────────
    e("does smoking affect bp",
      "Nicotine tightens blood vessels temporarily after every cigarette — each smoke causes a BP spike. Over time, this repeated stress damages arterial walls."),
    e("I smoke regularly and my bp is high",
      "Smoking makes your heart work harder and increases long-term stroke risk significantly. The combination of smoking and hypertension is particularly dangerous for your arteries."),
    e("how much does smoking affect bp",
      "Even occasional smoking can interfere with BP control in sensitive people. Regular smokers often need higher medication doses to achieve the same BP control as non-smokers."),
    e("will quitting smoking help my bp",
      "Quitting improves blood vessel flexibility gradually over time. Within a year of quitting, your cardiovascular risk drops significantly — and BP medications often become more effective."),
    e("I smoke 5 cigarettes a day is that okay with hypertension",
      "There's no safe level of smoking with hypertension. Even 5 cigarettes daily keeps your vessels in a state of chronic stress. Cutting down helps, but quitting is the real goal.",
      "how to quit",
      "Nicotine replacement (patches, gum) doubles quit success rates. Apps like QuitNow track progress. Tell your doctor — they can prescribe varenicline which is very effective. Set a quit date and remove cigarettes from your home."),

    # ── SALT (4 variations) ───────────────────────────────────────────────────
    e("how much salt is safe for bp patients",
      "Target under 1,500 mg sodium daily — about 3/4 teaspoon total from all sources. Most Indians consume 3-4x this amount without realising it."),
    e("does salt really affect blood pressure",
      "Salt causes your body to retain water, increasing blood volume and pressure on vessel walls. Reducing sodium by even 1,000 mg/day can lower BP by 5-6 mmHg in salt-sensitive people."),
    e("I don't add extra salt but bp is still high",
      "Hidden sodium is the real culprit — packaged foods, pickle, papad, namkeen, bread, and restaurant food all contain large amounts. Check labels: anything above 400mg sodium per 100g is high."),
    e("namak bilkul band kar diya phir bhi bp high hai",
      "Salt is one factor among many — weight, exercise, stress, sleep, and genetics all play roles. Also check hidden sodium in packaged foods. And if you're on medication, it may need adjustment regardless of diet."),
    e("salt substitute use karna chahiye",
      "Salt substitutes replace sodium with potassium — helpful for most BP patients. BUT if you have kidney disease or take ACE inhibitors/ARBs, excess potassium is dangerous. Check with your doctor before switching."),

    # ── EXERCISE (4 variations) ───────────────────────────────────────────────
    e("which exercise lowers bp",
      "Brisk walking is the most evidence-backed and accessible option — 30 minutes, 5 days a week can lower BP by 5-8 mmHg. That's comparable to a low-dose medication."),
    e("I started exercising but bp not going down",
      "Exercise effects on BP take 4-12 weeks of consistency to show. Also check: are you exercising at moderate intensity (slightly breathless but can talk)? And diet changes need to happen alongside exercise."),
    e("gym jaana safe hai high bp mein",
      "Moderate gym workouts are safe and beneficial. Avoid heavy powerlifting and breath-holding during lifts — these spike BP dangerously. Tell your trainer about your BP. Start light and build up gradually."),
    e("yoga se bp kam hota hai kya",
      "Yes — certain yoga practices, especially pranayama (breathing exercises) and restorative poses, have shown BP-lowering effects in studies. Avoid inverted poses if BP is very high. Consistent practice over weeks shows results."),
    e("walking kitni der karni chahiye",
      "30 minutes of brisk walking daily is the standard recommendation. If that's too much initially, start with 10-15 minutes and build up. Even 3 x 10-minute walks spread through the day count.",
      "kya subah karna better hai ya shaam",
      "Both work. Morning walks are great for consistency. Evening walks help de-stress after work. Pick whichever you'll actually stick to — consistency matters more than timing."),

    # ── MEDICATION (4 variations) ─────────────────────────────────────────────
    e("why do I need to take bp medicine every day",
      "BP medication works by maintaining a steady level in your bloodstream. Missing doses lets BP creep back up — the protection disappears within hours to days depending on the drug."),
    e("can I skip bp tablet on weekends",
      "No — BP doesn't take weekends off. Skipping doses causes BP fluctuations which are actually more damaging than consistently elevated BP. Take it every day at the same time."),
    e("bp medicine ke side effects kya hain",
      "Depends on the type. ACE inhibitors can cause dry cough. Calcium channel blockers like amlodipine can cause ankle swelling. Beta-blockers can cause fatigue. Diuretics increase urination. Most side effects are manageable — tell your doctor rather than stopping."),
    e("doctor ne do tablets diye hain kya dono lene chahiye",
      "Yes — combination therapy is very common in hypertension. Two medications at lower doses often work better with fewer side effects than one medication at a high dose. Take both as prescribed.",
      "ek band kar diya kyunki zyada lag raha tha",
      "Please don't do that without telling your doctor. Stopping one medication can make the other less effective and cause BP to spike. Call your doctor and explain — they can adjust doses or switch medications."),
    e("generic medicine branded se alag hoti hai kya",
      "Generic medicines contain the same active molecule at the same dose — they're therapeutically equivalent. The difference is just the brand name and price. Jan Aushadhi Kendras sell generics at 50-90% lower cost."),

    # ── STRESS (4 variations) ─────────────────────────────────────────────────
    e("stress se bp badhta hai kya",
      "Yeah, stress definitely pushes BP up temporarily. Adrenaline and cortisol released during stress tighten blood vessels and speed up the heart. Chronic stress keeps this response activated too often."),
    e("my bp spikes when I'm angry",
      "Anger causes an immediate BP surge — completely normal physiologically. The concern is if you're frequently angry or stressed, keeping BP elevated for long periods. Managing emotional responses is genuinely part of BP management."),
    e("meditation se bp kam hota hai",
      "Yes — regular meditation and deep breathing lower the stress hormone response over time. Studies show consistent practice can reduce BP by 4-5 mmHg. It's not a replacement for medication but a valuable addition."),
    e("office stress bahut hai bp control nahi ho raha",
      "When you can't control the stressor, you build resilience instead. Exercise is the most evidence-backed stress-BP intervention — even 20 minutes of walking after work measurably reduces cortisol. Also: protect sleep, limit caffeine, and talk to your doctor about whether medication adjustment is needed.",
      "exercise ke liye time nahi milta",
      "Even 10-minute walks count. Take stairs instead of lift. Walk during lunch. Park farther away. Small consistent movement throughout the day adds up — it doesn't have to be a gym session."),

    # ── DIET VARIATIONS ───────────────────────────────────────────────────────
    e("can I eat rice with high bp",
      "Plain rice is fine in moderate portions — it's low in sodium. The issue is what goes with it: salty curries, pickle, papad. Focus on reducing those accompaniments rather than eliminating rice."),
    e("is ghee bad for hypertension",
      "Small amounts of ghee (1-2 teaspoons daily) are generally okay. The bigger concern is total saturated fat intake. Ghee in large quantities raises LDL cholesterol which compounds cardiovascular risk alongside hypertension."),
    e("can I eat eggs with high bp",
      "Yes — eggs are fine for most BP patients. They're low in sodium and a good protein source. The old concern about dietary cholesterol has been largely revised. Limit if you have very high LDL cholesterol."),
    e("coconut water peena chahiye bp mein",
      "Coconut water is rich in potassium which helps counter sodium's BP-raising effect. One glass daily is beneficial. But it also contains some sodium — don't drink excessive amounts thinking it's a cure."),
    e("dark chocolate khane se bp kam hota hai",
      "Small amounts of dark chocolate (70%+ cocoa, 20-30g daily) have shown modest BP-lowering effects in studies — due to flavonoids that improve vessel flexibility. But it's a small effect, not a treatment."),

    # ── MONITORING VARIATIONS ─────────────────────────────────────────────────
    e("morning bp always high why",
      "Morning BP surge is normal — cortisol and adrenaline rise as you wake up, causing a natural BP increase between 6-10am. This is when heart attacks and strokes are most common. Taking medication at bedtime can help blunt this surge."),
    e("bp reading different every time",
      "BP naturally varies throughout the day — activity, stress, food, caffeine, full bladder all affect it. That's normal. What matters is the average trend over multiple readings, not any single number."),
    e("right arm aur left arm mein bp alag aata hai",
      "A difference of up to 10 mmHg between arms is normal. Consistently more than 15 mmHg difference can indicate arterial issues and should be mentioned to your doctor. Always use the same arm for monitoring."),
    e("after eating bp goes up",
      "Postprandial BP changes are normal. A large meal, especially high-sodium or high-carb, can temporarily raise BP. Measure BP at consistent times — ideally before meals, not right after."),

    # ── MULTI-TURN SCENARIOS ──────────────────────────────────────────────────
    e("my bp is 160/100 and I have chest pain",
      "This needs emergency attention right now. Chest pain with BP at 160/100 could indicate a cardiac event. Call 102 or 108 immediately or have someone drive you to the nearest emergency room. Don't wait.",
      "pain is mild though",
      "Even mild chest pain with high BP is not something to wait on. Please go to emergency now — mild can become severe quickly. Better to be checked and reassured than to delay a potentially serious event."),
    e("started new bp medicine 3 days ago feeling dizzy",
      "Dizziness in the first few days of a new BP medication is common — your body is adjusting to lower BP. Stand up slowly from sitting or lying positions. If dizziness is severe or you faint, contact your doctor immediately.",
      "how long will this last",
      "Usually 1-2 weeks as your body adjusts. If it persists beyond 2 weeks or is affecting your daily life, tell your doctor — they may adjust the dose or switch medications."),
    e("bp controlled for 6 months can I stop medicine",
      "BP is controlled because the medicine is working — stopping it usually causes BP to rise again within days to weeks. Don't stop without doctor supervision.",
      "but I want to try without medicine",
      "That's a reasonable goal. The right way: tell your doctor, intensify lifestyle changes (diet, exercise, weight loss) for 3-6 months, then your doctor may try a supervised gradual reduction. Never stop abruptly on your own."),
    e("kya bp patient ko fast rakhna safe hai",
      "Fasting is generally safe for well-controlled hypertension with some precautions: never skip medication, stay hydrated in non-fasting hours, break fast with potassium-rich foods, avoid very salty foods when breaking fast.",
      "ramzan mein kya karna chahiye",
      "Take medication at sehri (pre-dawn) or iftar as advised by your doctor — timing may need adjustment. Monitor BP before and after fasting. If BP becomes unstable during Ramzan, consult your doctor about medication timing changes."),
]

print(f"\nCreated {len(varied_entries)} varied entries")

# ── Step 5: Combine and save ──────────────────────────────────────────────────
final = deduped + varied_entries
print(f"Total final: {len(final)} entries")

with open(INPUT, "w", encoding="utf-8") as f:
    json.dump(final, f, ensure_ascii=False, indent=2)

# Verify
with open(INPUT, "r", encoding="utf-8") as f:
    verify = json.load(f)

print(f"Verified: {len(verify)} entries — JSON valid")

# Final repetition check
response_groups2 = defaultdict(list)
for entry in verify:
    msgs = entry["messages"]
    asst = next((m["content"] for m in msgs if m["role"] == "assistant"), "")
    key = asst[:60].strip().lower()
    response_groups2[key].append(1)

dupes_remaining = sum(len(v)-1 for v in response_groups2.values() if len(v) > 1)
print(f"Remaining duplicate responses: {dupes_remaining}")
multi_turn = sum(1 for e in verify if len(e["messages"]) > 3)
print(f"Multi-turn entries: {multi_turn}")
