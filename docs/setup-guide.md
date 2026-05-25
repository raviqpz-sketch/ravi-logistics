# RAVI LOGISTICS — Setup Guide

## Prerequisites

| Tool         | Version  | Download                          |
|--------------|----------|-----------------------------------|
| Java         | 17+      | https://adoptium.net              |
| Maven        | 3.9+     | https://maven.apache.org          |
| Node.js      | 18+      | https://nodejs.org                |
| npm          | 9+       | Bundled with Node.js              |
| Angular CLI  | 17+      | `npm install -g @angular/cli`     |
| PostgreSQL   | 15+      | https://www.postgresql.org        |
| Git          | Latest   | https://git-scm.com               |

---

## Step 1: PostgreSQL Database Setup

### 1.1 Start PostgreSQL
```bash
# Windows (if using service)
net start postgresql-x64-15

# macOS
brew services start postgresql@15

# Linux
sudo systemctl start postgresql
```

### 1.2 Run SQL Scripts (in order)
```bash
# Connect as postgres superuser
psql -U postgres

# OR run each script:
psql -U postgres -f database/01-init.sql
psql -U postgres -d RAVIEXPRESS -f database/02-tables.sql
psql -U postgres -d RAVIEXPRESS -f database/03-constraints.sql
psql -U postgres -d RAVIEXPRESS -f database/04-sample-data.sql
psql -U postgres -d RAVIEXPRESS -f database/05-xyz-modems-data.sql
```

### 1.3 Verify Setup
```sql
\c RAVIEXPRESS
\dt   -- should list all tables
SELECT * FROM customers;   -- should show XYZ Modems
SELECT * FROM items LIMIT 5;
```

---

## Step 2: Start Backend Services

### 2.1 Start Eureka Server FIRST
```bash
cd backend/eureka-server
mvn spring-boot:run
# Wait for: "Started EurekaServerApplication"
# Visit: http://localhost:8761
```

### 2.2 Start API Gateway
```bash
cd backend/api-gateway
mvn spring-boot:run
# Wait for: "Started ApiGatewayApplication"
```

### 2.3 Start All Microservices (open separate terminals)
```bash
# Terminal 1
cd backend/item-service && mvn spring-boot:run

# Terminal 2
cd backend/asn-service && mvn spring-boot:run

# Terminal 3
cd backend/inventory-service && mvn spring-boot:run

# Terminal 4
cd backend/order-service && mvn spring-boot:run

# Terminal 5
cd backend/wave-service && mvn spring-boot:run

# Terminal 6
cd backend/pick-service && mvn spring-boot:run

# Terminal 7
cd backend/pack-service && mvn spring-boot:run

# Terminal 8
cd backend/shipment-service && mvn spring-boot:run
```

### 2.4 Verify All Services in Eureka
- Open: http://localhost:8761
- Should see 8 services registered: ITEM-SERVICE, ASN-SERVICE, etc.

---

## Step 3: Start Angular Frontend

```bash
cd frontend/ravi-logistics-ui
npm install
ng serve --open
# Opens: http://localhost:4200
```

---

## Step 4: Test the Application

### Quick Smoke Test via API Gateway

```bash
# Test Item Service
curl http://localhost:8080/api/items -u ravilogistics:ravi@123

# Test Customers
curl http://localhost:8080/api/customers -u ravilogistics:ravi@123

# Test ASN
curl http://localhost:8080/api/asns -u ravilogistics:ravi@123

# Test Orders
curl http://localhost:8080/api/orders -u ravilogistics:ravi@123
```

---

## Step 5: Walk Through a Complete Order Flow

### 5.1 Check Inventory
```bash
curl "http://localhost:8080/api/inventory?customerId=1" -u ravilogistics:ravi@123
```

### 5.2 Create an Order
```bash
curl -X POST http://localhost:8080/api/orders \
  -H "Content-Type: application/json" \
  -u ravilogistics:ravi@123 \
  -d '{
    "customerId": 1,
    "orderNumber": "ORD-TEST-001",
    "requiredShipDate": "2026-05-01",
    "lines": [
      { "itemId": 1, "orderedQty": 10 },
      { "itemId": 2, "orderedQty": 5 }
    ]
  }'
```

### 5.3 Allocate the Order
```bash
curl -X POST http://localhost:8080/api/orders/1/allocate -u ravilogistics:ravi@123
```

### 5.4 Create a Wave
```bash
curl -X POST http://localhost:8080/api/waves \
  -H "Content-Type: application/json" \
  -u ravilogistics:ravi@123 \
  -d '{ "orderIds": [1] }'
```

### 5.5 Release Wave & Generate Picks
```bash
curl -X POST http://localhost:8080/api/waves/1/release -u ravilogistics:ravi@123
```

### 5.6 Confirm Picks
```bash
curl -X POST http://localhost:8080/api/picks/1/confirm \
  -H "Content-Type: application/json" \
  -u ravilogistics:ravi@123 \
  -d '{ "confirmedQty": 10, "pickedBy": "PICKER01" }'
```

### 5.7 Pack Order
```bash
curl -X POST http://localhost:8080/api/packs \
  -H "Content-Type: application/json" \
  -u ravilogistics:ravi@123 \
  -d '{ "orderId": 1, "stationId": 1 }'
```

### 5.8 Create Shipment
```bash
curl -X POST http://localhost:8080/api/shipments \
  -H "Content-Type: application/json" \
  -u ravilogistics:ravi@123 \
  -d '{ "orderId": 1, "carrierId": 1, "trackingNumber": "TRK123456789" }'
```

---

## Troubleshooting

### Service won't start
- Check Java version: `java -version` (must be 17+)
- Check if port is in use: `netstat -an | grep <port>`
- Check Eureka is running first

### Database connection errors
- Verify PostgreSQL is running
- Check credentials in `application.yml` of each service
- Default: host=localhost, port=5432, db=RAVIEXPRESS, user=ravilogistics, password=ravi@123

### Angular can't connect to backend
- Verify API Gateway is running on port 8080
- Check CORS is enabled in gateway config
- Check browser network tab for specific error

### Service not showing in Eureka
- Wait 30 seconds after startup (Eureka heartbeat delay)
- Check `eureka.client.service-url.defaultZone` in service's `application.yml`
