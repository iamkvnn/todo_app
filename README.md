# Todo Management Application

Hệ thống quản lý công việc (Todo App) đơn giản và chuyên nghiệp, bao gồm Backend API viết bằng **Spring Boot (Java)** và Frontend Single Page Application (SPA) viết bằng **React, TypeScript, và Vite**.

---

## Live Demo
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

*   **Docker & Docker Compose**

---

## 🚀 Cách Khởi Chạy Dự Án

```bash
git clone https://github.com/iamkvnn/todo_app.git
cd todo_app
```

### Chạy Nhanh Bằng Docker Compose (Khuyến Nghị)

Đây là cách dễ dàng nhất, Docker sẽ tự động thiết lập Database MySQL, dựng API Backend và SPA Frontend chạy trên Nginx.

1.  Sao chép file cấu hình môi trường:
    ```bash
    cp .env.example .env
    ```
    
    hoặc

    ```cmd
    copy .env.example .env
    ```
2.  Khởi chạy các service bằng lệnh:
    ```bash
    docker-compose up -d --build
    ```
3.  Truy cập ứng dụng:
    *   **Frontend UI**: [http://localhost:5173](http://localhost:5173)

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
