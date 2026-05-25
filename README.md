# RAVI LOGISTICS - Warehouse Management System

A full-featured, microservices-based Warehouse Management System (WMS) built with **Angular 17** (frontend), **Spring Boot 3.2** (backend microservices), and **PostgreSQL** (database).

---

## Product Overview

**RAVI LOGISTICS** is an enterprise-grade WMS that handles the complete lifecycle of warehouse operations — from receiving goods via ASN to shipping orders to customers. The system is built as independent microservices, each responsible for a specific business domain.

### Sample Customer
- **XYZ Modems** — Electronics distributor onboarded as the pilot customer.

---

## Technology Stack

| Layer        | Technology                        |
|--------------|-----------------------------------|
| Frontend     | Angular 17, Angular Material, RxJS |
| Backend      | Spring Boot 3.2, Spring Cloud 2023 |
| Database     | PostgreSQL 15 (DB: RAVIEXPRESS)   |
| Service Discovery | Netflix Eureka               |
| API Gateway  | Spring Cloud Gateway              |
| Build Tool   | Maven 3.9                         |
| Java Version | Java 17                           |

---

## Microservices Architecture

```
                    ┌─────────────────────┐
                    │   Angular Frontend   │
                    │    (Port: 4200)      │
                    └─────────┬───────────┘
                              │ HTTP
                    ┌─────────▼───────────┐
                    │    API Gateway       │
                    │    (Port: 8080)      │
                    └─────────┬───────────┘
                              │
              ┌───────────────▼───────────────┐
              │        Eureka Server           │
              │        (Port: 8761)            │
              └───────────────────────────────┘
                              │ Service Registry
    ┌─────────┬───────────┬───┴──────┬──────────┬──────────┐
    │         │           │          │          │          │
 Item       ASN      Inventory   Order      Wave      Pick
(8081)    (8082)     (8083)     (8084)    (8085)    (8086)
    │                                              │
    └──────────┬──────────────────────────────────┘
               │                        ┌──────┬──────────┐
             Pack                    Shipment             │
            (8087)                   (8088)               │
               │                                          │
               └──────────────────────────────────────────┘
                              │
                    ┌─────────▼───────────┐
                    │   PostgreSQL DB      │
                    │   RAVIEXPRESS        │
                    │   (Port: 5432)       │
                    └─────────────────────┘
```

---

## Modules / Screens

| Module              | Microservice Port | Description                                              |
|---------------------|-------------------|----------------------------------------------------------|
| Item Management     | 8081              | Manage products/SKUs, UOM, dimensions, pricing           |
| ASN Management      | 8082              | Advance Shipping Notices, receiving, putaway             |
| Inventory Management| 8083              | Stock levels, locations, lot tracking, adjustments       |
| Order Management    | 8084              | Customer orders, order lines, allocation                 |
| Wave Management     | 8085              | Batch orders into pick waves, optimize picks             |
| Pick Management     | 8086              | Pick tasks, picker assignments, confirmations            |
| Pack Management     | 8087              | Pack stations, cartonization, box assignment             |
| Shipment Management | 8088              | Carrier assignment, tracking, dispatch                   |

---

## Quick Start

### Prerequisites
- Java 17+
- Maven 3.9+
- Node.js 18+, npm 9+
- PostgreSQL 15+
- Angular CLI 17+

### 1. Database Setup
```bash
cd database/
psql -U postgres -f 01-init.sql
psql -U postgres -d RAVIEXPRESS -f 02-tables.sql
psql -U postgres -d RAVIEXPRESS -f 03-constraints.sql
psql -U postgres -d RAVIEXPRESS -f 04-sample-data.sql
psql -U postgres -d RAVIEXPRESS -f 05-xyz-modems-data.sql
```

### 2. Start Backend Services (in order)
```bash
# 1. Eureka Server
cd backend/eureka-server && mvn spring-boot:run

# 2. API Gateway
cd backend/api-gateway && mvn spring-boot:run

# 3. All microservices (each in a separate terminal)
cd backend/item-service && mvn spring-boot:run
cd backend/asn-service && mvn spring-boot:run
cd backend/inventory-service && mvn spring-boot:run
cd backend/order-service && mvn spring-boot:run
cd backend/wave-service && mvn spring-boot:run
cd backend/pick-service && mvn spring-boot:run
cd backend/pack-service && mvn spring-boot:run
cd backend/shipment-service && mvn spring-boot:run
```

### 3. Start Frontend
```bash
cd frontend/ravi-logistics-ui
npm install
ng serve
# Open: http://localhost:4200
```

---

## API Endpoints Summary

All APIs are accessible via the gateway at `http://localhost:8080`

| Service    | Base Path           |
|------------|---------------------|
| Items      | /api/items          |
| ASN        | /api/asns           |
| Inventory  | /api/inventory      |
| Orders     | /api/orders         |
| Waves      | /api/waves          |
| Picks      | /api/picks          |
| Packs      | /api/packs          |
| Shipments  | /api/shipments      |

---

## Project Structure
```
ravi-logistics/
├── README.md
├── docs/
│   ├── architecture.md
│   └── setup-guide.md
├── database/
│   ├── 01-init.sql            # DB + user creation
│   ├── 02-tables.sql          # All table DDL
│   ├── 03-constraints.sql     # Indexes + FK constraints
│   ├── 04-sample-data.sql     # Master data (warehouses, locations)
│   └── 05-xyz-modems-data.sql # XYZ Modems customer data + transactions
├── backend/
│   ├── eureka-server/
│   ├── api-gateway/
│   ├── item-service/
│   ├── asn-service/
│   ├── inventory-service/
│   ├── order-service/
│   ├── wave-service/
│   ├── pick-service/
│   ├── pack-service/
│   └── shipment-service/
└── frontend/
    └── ravi-logistics-ui/
```
