"""
train.py — Bandhu Hypertension Assistant Fine-tuning
Model  : Qwen2.5-3B-Instruct (local)
Method : QLoRA via unsloth
GPU    : L40 (48 GB VRAM)

Changes applied vs baseline:
  #1  lora_dropout 0 → 0.05          (regularization)
  #2  learning_rate 2e-4 → 5e-5      (stability)
  #3  num_train_epochs 2 → 5         (with best-ckpt selection)
  #4  packing False → True           (efficiency)
  #5  dynamic MAX_SEQ_LENGTH         (95th-percentile analysis)
  #6  85/15 train/eval split         (evaluation — critical)
  #9  max_grad_norm = 1.0            (gradient clipping)
  #11 save every 50 steps            (checkpointing)
  #12 load_best_model_at_end=True    (deploy safest ckpt)
  #14 batch_size=2, grad_accum=8     (memory-efficient)
  #15 dataloader_num_workers=4       (speed)

  + System-prompt injection so the model always trains with
    Bandhu's persona and safety boundaries as the first message.
"""

# ── 0. Install (uncomment when running in a fresh env) ────────────────────────
# !pip install -q unsloth
# !pip install -q transformers datasets accelerate peft trl bitsandbytes sentencepiece protobuf

import os
import json
import numpy as np
import torch
from datasets import load_dataset, Dataset
from transformers import TrainingArguments
from trl import SFTTrainer
from unsloth import FastLanguageModel

# ─────────────────────────────────────────────────────────────────────────────
# 1.  CONFIGURATION
# ─────────────────────────────────────────────────────────────────────────────

LOCAL_MODEL_PATH = "./Qwen2.5-3B-Instruct"   # directory you already have
DATASET_PATH     = "hypertension_dataset_clean.json"
OUTPUT_DIR       = "bandhu_outputs"

# QLoRA settings
LORA_R           = 16
LORA_ALPHA       = 16
LORA_DROPOUT     = 0.05          # Change #1 — was 0
LOAD_IN_4BIT     = True

# Training hyper-params
LEARNING_RATE    = 5e-5          # Change #2 — was 2e-4
NUM_EPOCHS       = 5             # Change #3 — was 2
BATCH_SIZE       = 2             # Change #14 — was 4
GRAD_ACCUM       = 8             # Change #14 — was 2  → effective batch = 16
MAX_GRAD_NORM    = 1.0           # Change #9  — was absent
WARMUP_STEPS     = 20
SEED             = 3407

# Eval / checkpointing
EVAL_RATIO       = 0.15          # Change #6  — 85/15 split
SAVE_STEPS       = 200           # Change #11 — every ~1 epoch on ~1K samples
EVAL_STEPS       = 200           # align eval with save so best-ckpt logic works

# Bandhu system prompt (Change #7 — injected at formatting time)
SYSTEM_PROMPT = (
    "You are Bandhu, a friendly and caring hypertension health assistant "
    "for Indian patients. Your role is to educate, reassure, and guide — "
    "never to replace a doctor. Always use simple, warm language. "
    "If someone describes chest pain, sudden severe headache, vision loss, "
    "difficulty breathing, or numbness, immediately ask them to call emergency "
    "services or go to a hospital. Never prescribe specific drug doses or "
    "recommend stopping medication without doctor advice."
)

# ─────────────────────────────────────────────────────────────────────────────
# 2.  LOAD MODEL + TOKENIZER (local path, 4-bit)
# ─────────────────────────────────────────────────────────────────────────────

print("▶  Loading model from", LOCAL_MODEL_PATH)

# We'll set a placeholder max_seq_length here and update it after data analysis
model, tokenizer = FastLanguageModel.from_pretrained(
    model_name    = LOCAL_MODEL_PATH,
    max_seq_length = 2048,          # temporary — will be refined below
    load_in_4bit  = LOAD_IN_4BIT,
    dtype         = None,           # auto-detect (bf16 on L40)
)

# ─────────────────────────────────────────────────────────────────────────────
# 3.  LOAD & INSPECT DATASET — dynamic MAX_SEQ_LENGTH (Change #5)
# ─────────────────────────────────────────────────────────────────────────────

print("▶  Loading dataset from", DATASET_PATH)
raw = load_dataset("json", data_files=DATASET_PATH, split="train")
print(f"   Raw samples: {len(raw)}")

def inject_system_prompt(example):
    """
    If the first message is already a system message, replace its content with
    SYSTEM_PROMPT so every sample trains with the full Bandhu persona.
    If there's no system message, prepend one.
    """
    msgs = example["messages"]
    if msgs and msgs[0]["role"] == "system":
        msgs[0]["content"] = SYSTEM_PROMPT
    else:
        msgs = [{"role": "system", "content": SYSTEM_PROMPT}] + msgs
    return {"messages": msgs}

raw = raw.map(inject_system_prompt)

# Measure token lengths to pick an efficient MAX_SEQ_LENGTH (Change #5)
print("▶  Analysing sequence lengths …")
lengths = []
for ex in raw:
    text = tokenizer.apply_chat_template(
        ex["messages"], tokenize=False, add_generation_prompt=False
    )
    lengths.append(len(tokenizer.encode(text)))

