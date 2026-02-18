# 🚀 Inventory & Production Planning System  
**Practical Technical Test – Autoflex**

Web system to manage **Products**, **Raw Materials**, and their **Bill of Materials (BOM)**, including a smart **Production Suggestion** feature that calculates what can be produced based on available stock — prioritizing higher-value products first.

> All source code, database tables, and API fields are written in **English** (RNF007).

---

## 🎯 Main Features

### 🔹 Backend (API)
- CRUD for **Products**
- CRUD for **Raw Materials**
- CRUD for **Product BOM (Bill of Materials)**
- **Production Suggestion Endpoint**
  - Calculates maximum producible quantity
  - Prioritizes products by highest price
  - Returns total estimated revenue

### 🔹 Frontend (Web App)
- Responsive interface
- Product management
- Raw material management
- BOM management inside Product screen
- Production suggestion view with revenue calculation

### 🔹 Tests (Recommended)
- Backend unit and integration tests
- Frontend unit tests
- End-to-End tests with Cypress

---

## 🧰 Tech Stack

- **Backend:** Java + Quarkus (RESTEasy Reactive)
- **Database:** PostgreSQL (Docker)
- **Frontend:** React + Redux Toolkit + Vite
- **E2E Tests:** Cypress
- **API Documentation:** OpenAPI / Swagger
- **Containerization:** Docker Compose

> Database can be replaced with MySQL or Oracle if required.

---

## 🗃️ Data Model

### Product
- `id`
- `code` (unique)
- `name`
- `price`

### RawMaterial
- `id`
- `code` (unique)
- `name`
- `stockQuantity`

### ProductRawMaterial (BOM)
- `id`
- `productId`
- `rawMaterialId`
- `requiredQuantity`

---

## 🔌 API Endpoints

### Products
- `GET /api/products`
- `POST /api/products`
- `PUT /api/products/{id}`
- `DELETE /api/products/{id}`

### Raw Materials
- `GET /api/raw-materials`
- `POST /api/raw-materials`
- `PUT /api/raw-materials/{id}`
- `DELETE /api/raw-materials/{id}`

### BOM
- `GET /api/products/{productId}/bom`
- `POST /api/products/{productId}/bom`
- `PUT /api/products/{productId}/bom/{bomItemId}`
- `DELETE /api/products/{productId}/bom/{bomItemId}`

### Production Suggestion
- `GET /api/production/suggestion`


### Author 
- Name: Luiz Alves Candido da Silva
- Email: luizlethal338@gmail.com

#### Example Response
```json
{
  "items": [
    {
      "productCode": "P-100",
      "productName": "Item A",
      "unitPrice": 150.00,
      "quantity": 3,
      "subtotal": 450.00
    }
  ],
  "totalRevenue": 450.00
}





