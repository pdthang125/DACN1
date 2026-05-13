"""
Server phục vụ model đã fine-tune
Chạy: python serve.py
API: POST http://localhost:8001/chat
"""

import torch
from fastapi import FastAPI
from pydantic import BaseModel
from transformers import AutoTokenizer, AutoModelForCausalLM
from peft import PeftModel
import uvicorn

MODEL_DIR = "./dentwise-model"
BASE_MODEL = "Qwen/Qwen2.5-1.5B-Instruct"

app = FastAPI(title="DentWise AI Server")

# Load model khi khởi động
print("📥 Đang tải model DentWise...")
tokenizer = AutoTokenizer.from_pretrained(MODEL_DIR, trust_remote_code=True)

base = AutoModelForCausalLM.from_pretrained(
    BASE_MODEL,
    torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32,
    device_map="auto" if torch.cuda.is_available() else "cpu",
    trust_remote_code=True,
)
model = PeftModel.from_pretrained(base, MODEL_DIR)
model.eval()
print("✅ Model sẵn sàng!")


class ChatRequest(BaseModel):
    messages: list[dict]  # [{"role": "user/assistant", "content": "..."}]


@app.post("/chat")
async def chat(req: ChatRequest):
    # Thêm system prompt
    full_messages = [
        {"role": "system", "content": "Bạn là lễ tân AI của Nha khoa DentWise. Trả lời bằng tiếng Việt, xưng 'Em', gọi khách là 'Anh/Chị', ngắn gọn và thân thiện."}
    ] + req.messages

    # Áp chat template
    text = tokenizer.apply_chat_template(full_messages, tokenize=False, add_generation_prompt=True)
    inputs = tokenizer(text, return_tensors="pt").to(model.device)

    with torch.no_grad():
        outputs = model.generate(
            **inputs,
            max_new_tokens=256,
            temperature=0.7,
            top_p=0.9,
            do_sample=True,
            pad_token_id=tokenizer.eos_token_id,
        )

    # Lấy phần mới sinh ra
    new_tokens = outputs[0][inputs["input_ids"].shape[1]:]
    reply = tokenizer.decode(new_tokens, skip_special_tokens=True).strip()

    return {"reply": reply}


@app.get("/health")
async def health():
    return {"status": "ok", "model": MODEL_DIR}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