p95 = int(np.percentile(lengths, 95))
# Round up to the nearest power-of-2-friendly value
MAX_SEQ_LENGTH = max(512, min(2048, int(np.ceil(p95 / 128) * 128)))
print(f"   Token-length p50={int(np.percentile(lengths,50))}  "
      f"p95={p95}  → MAX_SEQ_LENGTH set to {MAX_SEQ_LENGTH}")

# Patch the already-loaded model with the refined context length
# (unsloth supports this via rope-scaling; we just reassign the constant used
#  by SFTTrainer — the model itself was loaded with 2048 which is ≥ our value)

# ─────────────────────────────────────────────────────────────────────────────
# 4.  TRAIN / EVAL SPLIT (Change #6)
# ─────────────────────────────────────────────────────────────────────────────

split = raw.train_test_split(test_size=EVAL_RATIO, seed=SEED)
train_dataset = split["train"]
eval_dataset  = split["test"]
print(f"▶  Split → train={len(train_dataset)}  eval={len(eval_dataset)}")

# ─────────────────────────────────────────────────────────────────────────────
# 5.  FORMATTING FUNCTION
# ─────────────────────────────────────────────────────────────────────────────

def formatting_func(example):
    text = tokenizer.apply_chat_template(
        example["messages"],
        tokenize            = False,
        add_generation_prompt = False,
    )
    return str(text)

# ─────────────────────────────────────────────────────────────────────────────
# 6.  ATTACH QLoRA ADAPTERS
# ─────────────────────────────────────────────────────────────────────────────

print("▶  Attaching QLoRA adapters …")
model = FastLanguageModel.get_peft_model(
    model,
    r           = LORA_R,
    target_modules = [
        "q_proj", "k_proj", "v_proj", "o_proj",
        "gate_proj", "up_proj", "down_proj",
    ],
    lora_alpha  = LORA_ALPHA,
    lora_dropout = LORA_DROPOUT,          # Change #1
    bias        = "none",
    use_gradient_checkpointing = "unsloth",
    random_state = SEED,
    use_rslora  = False,
)

# ─────────────────────────────────────────────────────────────────────────────
# 7.  TRAINING ARGUMENTS
# ─────────────────────────────────────────────────────────────────────────────

training_args = TrainingArguments(
    output_dir                  = OUTPUT_DIR,
    per_device_train_batch_size = BATCH_SIZE,       # Change #14
    gradient_accumulation_steps = GRAD_ACCUM,       # Change #14
    num_train_epochs            = NUM_EPOCHS,       # Change #3
    learning_rate               = LEARNING_RATE,   # Change #2
    warmup_steps                = WARMUP_STEPS,
    max_grad_norm               = MAX_GRAD_NORM,   # Change #9
    fp16                        = not torch.cuda.is_bf16_supported(),
    bf16                        = torch.cuda.is_bf16_supported(),
    logging_steps               = 10,
    optim                       = "adamw_8bit",
    weight_decay                = 0.01,
    lr_scheduler_type           = "cosine",
    seed                        = SEED,
    # ── Eval / checkpointing (Changes #11, #12) ──────────────────────────
    evaluation_strategy         = "steps",
    eval_steps                  = EVAL_STEPS,
    save_strategy               = "steps",
    save_steps                  = SAVE_STEPS,
    save_total_limit            = 2,               # keep only 2 adapter ckpts
    load_best_model_at_end      = True,            # Change #12
    metric_for_best_model       = "eval_loss",
    greater_is_better           = False,
    # ── Save LoRA adapters only — NOT the full base model ────────────────
    # Each checkpoint is ~50–80 MB (adapter weights) vs ~6 GB (full model).
    # The frozen base model is never modified, so there's nothing to save.
    save_safetensors            = True,
    # ── Speed (Change #15) ───────────────────────────────────────────────
    dataloader_num_workers      = 4,
    report_to                   = "none",
)

# ─────────────────────────────────────────────────────────────────────────────
# 8.  TRAINER
# ─────────────────────────────────────────────────────────────────────────────

trainer = SFTTrainer(
    model           = model,
    tokenizer       = tokenizer,
    train_dataset   = train_dataset,
    eval_dataset    = eval_dataset,     # Change #10 (eval passed in)
    formatting_func = formatting_func,
    max_seq_length  = MAX_SEQ_LENGTH,   # Change #5
    packing         = True,             # Change #4 — was False
    args            = training_args,
)

# ─────────────────────────────────────────────────────────────────────────────
# 9.  TRAIN
# ─────────────────────────────────────────────────────────────────────────────

print("▶  Starting training …")
trainer.train()

# ─────────────────────────────────────────────────────────────────────────────
# 10.  SAVE (best model is already loaded by load_best_model_at_end)
# ─────────────────────────────────────────────────────────────────────────────

FINAL_DIR = os.path.join(OUTPUT_DIR, "bandhu_final")
print(f"▶  Saving best LoRA adapters to {FINAL_DIR}")
# save_pretrained on a PEFT model writes ONLY the adapter weights (~50-80 MB).
# To run inference, load the base model first, then load_adapter(FINAL_DIR).
model.save_pretrained(FINAL_DIR)
tokenizer.save_pretrained(FINAL_DIR)
print("✓  Done. Adapter size:", end=" ")
import subprocess
subprocess.run(["du", "-sh", FINAL_DIR])