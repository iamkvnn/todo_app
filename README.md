# Todo Management Application

Hệ thống quản lý công việc (Todo App) đơn giản và chuyên nghiệp, bao gồm Backend API viết bằng **Spring Boot (Java)** và Frontend Single Page Application (SPA) viết bằng **React, TypeScript, và Vite**.

---

## Live Demo
* **Backend API**: http://165.22.250.47:8080
* **Frontend UI**: http://165.22.250.47:5173

## 📂 Cấu Trúc Tổng Quan Dự Án

Thư mục gốc của dự án bao gồm hai thành phần chính độc lập:

```text
todo-app/
├── todo/                  # Spring Boot Backend Module
│   ├── src/               # Mã nguồn Java & Cấu hình ứng dụng
│   ├── pom.xml            # Quản lý thư viện Maven
│   ├── Dockerfile         # Dockerfile đóng gói ứng dụng Backend
│   └── mvnw / mvnw.cmd    # Maven Wrapper để chạy dự án không cần cài đặt Maven
│
├── frontend/              # React Vite Frontend Module
│   ├── src/               # Mã nguồn components, pages, hooks, services, types
│   ├── package.json       # Định nghĩa scripts & thư viện (pnpm)
│   ├── Dockerfile         # Dockerfile phục vụ build & chạy tĩnh qua Nginx
│   └── vite.config.ts     # Cấu hình Vite dev server & build
│
├── docker-compose.yml     # File cấu hình Docker Compose chạy toàn bộ hệ thống
└── .env.example           # File ví dụ cấu hình biến môi trường
```

---

## 🛠️ Yêu Cầu Hệ Thống

Để chạy dự án này trên môi trường local, bạn cần chuẩn bị:

*   **Java Development Kit (JDK)**: Phiên bản 21 hoặc mới hơn.
*   **Node.js**: Phiên bản 18 hoặc mới hơn.
*   **Package Manager**: `pnpm` (khuyến nghị) hoặc `npm`/`yarn`.
*   **MySQL Server**: Phiên bản 8.0+ chạy ở cổng `3306`.
*   **Docker & Docker Compose** (Tùy chọn, khuyến nghị nếu muốn chạy nhanh mà không cần cài đặt database/Java).

---

## 🚀 Cách Khởi Chạy Dự Án

```bash
git clone https://github.com/iamkvnn/todo_app.git
cd todo_app
```

### Cách 1: Chạy Nhanh Bằng Docker Compose (Khuyến Nghị)

Đây là cách dễ dàng nhất, Docker sẽ tự động thiết lập Database MySQL, dựng API Backend và SPA Frontend chạy trên Nginx.

1.  Sao chép file cấu hình môi trường:
    ```bash
    cp .env.example .env
    ```
2.  Khởi chạy các service bằng lệnh:
    ```bash
    docker-compose up -d --build
    ```
3.  Truy cập ứng dụng:
    *   **Frontend UI**: [http://localhost:5173](http://localhost:5173)
    *   **Backend API**: [http://localhost:8080](http://localhost:8080)

---

### Cách 2: Khởi Chạy Thủ Công (Local Development)

#### Bước 1: Chuẩn Bị Cơ Sở Dữ Liệu MySQL
*   Tạo một database rỗng tên là `todo` trên MySQL Server cục bộ của bạn.
*   Cấu hình thông tin kết nối cơ sở dữ liệu trong file `todo/src/main/resources/application.yaml` hoặc cung cấp qua biến môi trường (`DB_USERNAME`, `DB_PASSWORD`).

#### Bước 2: Chạy Spring Boot Backend
1.  Di chuyển vào thư mục backend:
    ```bash
    cd todo
    ```
2.  Chạy ứng dụng bằng Maven Wrapper:
    *   **Trên Linux/macOS**:
        ```bash
        ./mvnw spring-boot:run
        ```
    *   **Trên Windows (Command Prompt/PowerShell)**:
        ```cmd
        mvnw.cmd spring-boot:run
        ```
3.  Backend API sẽ khởi chạy trên cổng **8080**.

#### Bước 3: Chạy React Frontend
1.  Di chuyển vào thư mục frontend:
    ```bash
    cd frontend
    ```
2.  Cài đặt các gói thư viện phụ thuộc bằng `pnpm`:
    ```bash
    pnpm install
    ```
3.  Chạy dev server của Vite:
    ```bash
    pnpm dev
    ```
4.  Ứng dụng Frontend SPA sẽ chạy ở địa chỉ [http://localhost:5173](http://localhost:5173).

---

## 🧪 Cách Chạy Tests & Kiểm Tra Định Dạng Code

### 1. Chạy Unit Tests & Integration Tests (Backend)
Spring Boot sử dụng JUnit 5 và Spring Boot Test. Để chạy kiểm thử trong thư mục `todo`:
*   **Trên Linux/macOS**:
    ```bash
    ./mvnw test
    ```
*   **Trên Windows**:
    ```cmd
    mvnw.cmd test
    ```

### 2. Kiểm Tra Lỗi Biên Dịch & Định Dạng (Frontend)
Trong thư mục `frontend`:
*   **Biên dịch kiểm tra TypeScript (Type check) & Build thử**:
    ```bash
    pnpm build
    ```
*   **Chạy Linter để kiểm tra quy chuẩn viết code**:
    ```bash
    pnpm lint
    ```

---
