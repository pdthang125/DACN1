"""
SmileCare - FastAPI Server for YOLOv11 Dental Image Analysis
Nhận ảnh từ frontend → phân tích → trả về kết quả tiếng Việt
"""
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import io
import os
from pathlib import Path
from PIL import Image
import base64

app = FastAPI(title="SmileCare Dental Analysis API", version="1.0")

# Cho phép Next.js kết nối
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ====== Load YOLO model khi server khởi động ======
MODEL_PATH = Path("./models/dental_best.pt")
FALLBACK_MODEL = Path("./runs/dental/smilecare_dental/weights/best.pt")

model = None

def load_model():
    global model
    try:
        from ultralytics import YOLO
        if MODEL_PATH.exists():
            model = YOLO(str(MODEL_PATH))
            print(f"✅ YOLO Model loaded from: {MODEL_PATH}")
        elif FALLBACK_MODEL.exists():
            model = YOLO(str(FALLBACK_MODEL))
            print(f"✅ YOLO Model loaded from: {FALLBACK_MODEL}")
        else:
            print("⚠️  No trained model found. Please train first!")
            print("    Run: python train_yolo.py")
    except Exception as e:
        print(f"❌ Model load error: {e}")

@app.on_event("startup")
async def startup():
    load_model()

# ====== Mapping tên class → Mô tả tiếng Việt ======
# Bạn có thể cập nhật danh sách này sau khi tải dataset về
# và xem file data.yaml để biết tên các class chính xác
CONDITION_INFO = {
    "caries":           {"vi": "Sâu răng", "severity": "medium", "advice": "Phát hiện sâu răng. Bạn nên đặt lịch khám sớm để bác sĩ làm sạch và trám lỗ sâu, tránh tình trạng lan vào tủy gây đau nhức."},
    "calculus":         {"vi": "Cao răng / Vôi răng", "severity": "low", "advice": "Có mảng bám cao răng. Bạn nên đi lấy cao răng để tránh viêm nướu và hôi miệng. Nên lấy cao răng định kỳ 6 tháng/lần."},
    "gingivitis":       {"vi": "Viêm nướu (Viêm lợi)", "severity": "medium", "advice": "Phát hiện dấu hiệu viêm nướu. Vui lòng giữ vệ sinh răng miệng, dùng chỉ nha khoa và đặt lịch khám để bác sĩ vệ sinh chuyên sâu."},
    "ulcer":            {"vi": "Loét miệng (Nhiệt miệng)", "severity": "medium", "advice": "Vết loét có thể gây đau rát. Bạn nên dùng gel bôi nhiệt miệng, uống nhiều nước. Nếu không khỏi sau 2 tuần, hãy đi khám ngay."},
}

SEVERITY_COLOR = {"low": "🟡", "medium": "🟠", "high": "🔴"}

def get_condition_info(class_name: str) -> dict:
    """Trả về thông tin tiếng Việt cho một class YOLO"""
    key = class_name.lower().replace(" ", "-")
    for k, v in CONDITION_INFO.items():
        if k in key or key in k:
            return {"class": class_name, **v}
    # Fallback nếu không tìm thấy mapping
    return {
        "class": class_name,
        "vi": class_name.replace("-", " ").replace("_", " ").title(),
        "severity": "medium",
        "advice": "Vui lòng đặt lịch khám để được tư vấn chi tiết.",
    }

# ====== API Endpoints ======

@app.get("/health")
async def health():
    return {
        "status": "ok",
        "model_loaded": model is not None,
        "model_path": str(MODEL_PATH) if MODEL_PATH.exists() else "not found"
    }

@app.post("/analyze-dental")
async def analyze_dental(file: UploadFile = File(...)):
    """
    Nhận ảnh răng từ frontend, phân tích bằng YOLO, trả về kết quả tiếng Việt.
    """
    if model is None:
        return JSONResponse(
            status_code=503,
            content={
                "success": False,
                "error": "Mô hình AI chưa được tải. Vui lòng train model trước.",
                "hint": "Run: python train_yolo.py"
            }
        )

    try:
        # Đọc ảnh từ upload
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")

        # Chạy inference
        results = model.predict(image, conf=0.25, verbose=False)
        result = results[0]

        # Parse kết quả
        detections = []
        seen_classes = set()
        if result.boxes is not None:
            for box in result.boxes:
                cls_id = int(box.cls[0])
                conf = float(box.conf[0])
                class_name = result.names[cls_id]
                info = get_condition_info(class_name)

                if class_name not in seen_classes:
                    seen_classes.add(class_name)
                    detections.append({
                        "class": class_name,
                        "name_vi": info["vi"],
                        "confidence": round(conf * 100, 1),
                        "severity": info["severity"],
                        "advice": info["advice"],
                    })

        # Sắp xếp theo confidence
        detections.sort(key=lambda x: x["confidence"], reverse=True)

        # Tạo ảnh kết quả có bounding box
        annotated = result.plot()
        annotated_pil = Image.fromarray(annotated)
        buf = io.BytesIO()
        annotated_pil.save(buf, format="JPEG", quality=85)
        img_b64 = base64.b64encode(buf.getvalue()).decode("utf-8")

        return {
            "success": True,
            "detections": detections,
            "count": len(detections),
            "annotated_image": f"data:image/jpeg;base64,{img_b64}",
            "summary": build_summary(detections),
        }

    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"success": False, "error": str(e)}
        )

def build_summary(detections: list) -> str:
    """Tạo tóm tắt kết quả phân tích bằng tiếng Việt"""
    if not detections:
        return "✅ Không phát hiện vấn đề bất thường rõ ràng. Tuy nhiên, hãy khám định kỳ 6 tháng/lần để đảm bảo sức khỏe răng miệng tốt nhất!"

    lines = ["🦷 **Kết quả phân tích ảnh răng:**\n"]
    has_urgent = False
    for d in detections:
        icon = SEVERITY_COLOR.get(d["severity"], "⚪")
        lines.append(f"{icon} **{d['name_vi']}** ({d['confidence']}% độ chính xác)")
        lines.append(f"   💡 {d['advice']}")
        if d["severity"] == "high":
            has_urgent = True

    lines.append("")
    if has_urgent:
        lines.append("🚨 **Có vấn đề nghiêm trọng — Nên đặt lịch khám ngay!**")
    else:
        lines.append("📅 **Khuyến nghị:** Đặt lịch khám để được tư vấn và điều trị phù hợp.")

    return "\n".join(lines)


if __name__ == "__main__":
    print("=" * 60)
    print("  SmileCare - Dental Analysis AI Server")
    print("  URL: http://localhost:8002")
    print("  Docs: http://localhost:8002/docs")
    print("=" * 60)
    uvicorn.run(app, host="0.0.0.0", port=8002, reload=False)
