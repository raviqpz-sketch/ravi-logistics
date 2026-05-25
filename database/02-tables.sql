-- =============================================================
-- RAVI LOGISTICS - Table Definitions
-- Script 02: All DDL for all microservices
-- Run as: psql -U postgres -d RAVIEXPRESS -f 02-tables.sql
-- =============================================================

-- Grant schema usage
GRANT ALL ON SCHEMA public TO ravilogistics;

-- =============================================================
-- MASTER DATA TABLES (shared reference data)
-- =============================================================

CREATE TABLE IF NOT EXISTS customers (
    customer_id     BIGSERIAL PRIMARY KEY,
    customer_code   VARCHAR(20)  NOT NULL UNIQUE,
    customer_name   VARCHAR(100) NOT NULL,
    contact_name    VARCHAR(100),
    contact_email   VARCHAR(150),
    contact_phone   VARCHAR(20),
    address_line1   VARCHAR(200),
    address_line2   VARCHAR(200),
    city            VARCHAR(100),
    state           VARCHAR(100),
    country         VARCHAR(100) DEFAULT 'USA',
    zip_code        VARCHAR(20),
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS warehouses (
    warehouse_id    BIGSERIAL PRIMARY KEY,
    warehouse_code  VARCHAR(20)  NOT NULL UNIQUE,
    warehouse_name  VARCHAR(100) NOT NULL,
    address_line1   VARCHAR(200),
    city            VARCHAR(100),
    state           VARCHAR(100),
    country         VARCHAR(100) DEFAULT 'USA',
    zip_code        VARCHAR(20),
    total_sqft      NUMERIC(10,2),
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS locations (
    location_id     BIGSERIAL PRIMARY KEY,
    warehouse_id    BIGINT NOT NULL REFERENCES warehouses(warehouse_id),
    location_code   VARCHAR(30)  NOT NULL,
    zone            VARCHAR(10),
    aisle           VARCHAR(10),
    bay             VARCHAR(10),
    level           VARCHAR(10),
    position        VARCHAR(10),
    location_type   VARCHAR(20) DEFAULT 'PICK',  -- PICK, RESERVE, RECEIVE, PACK, SHIP
    max_weight      NUMERIC(10,2),
    max_volume      NUMERIC(10,2),
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(warehouse_id, location_code)
);

CREATE TABLE IF NOT EXISTS carriers (
    carrier_id      BIGSERIAL PRIMARY KEY,
    carrier_code    VARCHAR(20)  NOT NULL UNIQUE,
    carrier_name    VARCHAR(100) NOT NULL,
    service_level   VARCHAR(50),  -- GROUND, EXPRESS, OVERNIGHT, FREIGHT
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================
-- ITEM SERVICE TABLES
-- =============================================================

CREATE TABLE IF NOT EXISTS items (
    item_id         BIGSERIAL PRIMARY KEY,
    customer_id     BIGINT NOT NULL REFERENCES customers(customer_id),
    item_code       VARCHAR(50)  NOT NULL,
    item_name       VARCHAR(200) NOT NULL,
    description     TEXT,
    uom             VARCHAR(20)  NOT NULL DEFAULT 'EA',  -- EA, CS, PLT, KG, LB
    unit_weight     NUMERIC(10,3),
    unit_length     NUMERIC(10,3),
    unit_width      NUMERIC(10,3),
    unit_height     NUMERIC(10,3),
    unit_cost       NUMERIC(12,4),
    unit_price      NUMERIC(12,4),
    category        VARCHAR(100),
    sub_category    VARCHAR(100),
    barcode         VARCHAR(100),
    lot_controlled  BOOLEAN DEFAULT FALSE,
    serial_controlled BOOLEAN DEFAULT FALSE,
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(customer_id, item_code)
);

CREATE TABLE IF NOT EXISTS item_locations (
    item_location_id BIGSERIAL PRIMARY KEY,
    item_id         BIGINT NOT NULL REFERENCES items(item_id),
    warehouse_id    BIGINT NOT NULL REFERENCES warehouses(warehouse_id),
    location_id     BIGINT NOT NULL REFERENCES locations(location_id),
    is_primary      BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(item_id, location_id)
);

-- =============================================================
-- ASN SERVICE TABLES
-- =============================================================

CREATE TABLE IF NOT EXISTS asns (
    asn_id          BIGSERIAL PRIMARY KEY,
    asn_number      VARCHAR(50)  NOT NULL UNIQUE,
    customer_id     BIGINT NOT NULL REFERENCES customers(customer_id),
    warehouse_id    BIGINT NOT NULL REFERENCES warehouses(warehouse_id),
    supplier_name   VARCHAR(200),
    supplier_ref    VARCHAR(100),
    expected_date   DATE NOT NULL,
    status          VARCHAR(30) DEFAULT 'DRAFT',
    -- DRAFT, SENT, IN_TRANSIT, ARRIVED, PARTIALLY_RECEIVED, RECEIVED, CLOSED, CANCELLED
    notes           TEXT,
    created_by      VARCHAR(100),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS asn_lines (
    asn_line_id     BIGSERIAL PRIMARY KEY,
    asn_id          BIGINT NOT NULL REFERENCES asns(asn_id),
    line_number     INTEGER NOT NULL,
    item_id         BIGINT NOT NULL REFERENCES items(item_id),
    expected_qty    NUMERIC(12,3) NOT NULL,
    received_qty    NUMERIC(12,3) DEFAULT 0,
    lot_number      VARCHAR(100),
    expiry_date     DATE,
    status          VARCHAR(30) DEFAULT 'OPEN',  -- OPEN, PARTIALLY_RECEIVED, RECEIVED
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(asn_id, line_number)
);

CREATE TABLE IF NOT EXISTS receipts (
    receipt_id      BIGSERIAL PRIMARY KEY,
    asn_id          BIGINT NOT NULL REFERENCES asns(asn_id),
    receipt_number  VARCHAR(50) NOT NULL UNIQUE,
    warehouse_id    BIGINT NOT NULL REFERENCES warehouses(warehouse_id),
    received_date   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    received_by     VARCHAR(100),
    dock_door       VARCHAR(20),
    status          VARCHAR(30) DEFAULT 'OPEN',  -- OPEN, COMPLETED
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS receipt_lines (
    receipt_line_id  BIGSERIAL PRIMARY KEY,
    receipt_id       BIGINT NOT NULL REFERENCES receipts(receipt_id),
    asn_line_id      BIGINT NOT NULL REFERENCES asn_lines(asn_line_id),
    item_id          BIGINT NOT NULL REFERENCES items(item_id),
    received_qty     NUMERIC(12,3) NOT NULL,
    putaway_location_id BIGINT REFERENCES locations(location_id),
    lot_number       VARCHAR(100),
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================
-- INVENTORY SERVICE TABLES
-- =============================================================

CREATE TABLE IF NOT EXISTS inventory (
    inventory_id    BIGSERIAL PRIMARY KEY,
    customer_id     BIGINT NOT NULL REFERENCES customers(customer_id),
    warehouse_id    BIGINT NOT NULL REFERENCES warehouses(warehouse_id),
    item_id         BIGINT NOT NULL REFERENCES items(item_id),
    location_id     BIGINT NOT NULL REFERENCES locations(location_id),
    lot_number      VARCHAR(100),
    expiry_date     DATE,
    on_hand_qty     NUMERIC(12,3) DEFAULT 0,
    reserved_qty    NUMERIC(12,3) DEFAULT 0,
    available_qty   NUMERIC(12,3) GENERATED ALWAYS AS (on_hand_qty - reserved_qty) STORED,
    uom             VARCHAR(20) NOT NULL DEFAULT 'EA',
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(item_id, location_id, lot_number)
);

CREATE TABLE IF NOT EXISTS inventory_transactions (
    txn_id          BIGSERIAL PRIMARY KEY,
    inventory_id    BIGINT NOT NULL REFERENCES inventory(inventory_id),
    customer_id     BIGINT NOT NULL REFERENCES customers(customer_id),
    item_id         BIGINT NOT NULL REFERENCES items(item_id),
    location_id     BIGINT NOT NULL REFERENCES locations(location_id),
    txn_type        VARCHAR(30) NOT NULL,
    -- RECEIPT, SHIPMENT, ADJUSTMENT, TRANSFER_IN, TRANSFER_OUT, CYCLE_COUNT
    txn_qty         NUMERIC(12,3) NOT NULL,
    before_qty      NUMERIC(12,3),
    after_qty       NUMERIC(12,3),
    reference_type  VARCHAR(50),  -- ASN, ORDER, WAVE, ADJUSTMENT
    reference_id    BIGINT,
    lot_number      VARCHAR(100),
    notes           TEXT,
    created_by      VARCHAR(100),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================
-- ORDER SERVICE TABLES
-- =============================================================

CREATE TABLE IF NOT EXISTS orders (
    order_id            BIGSERIAL PRIMARY KEY,
    order_number        VARCHAR(50)  NOT NULL UNIQUE,
    customer_id         BIGINT NOT NULL REFERENCES customers(customer_id),
    warehouse_id        BIGINT NOT NULL REFERENCES warehouses(warehouse_id),
    order_date          DATE NOT NULL DEFAULT CURRENT_DATE,
    required_ship_date  DATE NOT NULL,
    ship_to_name        VARCHAR(200),
    ship_to_address1    VARCHAR(200),
    ship_to_address2    VARCHAR(200),
    ship_to_city        VARCHAR(100),
    ship_to_state       VARCHAR(100),
    ship_to_country     VARCHAR(100) DEFAULT 'USA',
    ship_to_zip         VARCHAR(20),
    carrier_id          BIGINT REFERENCES carriers(carrier_id),
    service_level       VARCHAR(50),
    status              VARCHAR(30) DEFAULT 'CREATED',
    -- CREATED, ALLOCATED, WAVED, PICKING, PICKED, PACKING, PACKED, SHIPPED, CANCELLED
    priority            INTEGER DEFAULT 5,  -- 1=highest, 10=lowest
    notes               TEXT,
    created_by          VARCHAR(100),
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_lines (
    order_line_id   BIGSERIAL PRIMARY KEY,
    order_id        BIGINT NOT NULL REFERENCES orders(order_id),
    line_number     INTEGER NOT NULL,
    item_id         BIGINT NOT NULL REFERENCES items(item_id),
    ordered_qty     NUMERIC(12,3) NOT NULL,
    allocated_qty   NUMERIC(12,3) DEFAULT 0,
    picked_qty      NUMERIC(12,3) DEFAULT 0,
    packed_qty      NUMERIC(12,3) DEFAULT 0,
    shipped_qty     NUMERIC(12,3) DEFAULT 0,
    status          VARCHAR(30) DEFAULT 'OPEN',
    -- OPEN, ALLOCATED, PARTIALLY_PICKED, PICKED, PACKED, SHIPPED, CANCELLED
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(order_id, line_number)
);

-- =============================================================
-- WAVE SERVICE TABLES
-- =============================================================

CREATE TABLE IF NOT EXISTS waves (
    wave_id         BIGSERIAL PRIMARY KEY,
    wave_number     VARCHAR(50)  NOT NULL UNIQUE,
    warehouse_id    BIGINT NOT NULL REFERENCES warehouses(warehouse_id),
    wave_date       DATE NOT NULL DEFAULT CURRENT_DATE,
    status          VARCHAR(30) DEFAULT 'CREATED',
    -- CREATED, RELEASED, PICKING, COMPLETED, CANCELLED
    total_orders    INTEGER DEFAULT 0,
    total_lines     INTEGER DEFAULT 0,
    total_units     NUMERIC(12,3) DEFAULT 0,
    created_by      VARCHAR(100),
    released_at     TIMESTAMP,
    completed_at    TIMESTAMP,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS wave_orders (
    wave_order_id   BIGSERIAL PRIMARY KEY,
    wave_id         BIGINT NOT NULL REFERENCES waves(wave_id),
    order_id        BIGINT NOT NULL REFERENCES orders(order_id),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(wave_id, order_id)
);

-- =============================================================
-- PICK SERVICE TABLES
-- =============================================================

CREATE TABLE IF NOT EXISTS pick_tasks (
    pick_task_id    BIGSERIAL PRIMARY KEY,
    wave_id         BIGINT NOT NULL REFERENCES waves(wave_id),
    order_id        BIGINT NOT NULL REFERENCES orders(order_id),
    order_line_id   BIGINT NOT NULL REFERENCES order_lines(order_line_id),
    item_id         BIGINT NOT NULL REFERENCES items(item_id),
    inventory_id    BIGINT REFERENCES inventory(inventory_id),
    pick_location_id BIGINT NOT NULL REFERENCES locations(location_id),
    pick_qty        NUMERIC(12,3) NOT NULL,
    confirmed_qty   NUMERIC(12,3) DEFAULT 0,
    lot_number      VARCHAR(100),
    status          VARCHAR(30) DEFAULT 'OPEN',
    -- OPEN, ASSIGNED, PICKING, COMPLETED, SHORT_PICKED, CANCELLED
    picker_id       VARCHAR(100),
    assigned_at     TIMESTAMP,
    completed_at    TIMESTAMP,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pick_confirmations (
    confirmation_id  BIGSERIAL PRIMARY KEY,
    pick_task_id     BIGINT NOT NULL REFERENCES pick_tasks(pick_task_id),
    confirmed_qty    NUMERIC(12,3) NOT NULL,
    picked_by        VARCHAR(100),
    pick_method      VARCHAR(30) DEFAULT 'MANUAL',  -- MANUAL, RF, VOICE, LIGHT
    notes            TEXT,
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================
-- PACK SERVICE TABLES
-- =============================================================

CREATE TABLE IF NOT EXISTS pack_tasks (
    pack_task_id    BIGSERIAL PRIMARY KEY,
    order_id        BIGINT NOT NULL REFERENCES orders(order_id),
    warehouse_id    BIGINT NOT NULL REFERENCES warehouses(warehouse_id),
    station_code    VARCHAR(30),
    status          VARCHAR(30) DEFAULT 'OPEN',
    -- OPEN, IN_PROGRESS, COMPLETED, CANCELLED
    packer_id       VARCHAR(100),
    started_at      TIMESTAMP,
    completed_at    TIMESTAMP,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pack_boxes (
    box_id          BIGSERIAL PRIMARY KEY,
    pack_task_id    BIGINT NOT NULL REFERENCES pack_tasks(pack_task_id),
    box_sequence    INTEGER NOT NULL,
    box_type        VARCHAR(50),  -- SMALL, MEDIUM, LARGE, CUSTOM
    length          NUMERIC(8,2),
    width           NUMERIC(8,2),
    height          NUMERIC(8,2),
    gross_weight    NUMERIC(10,3),
    is_closed       BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(pack_task_id, box_sequence)
);

CREATE TABLE IF NOT EXISTS pack_box_items (
    box_item_id     BIGSERIAL PRIMARY KEY,
    box_id          BIGINT NOT NULL REFERENCES pack_boxes(box_id),
    order_line_id   BIGINT NOT NULL REFERENCES order_lines(order_line_id),
    item_id         BIGINT NOT NULL REFERENCES items(item_id),
    packed_qty      NUMERIC(12,3) NOT NULL,
    lot_number      VARCHAR(100),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================
-- SHIPMENT SERVICE TABLES
-- =============================================================

CREATE TABLE IF NOT EXISTS shipments (
    shipment_id     BIGSERIAL PRIMARY KEY,
    shipment_number VARCHAR(50)  NOT NULL UNIQUE,
    order_id        BIGINT NOT NULL REFERENCES orders(order_id),
    pack_task_id    BIGINT REFERENCES pack_tasks(pack_task_id),
    carrier_id      BIGINT REFERENCES carriers(carrier_id),
    carrier_name    VARCHAR(100),
    service_level   VARCHAR(50),
    tracking_number VARCHAR(100),
    ship_date       DATE,
    estimated_delivery DATE,
    status          VARCHAR(30) DEFAULT 'CREATED',
    -- CREATED, LABEL_PRINTED, DISPATCHED, IN_TRANSIT, DELIVERED, EXCEPTION
    total_weight    NUMERIC(10,3),
    total_boxes     INTEGER DEFAULT 0,
    freight_cost    NUMERIC(10,2),
    shipped_by      VARCHAR(100),
    dispatched_at   TIMESTAMP,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS shipment_boxes (
    shipment_box_id  BIGSERIAL PRIMARY KEY,
    shipment_id      BIGINT NOT NULL REFERENCES shipments(shipment_id),
    box_id           BIGINT NOT NULL REFERENCES pack_boxes(box_id),
    box_label        VARCHAR(100),
    weight           NUMERIC(10,3),
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Grant all table permissions to ravilogistics user
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO ravilogistics;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO ravilogistics;

DO $$ BEGIN RAISE NOTICE 'SUCCESS: All 21 tables created in RAVIEXPRESS database.'; END $$;
