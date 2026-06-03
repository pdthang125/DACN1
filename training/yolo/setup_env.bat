@echo off
echo ============================================================
echo    SmileCare - YOLO Dental Analysis Setup
echo ============================================================
echo.

echo [1/4] Creating Python virtual environment...
python -m venv venv
if %errorlevel% neq 0 (
    echo ERROR: Python not found. Please install Python 3.10+
    pause
    exit /b 1
)

echo [2/4] Activating virtual environment...
call venv\Scripts\activate.bat

echo [3/4] Installing dependencies...
pip install ultralytics roboflow fastapi uvicorn python-multipart Pillow torch torchvision --quiet

echo [4/4] Setup complete!
echo.
echo ============================================================
echo  Next steps:
echo  1. Run: venv\Scripts\activate
echo  2. Run: python download_dataset.py   (download dataset)
echo  3. Run: python train.py              (train the model)
echo  4. Run: python serve.py              (start AI server)
echo ============================================================
pause
