import os
import glob
import yaml
import sys
import io
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np

if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')


def analyze_yolo_dataset(dataset_dir):
    # Đọc cấu hình dataset
    yaml_path = os.path.join(dataset_dir, 'data.yaml')
    if not os.path.exists(yaml_path):
        print(f"Không tìm thấy file cấu hình {yaml_path}")
        return

    with open(yaml_path, 'r', encoding='utf-8') as f:
        data_cfg = yaml.safe_load(f)
    
    classes = data_cfg.get('names', [])
    print(f"Danh sách các nhãn ({len(classes)}): {classes}\n")

    splits = ['train', 'test', 'valid']
    all_boxes = []

    for split in splits:
        split_dir = os.path.join(dataset_dir, split)
        if not os.path.exists(split_dir):
            continue
        
        labels_dir = os.path.join(split_dir, 'labels')
        if not os.path.exists(labels_dir):
            continue
            
        label_files = glob.glob(os.path.join(labels_dir, '*.txt'))
        print(f"[{split.upper()}] Số lượng ảnh (labels): {len(label_files)}")
        
        for file_path in label_files:
            with open(file_path, 'r') as f:
                lines = f.readlines()
                for line in lines:
                    parts = line.strip().split()
                    if len(parts) >= 5:
                        class_id = int(parts[0])
                        x_center = float(parts[1])
                        y_center = float(parts[2])
                        width = float(parts[3])
                        height = float(parts[4])
                        all_boxes.append({
                            'split': split,
                            'class_id': class_id,
                            'class_name': classes[class_id] if class_id < len(classes) else f"Unknown_{class_id}",
                            'x_center': x_center,
                            'y_center': y_center,
                            'width': width,
                            'height': height,
                            'area': width * height
                        })

    if not all_boxes:
        print("Không tìm thấy bounding box nào trong dataset!")
        return

    df = pd.DataFrame(all_boxes)
    print(f"\nTổng số bounding boxes (đối tượng): {len(df)}")
    
    # 1. Phân bố các nhãn (Class Distribution)
    class_counts = df['class_name'].value_counts()
    print("\nPhân bố các nhãn:")
    print(class_counts)

    plt.figure(figsize=(10, 6))
    class_counts.plot(kind='bar', color='skyblue')
    plt.title('Phân bố số lượng đối tượng theo nhãn (Class Imbalance)')
    plt.xlabel('Nhãn')
    plt.ylabel('Số lượng')
    plt.xticks(rotation=0)
    plt.tight_layout()
    plt.savefig(os.path.join(dataset_dir, 'class_distribution.png'))
    print(f"Đã lưu biểu đồ phân bố nhãn tại {os.path.join(dataset_dir, 'class_distribution.png')}")

    # 2. Phân bố kích thước Bounding Box (Kích thước tương đối so với ảnh)
    plt.figure(figsize=(10, 6))
    plt.scatter(df['width'], df['height'], alpha=0.3, s=5)
    plt.title('Phân bố kích thước Bounding Box (Width vs Height)')
    plt.xlabel('Width (Tỉ lệ)')
    plt.ylabel('Height (Tỉ lệ)')
    plt.xlim(0, 1)
    plt.ylim(0, 1)
    plt.tight_layout()
    plt.savefig(os.path.join(dataset_dir, 'box_size_distribution.png'))
    print(f"Đã lưu biểu đồ phân bố kích thước bbox tại {os.path.join(dataset_dir, 'box_size_distribution.png')}")

    # 3. Phân bố vị trí đối tượng trên ảnh (Heatmap)
    plt.figure(figsize=(8, 8))
    plt.hist2d(df['x_center'], df['y_center'], bins=50, cmap='hot')
    plt.colorbar(label='Số lượng đối tượng')
    plt.title('Bản đồ nhiệt vị trí đối tượng (Center Point Heatmap)')
    plt.xlabel('X Center')
    plt.ylabel('Y Center')
    # Trục Y của ảnh tính từ trên xuống, nên cần đảo ngược trục Y của đồ thị
    plt.gca().invert_yaxis()
    plt.xlim(0, 1)
    plt.ylim(1, 0)
    plt.tight_layout()
    plt.savefig(os.path.join(dataset_dir, 'box_heatmap.png'))
    print(f"Đã lưu bản đồ nhiệt vị trí tại {os.path.join(dataset_dir, 'box_heatmap.png')}")
    
    print("\nHoàn tất phân tích! Hãy kiểm tra các file ảnh (.png) trong thư mục dataset.")

if __name__ == '__main__':
    # Thư mục chứa dataset hiện tại
    target_dataset = './dataset'
    analyze_yolo_dataset(target_dataset)
