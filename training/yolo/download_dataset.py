"""
SmileCare - Download Dental Dataset
Tự động cài roboflow vào đúng Python đang dùng và tải dataset
"""
import subprocess, sys, os, shutil

# ── Tự cài roboflow nếu chưa có ──
try:
    from roboflow import Roboflow
except ImportError:
    print("📦 Cài roboflow vào Python hiện tại...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "roboflow", "-q"])
    from roboflow import Roboflow

API_KEY    = "BaYJNrVR0G"
TARGET_DIR = "./dataset"

# ── Danh sách project thử lần lượt ──
PROJECTS = [
    ("dental-vj85s",   "dental-conditions-cl6al", 1),
    ("roboflow-100",   "teeth-detection-j6yyt",   1),
    ("dental-q63t1",   "dentistry-xst7e",          1),
]

def download():
    print("=" * 55)
    print("  SmileCare - Downloading Dental Dataset")
    print("=" * 55)

    rf = Roboflow(api_key=API_KEY)
    dataset = None

    for workspace, project_id, version in PROJECTS:
        try:
            print(f"\n⏳ Thử: {workspace}/{project_id} v{version}...")
            proj    = rf.workspace(workspace).project(project_id)
            dataset = proj.version(version).download("yolov11", location=TARGET_DIR)
            print(f"✅ Tải thành công!")
            break
        except Exception as e:
            print(f"   ⚠️  Không được: {e}")

    if dataset is None:
        print("\n" + "=" * 55)
        print("❌ Tất cả project đều thất bại.")
        print("   Hãy tải thủ công theo hướng dẫn sau:")
        print("   1. Vào: https://universe.roboflow.com")
        print("   2. Tìm dataset nha khoa bạn muốn dùng")
        print("   3. Export → YOLOv11 → Download ZIP")
        print("   4. Giải nén vào thư mục: training/yolo/dataset/")
        print("=" * 55)
        return

    # Kiểm tra cấu trúc
    print("\n📂 Cấu trúc dataset:")
    for split in ["train", "valid", "test"]:
        img_dir = os.path.join(TARGET_DIR, split, "images")
        if os.path.exists(img_dir):
            n = len([f for f in os.listdir(img_dir) if f.lower().endswith((".jpg", ".jpeg", ".png"))])
            print(f"   ✅ {split}: {n} ảnh")

    yaml = os.path.join(TARGET_DIR, "data.yaml")
    if os.path.exists(yaml):
        print(f"\n📄 data.yaml:")
        with open(yaml) as f:
            for line in f:
                print("   " + line, end="")

    print("\n" + "=" * 55)
    print("  🚀 Xong! Chạy tiếp: python train_yolo.py")
    print("=" * 55)

if __name__ == "__main__":
    download()
