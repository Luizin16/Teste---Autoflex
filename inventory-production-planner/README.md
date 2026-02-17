# Inventory & Production Planning (Raw Materials) — Practical Test

This repository contains a **full working solution** created from scratch:
- **Backend API**: Quarkus (Java 17, Maven), PostgreSQL
- **Frontend Web**: React + Redux Toolkit (Vite), responsive UI
- **Docker Compose**: local database

All code, database tables/columns, and API fields are in **English** (RNF007).

---

## ✅ Features

### Backend (API)
- CRUD: Products (`code`, `name`, `price`)
- CRUD: Raw Materials (`code`, `name`, `stockQuantity`)
- CRUD: BOM association (raw materials required to produce a product)
- Production suggestion:
  - Uses current stock to compute producible quantities
  - Prioritizes **higher product price first**
  - Returns list + total revenue

### Frontend (Web)
- Responsive screens:
  - Products CRUD
  - Raw Materials CRUD
  - BOM management inside Product details
  - Production suggestion screen

---

## 🧰 Prerequisites
- Docker + Docker Compose
- Java 17+
- Maven 3.9+
- Node 18+

---

## ▶️ Run locally

### 1) Start database
```bash
cd backend
docker compose up -d
```

### 2) Run backend
```bash
cd backend
mvn quarkus:dev
```
- API: http://localhost:8080
- Swagger UI: http://localhost:8080/q/swagger-ui

### 3) Run frontend
```bash
cd frontend
npm install
npm run dev
```
- Web: http://localhost:5173

---

## 🧪 Tests (basic)
### Backend
```bash
cd backend
mvn test
```

---

## 📦 Delivery
Publish this repository on GitHub and share the link.

---

## 👤 Author
- Name: Luiz Alves Candido da Silva
- Email: luizlethal338@gmail.com
