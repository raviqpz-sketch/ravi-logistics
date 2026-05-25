# RAVI LOGISTICS — Architecture & Design Document

## 1. System Overview

RAVI LOGISTICS implements a **microservices architecture** where each warehouse business domain is an independent deployable service. Services communicate via REST APIs, are registered with Eureka for service discovery, and are exposed to the frontend via an API Gateway.

---

## 2. Architecture Principles

| Principle              | Implementation                                      |
|------------------------|-----------------------------------------------------|
| Single Responsibility  | Each service owns one business domain               |
| Loose Coupling         | Services communicate via REST; no shared DB code    |
| Database per Service   | Separate table namespaces (schemas) per service     |
| API First              | All business logic exposed via RESTful APIs         |
| Stateless Services     | No server-side session; JWT-ready design            |
| Centralized Routing    | API Gateway routes all frontend requests            |

---

## 3. Component Architecture

### 3.1 Eureka Server (Port 8761)
- **Purpose**: Service registry and discovery
- **Technology**: Spring Cloud Netflix Eureka
- **Role**: All microservices register themselves on startup. The API Gateway uses Eureka to discover service instances.

### 3.2 API Gateway (Port 8080)
- **Purpose**: Single entry point for all frontend API calls
- **Technology**: Spring Cloud Gateway
- **Features**:
  - Route requests to appropriate microservices
  - CORS configuration for Angular frontend
  - Load balancing via Eureka

### 3.3 Item Service (Port 8081)
- **Domain**: Product/SKU master data
- **Tables**: `items`, `item_locations`, `customers`, `warehouses`
- **Key Operations**: CRUD for items, item-location assignments, customer/warehouse setup
- **Business Rules**:
  - Item code must be unique per customer
  - UOM (Unit of Measure) is required
  - Items must belong to a customer

### 3.4 ASN Service (Port 8082)
- **Domain**: Advance Shipping Notices (inbound receipts)
- **Tables**: `asns`, `asn_lines`, `receipts`, `receipt_lines`
- **Key Operations**: Create ASN, receive against ASN, putaway
- **Business Rules**:
  - ASN cannot be received after its expected date + 7 days tolerance
  - Over-receive not allowed by default
  - ASN transitions: DRAFT → SENT → PARTIALLY_RECEIVED → RECEIVED → CLOSED
  - On receipt completion, trigger inventory update (via REST call to Inventory Service)

### 3.5 Inventory Service (Port 8083)
- **Domain**: Stock management, location tracking
- **Tables**: `inventory`, `inventory_transactions`, `locations`
- **Key Operations**: Check stock, adjust inventory, transfer locations
- **Business Rules**:
  - Available quantity = on_hand - reserved
  - Negative inventory not allowed
  - Every inventory change creates a transaction audit record

### 3.6 Order Service (Port 8084)
- **Domain**: Customer outbound orders
- **Tables**: `orders`, `order_lines`
- **Key Operations**: Create order, allocate inventory, cancel order
- **Business Rules**:
  - Orders can only be placed for items that exist in Item Service
  - Allocation checks available inventory via REST call to Inventory Service
  - Order transitions: CREATED → ALLOCATED → WAVED → PICKED → PACKED → SHIPPED
  - Required ship date drives wave priority

### 3.7 Wave Service (Port 8085)
- **Domain**: Picking wave creation and management
- **Tables**: `waves`, `wave_orders`
- **Key Operations**: Create wave from orders, release wave for picking
- **Business Rules**:
  - Wave groups eligible orders (ALLOCATED status, not yet waved)
  - Can filter by: ship date, carrier, zone, customer
  - Wave transitions: CREATED → RELEASED → PICKING → COMPLETED

### 3.8 Pick Service (Port 8086)
- **Domain**: Picker task management
- **Tables**: `pick_tasks`, `pick_confirmations`
- **Key Operations**: Generate pick tasks from wave, assign to picker, confirm picks
- **Business Rules**:
  - Pick tasks generated per wave per location
  - Short-pick triggers exception handling
  - On all picks confirmed → triggers Pack Service

### 3.9 Pack Service (Port 8087)
- **Domain**: Packing operations
- **Tables**: `pack_tasks`, `pack_boxes`, `pack_box_items`
- **Key Operations**: Assign packer, select box type, scan items into box
- **Business Rules**:
  - All order lines must be packed before completing
  - Box weight/dimension limits enforced
  - Pack completion triggers Shipment Service

### 3.10 Shipment Service (Port 8088)
- **Domain**: Outbound shipment and carrier management
- **Tables**: `shipments`, `shipment_boxes`, `carriers`
- **Key Operations**: Create shipment, assign carrier, generate label, dispatch
- **Business Rules**:
  - One shipment per order (or multi-shipment for partial)
  - Carrier selection based on service level and customer preferences
  - Tracking number generated/recorded on dispatch

