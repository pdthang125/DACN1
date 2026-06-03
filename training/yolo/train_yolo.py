"""
SmileCare - Train YOLOv11 Dental Detection Model
Phát hiện các vấn đề nha khoa từ ảnh thực tế
"""
import os
import sys
from pathlib import Path
from ultralytics import YOLO

# ==================== CONFIG ====================
DATASET_YAML  = "./dataset/data.yaml"   # Đường dẫn đến file config dataset
MODEL_BASE    = "yolo11n.pt"            # Model gốc: yolo11n (nhỏ), yolo11s, yolo11m (to hơn)
OUTPUT_DIR    = "./runs/dental"         # Thư mục lưu kết quả training
EPOCHS        = 50                      # Số epoch (50 = nhanh, 100 = tốt hơn)
IMAGE_SIZE    = 640                     # Kích thước ảnh (640 là chuẩn)
BATCH_SIZE    = 8                       # Batch size (giảm xuống 4 nếu hết RAM GPU)
PROJECT_NAME  = "smilecare_dental"      # Tên dự án
# ================================================

def check_dataset():
    """Kiểm tra dataset đã sẵn sàng chưa"""
    if not os.path.exists(DATASET_YAML):
        print(f"❌ Dataset not found at: {DATASET_YAML}")
        print("   Run: python download_dataset.py first!")
        sys.exit(1)
    print(f"✅ Dataset found: {DATASET_YAML}")

def train():
    print("=" * 60)
    print("  SmileCare - Training YOLOv11 Dental Detection")
    print("=" * 60)
    
    check_dataset()

    print(f"\n[1/3] Loading base model: {MODEL_BASE}")
    model = YOLO(MODEL_BASE)
    print(f"  ✅ Model loaded")

    print(f"\n[2/3] Starting training...")
    print(f"  📊 Dataset: {DATASET_YAML}")
    print(f"  🔄 Epochs: {EPOCHS}")
    print(f"  🖼️  Image size: {IMAGE_SIZE}px")
    print(f"  📦 Batch size: {BATCH_SIZE}")
    print()

    results = model.train(
        data=DATASET_YAML,
        epochs=EPOCHS,
        imgsz=IMAGE_SIZE,
        batch=BATCH_SIZE,
        project=OUTPUT_DIR,
        name=PROJECT_NAME,
        patience=20,          # Early stopping
        save=True,            # Lưu model
        plots=True,           # Lưu biểu đồ training
        exist_ok=True,
        device="0" if check_gpu() else "cpu",
    )

    print(f"\n[3/3] Training complete!")
    best_model = Path(OUTPUT_DIR) / PROJECT_NAME / "weights" / "best.pt"
    print(f"  ✅ Best model saved at: {best_model}")

    # Copy model đến thư mục serve để dễ truy cập
    serve_path = Path("./models/dental_best.pt")
    serve_path.parent.mkdir(exist_ok=True)
    import shutil
    if best_model.exists():
        shutil.copy(best_model, serve_path)
        print(f"  ✅ Model copied to: {serve_path} (ready for serving!)")

    print("\n  Metrics summary:")
    print(f"  mAP50: {results.results_dict.get('metrics/mAP50(B)', 'N/A'):.4f}")
    print(f"  mAP50-95: {results.results_dict.get('metrics/mAP50-95(B)', 'N/A'):.4f}")

    print("\n" + "=" * 60)
    print("  🎉 Done! Now run: python serve_yolo.py")
    print("=" * 60)

def check_gpu():
    """Kiểm tra có GPU không"""
    try:
        import torch
        has_gpu = torch.cuda.is_available()
        if has_gpu:
            print(f"  🚀 GPU detected: {torch.cuda.get_device_name(0)}")
        else:
            print(f"  ⚠️  No GPU found, training on CPU (will be slow!)")
        return has_gpu
    except ImportError:
        return False

if __name__ == "__main__":
    train()
