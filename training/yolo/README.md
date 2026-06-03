# 🦷 SmileCare — Hướng dẫn YOLO Dental Analysis

## 📂 Cấu trúc thư mục
```
training/yolo/
├── setup_env.bat          ← Chạy 1 lần để cài môi trường
├── download_dataset.py    ← Download dataset từ Roboflow
├── train_yolo.py          ← Train mô hình YOLOv11
├── serve_yolo.py          ← Chạy AI server (port 8002)
├── dataset/               ← Dataset (sinh ra sau khi download)
├── models/                ← Model đã train (sinh ra sau khi train)
└── runs/                  ← Kết quả training (log, biểu đồ...)
```

---

## 🚀 Hướng dẫn từng bước

### Bước 1: Cài môi trường (Chỉ làm 1 lần)
```powershell
cd dentwise/training/yolo
setup_env.bat
```

### Bước 2: Download Dataset
```powershell
venv\Scripts\activate
python download_dataset.py
```

### Bước 3: Train mô hình
```powershell
python train_yolo.py
```

### Bước 4: Chạy AI Server
```powershell
python serve_yolo.py
```
Server chạy tại: http://localhost:8002

### Bước 5: Chạy Web App
```powershell
# Terminal khác, thư mục gốc dentwise/
npm run dev
```
→ Mở Chatbox → Nhấn "📷 Gửi ảnh răng để AI phân tích"

---

## 🔍 Technical Flow
```
User Upload Ảnh
→ ChatWidget.tsx
→ POST /api/analyze-dental (Next.js)
→ POST http://localhost:8002/analyze-dental (FastAPI/Python)
→ YOLO Inference → Bounding Boxes
→ Map class → Tiếng Việt + Lời khuyên
→ Trả về ảnh annotated + danh sách bệnh
→ ChatWidget hiển thị kết quả
```

---

## 🐛 Troubleshooting

| Lỗi | Cách sửa |
|-----|----------|
| Không kết nối AI server | Chạy python serve_yolo.py |
| Mô hình chưa được tải | Chạy python train_yolo.py |
| CUDA out of memory | Giảm BATCH_SIZE xuống 4 |