---

## 4. Data Flow: Order-to-Ship

```
Customer places Order
       │
  [Order Service]
  Create Order → Status: CREATED
       │
  Inventory Check → [Inventory Service]
       │
  Allocate → Status: ALLOCATED
       │
  [Wave Service]
  Add to Wave → Status: WAVED
  Release Wave
       │
  [Pick Service]
  Generate Pick Tasks
  Assign to Picker → Status: ASSIGNED
  Picker Confirms → Status: PICKED
       │
  [Pack Service]
  Assign to Pack Station
  Pack Items into Boxes → Status: PACKED
       │
  [Shipment Service]
  Create Shipment
  Assign Carrier + Tracking
  Dispatch → Status: SHIPPED
       │
  [Inventory Service]
  Deduct Inventory (confirmed depletion)
```

## 5. Data Flow: ASN Receiving (Inbound)

```
Supplier ships goods → Create ASN
       │
  [ASN Service]
  Create ASN → Status: DRAFT
  Send to Supplier → Status: SENT
       │
  Goods arrive at dock
  Receive ASN Lines → Status: PARTIALLY_RECEIVED
  All lines received → Status: RECEIVED
       │
  Putaway to locations
       │
  [Inventory Service]
  Add to inventory at location → AVAILABLE
```

---

## 6. Database Design

### Database: RAVIEXPRESS (PostgreSQL)

All tables reside in the `RAVIEXPRESS` database. Tables are grouped by service but share the same database to simplify deployment for this implementation.

### Table Groups

| Service    | Tables                                                      |
|------------|-------------------------------------------------------------|
| Master     | `customers`, `warehouses`, `locations`                      |
| Item       | `items`, `item_locations`                                   |
| ASN        | `asns`, `asn_lines`, `receipts`, `receipt_lines`            |
| Inventory  | `inventory`, `inventory_transactions`                       |
| Order      | `orders`, `order_lines`                                     |
| Wave       | `waves`, `wave_orders`                                      |
| Pick       | `pick_tasks`, `pick_confirmations`                          |
| Pack       | `pack_tasks`, `pack_boxes`, `pack_box_items`                |
| Shipment   | `shipments`, `shipment_boxes`, `carriers`                   |

### Key Relationships
```
customers ──< items
customers ──< orders
customers ──< asns
warehouses ──< locations
items ──< asn_lines
items ──< order_lines
items ──< inventory
locations ──< inventory
orders ──< order_lines
orders ──< waves (via wave_orders)
waves ──< pick_tasks
pick_tasks ──< pack_box_items
orders ──< pack_tasks
pack_tasks ──< pack_boxes
pack_boxes ──< shipment_boxes
orders ──< shipments
```

---

## 7. Frontend Architecture (Angular 17)

### Module Structure
```
AppModule
├── CoreModule (singleton services, auth)
│   ├── AuthService
│   ├── ApiService (HTTP wrapper)
│   └── HttpInterceptor
├── SharedModule (reusable components)
│   ├── ConfirmDialogComponent
│   ├── DataTableComponent
│   └── StatusBadgeComponent
└── Feature Modules (lazy-loaded)
    ├── ItemManagementModule
    ├── AsnManagementModule
    ├── InventoryManagementModule
    ├── OrderManagementModule
    ├── WaveManagementModule
    ├── PickManagementModule
    ├── PackManagementModule
    └── ShipmentManagementModule
```

### Routing Strategy
- Lazy loading for all feature modules
- Route guards for authentication
- Breadcrumb navigation

### State Management
- Angular Services with BehaviorSubject for local state
- HttpClient for API calls with error handling
- RxJS operators for data transformation

---

## 8. Security Design

For this implementation, HTTP Basic Authentication is used (username/password per service). In production, replace with:
- OAuth2 / JWT tokens
- Spring Security OAuth2 Resource Server
- Keycloak or Auth0 integration

Default credentials:
- Username: `ravilogistics`
- Password: `ravi@123`

---

## 9. Port Reference

| Service            | Port |
|--------------------|------|
| Eureka Server      | 8761 |
| API Gateway        | 8080 |
| Item Service       | 8081 |
| ASN Service        | 8082 |
| Inventory Service  | 8083 |
| Order Service      | 8084 |
| Wave Service       | 8085 |
| Pick Service       | 8086 |
| Pack Service       | 8087 |
| Shipment Service   | 8088 |
| Angular Frontend   | 4200 |
| PostgreSQL         | 5432 |
