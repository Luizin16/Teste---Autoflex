# Teste---Autoflex
# Inventory & Production Planning (Raw Materials) — Practical Test

Web system to manage **Products**, **Raw Materials**, and their **Bill of Materials (BOM)**, and to calculate **which products and quantities can be produced** with the available raw material stock, prioritizing higher-value products first.

> **Note:** All code, database tables/columns, and API fields are in **English** (RNF007).

---

## ✨ Features

### Backend (API)
- CRUD for **Products** (code, name, price)
- CRUD for **Raw Materials** (code, name, stockQuantity)
- CRUD for **Product BOM** (raw materials linked to a product + requiredQuantity)
- **Production Suggestion** endpoint:
  - Calculates producible products and quantities based on current stock
  - Prioritizes production by **highest product price**
  - Returns total estimated revenue

### Frontend (Web)
- Responsive UI for:
  - Products CRUD
  - Raw Materials CRUD
  - BOM management inside Product screen
  - Production Suggestion screen (list + total revenue)

### Tests (Desired)
- Backend unit tests and integration tests
- Frontend unit tests
- E2E tests with Cypress

---

## 🧰 Tech Stack (Suggested)
- **Backend:** Java + Quarkus (RESTEasy Reactive), Maven
- **Database:** PostgreSQL (Docker)
- **Frontend:** React + Redux Toolkit + Vite
- **E2E:** Cypress
- **API Docs:** OpenAPI / Swagger UI
- **Container:** Docker Compose

> You may swap DB to MySQL/Oracle if needed.

---

## 📁 Repository Structure (Example)

