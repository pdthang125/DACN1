"""
Script Fine-tuning DentWise Chatbot với QLoRA
Dùng: python train.py
Yêu cầu: GPU >= 8GB VRAM (hoặc dùng CPU mode chậm hơn)
"""

# Fix lỗi encoding trên Windows (phải đặt TRƯỚC khi import TRL)
import os
import sys
os.environ["PYTHONUTF8"] = "1"
os.environ["PYTHONIOENCODING"] = "utf-8"
# Buộc stdout/stderr dùng UTF-8
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

import json
import torch

# Kiểm tra CUDA
if not torch.cuda.is_available():
    print("[CANH BAO] Khong tim thay CUDA GPU. Chay tren CPU se rat cham.")
    print("[GIA Y] Cai PyTorch voi CUDA: pip install torch --index-url https://download.pytorch.org/whl/cu121")
else:
    print(f"[GPU OK] {torch.cuda.get_device_name(0)} - VRAM: {torch.cuda.get_device_properties(0).total_memory // 1024**2}MB")

from datasets import Dataset
from transformers import (
    AutoTokenizer,
    AutoModelForCausalLM,
    TrainingArguments,
    BitsAndBytesConfig,
)
from peft import LoraConfig, get_peft_model, TaskType
from trl import SFTTrainer

# =================== CẤU HÌNH ===================
# Chọn base model (tiếng Việt tốt, nhỏ gọn)
BASE_MODEL = "Qwen/Qwen2.5-1.5B-Instruct"  # ~3GB VRAM (QLoRA 4-bit)
# Hoặc dùng: "Qwen/Qwen2.5-3B-Instruct" nếu VRAM >= 8GB

OUTPUT_DIR = "./dentwise-model"
DATASET_FILE = "./dataset.jsonl"
NUM_EPOCHS = 3
BATCH_SIZE = 2
MAX_LENGTH = 512
# ================================================


def load_dataset(file_path: str) -> Dataset:
    """Đọc file JSONL và chuyển thành Dataset"""
    data = []
    with open(file_path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line:
                data.append(json.loads(line))
    return Dataset.from_list(data)


def format_chat(example, tokenizer):
    """Chuyển messages sang định dạng chat template"""
    text = tokenizer.apply_chat_template(
        example["messages"],
        tokenize=False,
        add_generation_prompt=False,
    )
    return {"text": text}


def main():
    print("🦷 DentWise Fine-tuning bắt đầu...")

    # --- 1. Load tokenizer ---
    print(f"📥 Đang tải tokenizer: {BASE_MODEL}")
    tokenizer = AutoTokenizer.from_pretrained(BASE_MODEL, trust_remote_code=True)
    tokenizer.pad_token = tokenizer.eos_token
    tokenizer.padding_side = "right"

    # --- 2. Load model với QLoRA 4-bit ---
    use_4bit = torch.cuda.is_available()
    print(f"🖥️  GPU: {'Có (' + torch.cuda.get_device_name(0) + ')' if use_4bit else 'Không - dùng CPU (chậm)'}")

    bnb_config = BitsAndBytesConfig(
        load_in_4bit=True,
        bnb_4bit_quant_type="nf4",
        bnb_4bit_compute_dtype=torch.float16,
        bnb_4bit_use_double_quant=True,
    ) if use_4bit else None

    print(f"📥 Đang tải model: {BASE_MODEL}")
    model = AutoModelForCausalLM.from_pretrained(
        BASE_MODEL,
        quantization_config=bnb_config,
        device_map="auto" if use_4bit else "cpu",
        trust_remote_code=True,
    )
    model.config.use_cache = False

    # --- 3. Cấu hình LoRA ---
    lora_config = LoraConfig(
        task_type=TaskType.CAUSAL_LM,
        r=16,               # rank (tăng để tốt hơn nhưng tốn hơn)
        lora_alpha=32,
        target_modules=["q_proj", "v_proj", "k_proj", "o_proj"],
        lora_dropout=0.05,
        bias="none",
    )
    model = get_peft_model(model, lora_config)
    model.print_trainable_parameters()

    # --- 4. Chuẩn bị dataset ---
    print("📊 Đang chuẩn bị dataset...")
    raw_dataset = load_dataset(DATASET_FILE)
    formatted = raw_dataset.map(lambda x: format_chat(x, tokenizer))
    split = formatted.train_test_split(test_size=0.1, seed=42)

    # --- 5. Training Arguments ---
    training_args = TrainingArguments(
        output_dir=OUTPUT_DIR,
        num_train_epochs=NUM_EPOCHS,
        per_device_train_batch_size=BATCH_SIZE,
        gradient_accumulation_steps=4,
        learning_rate=2e-4,
        fp16=use_4bit,
        logging_steps=5,
        save_strategy="epoch",
        eval_strategy="epoch",
        load_best_model_at_end=True,
        report_to="none",
        warmup_ratio=0.03,
        lr_scheduler_type="cosine",
    )

    # --- 6. Train ---
    trainer = SFTTrainer(
        model=model,
        train_dataset=split["train"],
        eval_dataset=split["test"],
        args=training_args,
        dataset_text_field="text",
        max_seq_length=MAX_LENGTH,
        tokenizer=tokenizer,
        packing=False,
    )

    print("🚀 Bắt đầu training...")
    trainer.train()

    # --- 7. Lưu model ---
    print(f"💾 Lưu model vào: {OUTPUT_DIR}")
    trainer.save_model(OUTPUT_DIR)
    tokenizer.save_pretrained(OUTPUT_DIR)
    print("✅ Fine-tuning hoàn thành!")


if __name__ == "__main__":
    main()
