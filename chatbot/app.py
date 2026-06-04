import gradio as gr
from transformers import AutoTokenizer, AutoModelForCausalLM
from peft import PeftModel
import torch

base_model = "Qwen/Qwen2.5-3B-Instruct"

print("Loading tokenizer...")
tokenizer = AutoTokenizer.from_pretrained(base_model)

print("Loading base model...")
model = AutoModelForCausalLM.from_pretrained(
    base_model,
    torch_dtype=torch.float16,
    device_map="auto"
)

print("Loading adapter...")
model = PeftModel.from_pretrained(
    model,
    "./"
)

print("Model loaded!")

def chat(user_input):

    messages = [
        {
            "role": "system",
            "content": """
You are Bandhu, a careful and supportive hypertension assistant.

Do not prescribe medicines.
Avoid fake statistics.
Recommend doctor consultation for emergencies.
"""
        },
        {
            "role": "user",
            "content": user_input
        }
    ]

    text = tokenizer.apply_chat_template(
        messages,
        tokenize=False,
        add_generation_prompt=True
    )

    inputs = tokenizer(text, return_tensors="pt").to(model.device)

    outputs = model.generate(
        **inputs,
        max_new_tokens=150,
        temperature=0.15,
        top_p=0.9,
        do_sample=True,
        repetition_penalty=1.1,
        pad_token_id=tokenizer.eos_token_id
    )

    response = tokenizer.decode(
        outputs[0][inputs.input_ids.shape[1]:],
        skip_special_tokens=True
    )

    return response

iface = gr.Interface(
    fn=chat,
    inputs=gr.Textbox(
        label="Ask your hypertension question"
    ),
    outputs="text",
    title="Bandhu Hypertension Assistant",
    description="A hypertension-focused AI assistant for Indian users."
)

iface.launch()