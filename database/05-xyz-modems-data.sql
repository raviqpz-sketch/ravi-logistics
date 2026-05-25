-- =============================================================
-- RAVI LOGISTICS - XYZ Modems Customer Onboarding
-- Script 05: Complete customer setup + sample transactions
-- =============================================================

-- -------------------------------------------------------
-- 1. CUSTOMER SETUP
-- -------------------------------------------------------
INSERT INTO customers (customer_code, customer_name, contact_name, contact_email, contact_phone,
                       address_line1, city, state, country, zip_code)
VALUES ('XYZMDM', 'XYZ Modems Inc.', 'Michael Johnson', 'mjohnson@xyzmodems.com', '972-555-0101',
        '2500 Technology Park Dr', 'Plano', 'TX', 'USA', '75023');

-- customer_id will be 1 (assuming fresh DB). Use it below.
DO $$ DECLARE v_cust_id BIGINT; BEGIN SELECT customer_id INTO v_cust_id FROM customers WHERE customer_code = 'XYZMDM'; END $$;

-- -------------------------------------------------------
-- 2. ITEMS for XYZ Modems
-- -------------------------------------------------------
INSERT INTO items (customer_id, item_code, item_name, description, uom, unit_weight, unit_length, unit_width, unit_height, unit_cost, unit_price, category, barcode)
SELECT c.customer_id, item_code, item_name, description, uom, unit_weight, unit_length, unit_width, unit_height, unit_cost, unit_price, category, barcode
FROM customers c,
(VALUES
  ('MODEM-5G-PRO',   'XYZ 5G Modem Pro',        '5G WiFi 6E Router with 10Gbps',  'EA', 0.850, 12.0, 9.0, 3.5, 89.99,  149.99, 'NETWORKING', '0012345678901'),
  ('MODEM-5G-STD',   'XYZ 5G Modem Standard',   '5G Router Standard Edition',      'EA', 0.750, 11.0, 8.5, 3.0, 59.99,   99.99, 'NETWORKING', '0012345678902'),
  ('MODEM-CABLE-AC', 'XYZ Cable Modem AC3200',   'DOCSIS 3.1 Cable Modem AC3200',   'EA', 0.950, 10.0, 7.0, 3.5, 74.99,  129.99, 'NETWORKING', '0012345678903'),
  ('ROUTER-MESH-TRI','XYZ Mesh Router Tri-Band', 'Whole Home Mesh WiFi Tri-Band',   'EA', 1.200, 14.0, 10.0, 4.0, 119.99, 199.99, 'NETWORKING', '0012345678904'),
  ('EXTENDER-AX6000','XYZ WiFi Extender AX6000', 'AX6000 Dual Band Extender',       'EA', 0.450, 8.0,  6.0, 2.5, 34.99,   59.99, 'NETWORKING', '0012345678905'),
  ('CABLE-CAT8-3FT', 'XYZ Cat8 Cable 3ft',       'Cat8 Ethernet Cable 3 feet',      'EA', 0.120, 6.0,  4.0, 1.0,  2.99,    7.99, 'CABLES',     '0012345678906'),
  ('CABLE-CAT8-6FT', 'XYZ Cat8 Cable 6ft',       'Cat8 Ethernet Cable 6 feet',      'EA', 0.180, 8.0,  4.0, 1.0,  3.99,    9.99, 'CABLES',     '0012345678907'),
  ('CABLE-CAT8-10FT','XYZ Cat8 Cable 10ft',      'Cat8 Ethernet Cable 10 feet',     'EA', 0.250, 10.0, 4.0, 1.0,  4.99,   12.99, 'CABLES',     '0012345678908'),
  ('SWITCH-8PT',     'XYZ 8-Port Switch',        '8-Port Gigabit Unmanaged Switch',  'EA', 0.600, 9.0,  5.5, 2.0, 24.99,   44.99, 'NETWORKING', '0012345678909'),
  ('SWITCH-16PT',    'XYZ 16-Port Switch',       '16-Port Gigabit Managed Switch',   'EA', 1.800, 17.0, 8.0, 2.5, 79.99,  139.99, 'NETWORKING', '0012345678910'),
  ('MODEM-DSL-VDSL', 'XYZ DSL/VDSL Modem',      'VDSL2/ADSL2+ Bonded Modem',       'EA', 0.650, 10.0, 7.0, 2.5, 39.99,   69.99, 'NETWORKING', '0012345678911'),
  ('ADAPTER-PCIE-AX','XYZ PCIe WiFi Adapter AX', 'AX3000 PCIe WiFi 6 Adapter',      'EA', 0.250, 7.0,  5.0, 1.5, 29.99,   54.99, 'ADAPTERS',   '0012345678912')
) AS items_data(item_code, item_name, description, uom, unit_weight, unit_length, unit_width, unit_height, unit_cost, unit_price, category, barcode)
WHERE c.customer_code = 'XYZMDM';

-- -------------------------------------------------------
-- 3. ITEM LOCATIONS (assign pick locations)
-- -------------------------------------------------------
INSERT INTO item_locations (item_id, warehouse_id, location_id, is_primary)
SELECT i.item_id, 1, l.location_id, TRUE
FROM items i, locations l, customers c
WHERE c.customer_code = 'XYZMDM'
  AND i.customer_id = c.customer_id
  AND i.item_code = 'MODEM-5G-PRO' AND l.location_code = 'A-01-01-A';

INSERT INTO item_locations (item_id, warehouse_id, location_id, is_primary)
SELECT i.item_id, 1, l.location_id, TRUE
FROM items i, locations l, customers c
WHERE c.customer_code = 'XYZMDM' AND i.customer_id = c.customer_id
  AND i.item_code = 'MODEM-5G-STD' AND l.location_code = 'A-01-01-B';

INSERT INTO item_locations (item_id, warehouse_id, location_id, is_primary)
SELECT i.item_id, 1, l.location_id, TRUE
FROM items i, locations l, customers c
WHERE c.customer_code = 'XYZMDM' AND i.customer_id = c.customer_id
  AND i.item_code = 'MODEM-CABLE-AC' AND l.location_code = 'A-01-01-C';

INSERT INTO item_locations (item_id, warehouse_id, location_id, is_primary)
SELECT i.item_id, 1, l.location_id, TRUE
FROM items i, locations l, customers c
WHERE c.customer_code = 'XYZMDM' AND i.customer_id = c.customer_id
  AND i.item_code = 'ROUTER-MESH-TRI' AND l.location_code = 'A-01-02-A';

INSERT INTO item_locations (item_id, warehouse_id, location_id, is_primary)
SELECT i.item_id, 1, l.location_id, TRUE
FROM items i, locations l, customers c
WHERE c.customer_code = 'XYZMDM' AND i.customer_id = c.customer_id
  AND i.item_code = 'EXTENDER-AX6000' AND l.location_code = 'A-01-02-B';

INSERT INTO item_locations (item_id, warehouse_id, location_id, is_primary)
SELECT i.item_id, 1, l.location_id, TRUE
FROM items i, locations l, customers c
WHERE c.customer_code = 'XYZMDM' AND i.customer_id = c.customer_id
  AND i.item_code = 'CABLE-CAT8-3FT' AND l.location_code = 'B-01-01-A';

INSERT INTO item_locations (item_id, warehouse_id, location_id, is_primary)
SELECT i.item_id, 1, l.location_id, TRUE
FROM items i, locations l, customers c
WHERE c.customer_code = 'XYZMDM' AND i.customer_id = c.customer_id
  AND i.item_code = 'CABLE-CAT8-6FT' AND l.location_code = 'B-01-01-B';

INSERT INTO item_locations (item_id, warehouse_id, location_id, is_primary)
SELECT i.item_id, 1, l.location_id, TRUE
FROM items i, locations l, customers c
WHERE c.customer_code = 'XYZMDM' AND i.customer_id = c.customer_id
  AND i.item_code = 'CABLE-CAT8-10FT' AND l.location_code = 'B-01-02-A';

INSERT INTO item_locations (item_id, warehouse_id, location_id, is_primary)
SELECT i.item_id, 1, l.location_id, TRUE
FROM items i, locations l, customers c
WHERE c.customer_code = 'XYZMDM' AND i.customer_id = c.customer_id
  AND i.item_code = 'SWITCH-8PT' AND l.location_code = 'A-02-01-A';

INSERT INTO item_locations (item_id, warehouse_id, location_id, is_primary)
SELECT i.item_id, 1, l.location_id, TRUE
FROM items i, locations l, customers c
WHERE c.customer_code = 'XYZMDM' AND i.customer_id = c.customer_id
  AND i.item_code = 'SWITCH-16PT' AND l.location_code = 'A-02-01-B';

INSERT INTO item_locations (item_id, warehouse_id, location_id, is_primary)
SELECT i.item_id, 1, l.location_id, TRUE
FROM items i, locations l, customers c
WHERE c.customer_code = 'XYZMDM' AND i.customer_id = c.customer_id
  AND i.item_code = 'MODEM-DSL-VDSL' AND l.location_code = 'B-02-01-A';

INSERT INTO item_locations (item_id, warehouse_id, location_id, is_primary)
SELECT i.item_id, 1, l.location_id, TRUE
FROM items i, locations l, customers c
WHERE c.customer_code = 'XYZMDM' AND i.customer_id = c.customer_id
  AND i.item_code = 'ADAPTER-PCIE-AX' AND l.location_code = 'A-01-01-A'
ON CONFLICT DO NOTHING;

-- -------------------------------------------------------
-- 4. ASN - Initial Inbound Shipment
-- -------------------------------------------------------
INSERT INTO asns (asn_number, customer_id, warehouse_id, supplier_name, supplier_ref, expected_date, status, created_by)
SELECT 'ASN-XYZ-2026-001', c.customer_id, 1, 'Shenzhen Electronics Co.', 'PO-SE-20260401', '2026-04-20', 'RECEIVED', 'ADMIN'
FROM customers c WHERE c.customer_code = 'XYZMDM';

INSERT INTO asns (asn_number, customer_id, warehouse_id, supplier_name, supplier_ref, expected_date, status, created_by)
SELECT 'ASN-XYZ-2026-002', c.customer_id, 1, 'Taiwan Networking Ltd.', 'PO-TN-20260405', '2026-04-25', 'SENT', 'ADMIN'
FROM customers c WHERE c.customer_code = 'XYZMDM';

-- ASN Lines for ASN-XYZ-2026-001 (already received)
INSERT INTO asn_lines (asn_id, line_number, item_id, expected_qty, received_qty, status)
SELECT a.asn_id, 1, i.item_id, 500, 500, 'RECEIVED'
FROM asns a, items i, customers c
WHERE a.asn_number='ASN-XYZ-2026-001' AND i.item_code='MODEM-5G-PRO' AND c.customer_code='XYZMDM' AND i.customer_id=c.customer_id;

INSERT INTO asn_lines (asn_id, line_number, item_id, expected_qty, received_qty, status)
SELECT a.asn_id, 2, i.item_id, 750, 750, 'RECEIVED'
FROM asns a, items i, customers c
WHERE a.asn_number='ASN-XYZ-2026-001' AND i.item_code='MODEM-5G-STD' AND c.customer_code='XYZMDM' AND i.customer_id=c.customer_id;

INSERT INTO asn_lines (asn_id, line_number, item_id, expected_qty, received_qty, status)
SELECT a.asn_id, 3, i.item_id, 300, 300, 'RECEIVED'
FROM asns a, items i, customers c
WHERE a.asn_number='ASN-XYZ-2026-001' AND i.item_code='MODEM-CABLE-AC' AND c.customer_code='XYZMDM' AND i.customer_id=c.customer_id;

INSERT INTO asn_lines (asn_id, line_number, item_id, expected_qty, received_qty, status)
SELECT a.asn_id, 4, i.item_id, 200, 200, 'RECEIVED'
FROM asns a, items i, customers c
WHERE a.asn_number='ASN-XYZ-2026-001' AND i.item_code='ROUTER-MESH-TRI' AND c.customer_code='XYZMDM' AND i.customer_id=c.customer_id;

INSERT INTO asn_lines (asn_id, line_number, item_id, expected_qty, received_qty, status)
SELECT a.asn_id, 5, i.item_id, 1000, 1000, 'RECEIVED'
FROM asns a, items i, customers c
WHERE a.asn_number='ASN-XYZ-2026-001' AND i.item_code='CABLE-CAT8-3FT' AND c.customer_code='XYZMDM' AND i.customer_id=c.customer_id;

INSERT INTO asn_lines (asn_id, line_number, item_id, expected_qty, received_qty, status)
SELECT a.asn_id, 6, i.item_id, 1000, 1000, 'RECEIVED'
FROM asns a, items i, customers c
WHERE a.asn_number='ASN-XYZ-2026-001' AND i.item_code='CABLE-CAT8-6FT' AND c.customer_code='XYZMDM' AND i.customer_id=c.customer_id;

INSERT INTO asn_lines (asn_id, line_number, item_id, expected_qty, received_qty, status)
SELECT a.asn_id, 7, i.item_id, 500, 500, 'RECEIVED'
FROM asns a, items i, customers c
WHERE a.asn_number='ASN-XYZ-2026-001' AND i.item_code='SWITCH-8PT' AND c.customer_code='XYZMDM' AND i.customer_id=c.customer_id;

-- ASN Lines for ASN-XYZ-2026-002 (pending)
INSERT INTO asn_lines (asn_id, line_number, item_id, expected_qty, received_qty, status)
SELECT a.asn_id, 1, i.item_id, 400, 0, 'OPEN'
FROM asns a, items i, customers c
WHERE a.asn_number='ASN-XYZ-2026-002' AND i.item_code='EXTENDER-AX6000' AND c.customer_code='XYZMDM' AND i.customer_id=c.customer_id;

INSERT INTO asn_lines (asn_id, line_number, item_id, expected_qty, received_qty, status)
SELECT a.asn_id, 2, i.item_id, 250, 0, 'OPEN'
FROM asns a, items i, customers c
WHERE a.asn_number='ASN-XYZ-2026-002' AND i.item_code='SWITCH-16PT' AND c.customer_code='XYZMDM' AND i.customer_id=c.customer_id;

-- -------------------------------------------------------
-- 5. INVENTORY (current stock on hand)
-- -------------------------------------------------------
INSERT INTO inventory (customer_id, warehouse_id, item_id, location_id, on_hand_qty, reserved_qty, uom)
SELECT c.customer_id, 1, i.item_id, l.location_id, 480, 50, 'EA'
FROM items i, locations l, customers c
WHERE c.customer_code='XYZMDM' AND i.customer_id=c.customer_id AND i.item_code='MODEM-5G-PRO' AND l.location_code='A-01-01-A';

INSERT INTO inventory (customer_id, warehouse_id, item_id, location_id, on_hand_qty, reserved_qty, uom)
SELECT c.customer_id, 1, i.item_id, l.location_id, 720, 100, 'EA'
FROM items i, locations l, customers c
WHERE c.customer_code='XYZMDM' AND i.customer_id=c.customer_id AND i.item_code='MODEM-5G-STD' AND l.location_code='A-01-01-B';

INSERT INTO inventory (customer_id, warehouse_id, item_id, location_id, on_hand_qty, reserved_qty, uom)
SELECT c.customer_id, 1, i.item_id, l.location_id, 285, 30, 'EA'
FROM items i, locations l, customers c
WHERE c.customer_code='XYZMDM' AND i.customer_id=c.customer_id AND i.item_code='MODEM-CABLE-AC' AND l.location_code='A-01-01-C';

INSERT INTO inventory (customer_id, warehouse_id, item_id, location_id, on_hand_qty, reserved_qty, uom)
SELECT c.customer_id, 1, i.item_id, l.location_id, 195, 20, 'EA'
FROM items i, locations l, customers c
WHERE c.customer_code='XYZMDM' AND i.customer_id=c.customer_id AND i.item_code='ROUTER-MESH-TRI' AND l.location_code='A-01-02-A';

INSERT INTO inventory (customer_id, warehouse_id, item_id, location_id, on_hand_qty, reserved_qty, uom)
SELECT c.customer_id, 1, i.item_id, l.location_id, 980, 50, 'EA'
FROM items i, locations l, customers c
WHERE c.customer_code='XYZMDM' AND i.customer_id=c.customer_id AND i.item_code='CABLE-CAT8-3FT' AND l.location_code='B-01-01-A';

INSERT INTO inventory (customer_id, warehouse_id, item_id, location_id, on_hand_qty, reserved_qty, uom)
SELECT c.customer_id, 1, i.item_id, l.location_id, 960, 75, 'EA'
FROM items i, locations l, customers c
WHERE c.customer_code='XYZMDM' AND i.customer_id=c.customer_id AND i.item_code='CABLE-CAT8-6FT' AND l.location_code='B-01-01-B';

INSERT INTO inventory (customer_id, warehouse_id, item_id, location_id, on_hand_qty, reserved_qty, uom)
SELECT c.customer_id, 1, i.item_id, l.location_id, 470, 60, 'EA'
FROM items i, locations l, customers c
WHERE c.customer_code='XYZMDM' AND i.customer_id=c.customer_id AND i.item_code='SWITCH-8PT' AND l.location_code='A-02-01-A';

-- -------------------------------------------------------
-- 6. ORDERS for XYZ Modems
-- -------------------------------------------------------
-- Order 1: Already shipped
INSERT INTO orders (order_number, customer_id, warehouse_id, order_date, required_ship_date,
                    ship_to_name, ship_to_address1, ship_to_city, ship_to_state, ship_to_zip,
                    carrier_id, service_level, status, priority)
SELECT 'ORD-XYZ-2026-0001', c.customer_id, 1, '2026-04-10', '2026-04-15',
       'Best Buy Distribution Center', '7601 Penn Ave S', 'Richfield', 'MN', '55423',
       cr.carrier_id, 'GROUND', 'SHIPPED', 3
FROM customers c, carriers cr WHERE c.customer_code='XYZMDM' AND cr.carrier_code='UPS-GRD';

INSERT INTO order_lines (order_id, line_number, item_id, ordered_qty, allocated_qty, picked_qty, packed_qty, shipped_qty, status)
SELECT o.order_id, 1, i.item_id, 50, 50, 50, 50, 50, 'SHIPPED'
FROM orders o, items i, customers c
WHERE o.order_number='ORD-XYZ-2026-0001' AND i.item_code='MODEM-5G-PRO' AND c.customer_code='XYZMDM' AND i.customer_id=c.customer_id;

INSERT INTO order_lines (order_id, line_number, item_id, ordered_qty, allocated_qty, picked_qty, packed_qty, shipped_qty, status)
SELECT o.order_id, 2, i.item_id, 100, 100, 100, 100, 100, 'SHIPPED'
FROM orders o, items i, customers c
WHERE o.order_number='ORD-XYZ-2026-0001' AND i.item_code='MODEM-5G-STD' AND c.customer_code='XYZMDM' AND i.customer_id=c.customer_id;

-- Order 2: Allocated, ready to wave
INSERT INTO orders (order_number, customer_id, warehouse_id, order_date, required_ship_date,
                    ship_to_name, ship_to_address1, ship_to_city, ship_to_state, ship_to_zip,
                    carrier_id, service_level, status, priority)
SELECT 'ORD-XYZ-2026-0002', c.customer_id, 1, '2026-04-20', '2026-04-24',
       'Micro Center', '1350 State Rte 57', 'Sunnyvale', 'CA', '94086',
       cr.carrier_id, '2-DAY', 'ALLOCATED', 2
FROM customers c, carriers cr WHERE c.customer_code='XYZMDM' AND cr.carrier_code='UPS-2DA';

INSERT INTO order_lines (order_id, line_number, item_id, ordered_qty, allocated_qty, picked_qty, packed_qty, shipped_qty, status)
SELECT o.order_id, 1, i.item_id, 20, 20, 0, 0, 0, 'ALLOCATED'
FROM orders o, items i, customers c
WHERE o.order_number='ORD-XYZ-2026-0002' AND i.item_code='MODEM-5G-PRO' AND c.customer_code='XYZMDM' AND i.customer_id=c.customer_id;

INSERT INTO order_lines (order_id, line_number, item_id, ordered_qty, allocated_qty, picked_qty, packed_qty, shipped_qty, status)
SELECT o.order_id, 2, i.item_id, 15, 15, 0, 0, 0, 'ALLOCATED'
FROM orders o, items i, customers c
WHERE o.order_number='ORD-XYZ-2026-0002' AND i.item_code='ROUTER-MESH-TRI' AND c.customer_code='XYZMDM' AND i.customer_id=c.customer_id;

INSERT INTO order_lines (order_id, line_number, item_id, ordered_qty, allocated_qty, picked_qty, packed_qty, shipped_qty, status)
SELECT o.order_id, 3, i.item_id, 30, 30, 0, 0, 0, 'ALLOCATED'
FROM orders o, items i, customers c
WHERE o.order_number='ORD-XYZ-2026-0002' AND i.item_code='CABLE-CAT8-6FT' AND c.customer_code='XYZMDM' AND i.customer_id=c.customer_id;

-- Order 3: New order, needs allocation
INSERT INTO orders (order_number, customer_id, warehouse_id, order_date, required_ship_date,
                    ship_to_name, ship_to_address1, ship_to_city, ship_to_state, ship_to_zip,
                    carrier_id, service_level, status, priority)
SELECT 'ORD-XYZ-2026-0003', c.customer_id, 1, '2026-04-22', '2026-04-28',
       'Newegg Fulfillment Center', '17560 Rowland St', 'City of Industry', 'CA', '91748',
       cr.carrier_id, 'GROUND', 'CREATED', 5
FROM customers c, carriers cr WHERE c.customer_code='XYZMDM' AND cr.carrier_code='FEDEX-GRD';

INSERT INTO order_lines (order_id, line_number, item_id, ordered_qty, allocated_qty, status)
SELECT o.order_id, 1, i.item_id, 35, 0, 'OPEN'
FROM orders o, items i, customers c
WHERE o.order_number='ORD-XYZ-2026-0003' AND i.item_code='MODEM-CABLE-AC' AND c.customer_code='XYZMDM' AND i.customer_id=c.customer_id;

INSERT INTO order_lines (order_id, line_number, item_id, ordered_qty, allocated_qty, status)
SELECT o.order_id, 2, i.item_id, 50, 0, 'OPEN'
FROM orders o, items i, customers c
WHERE o.order_number='ORD-XYZ-2026-0003' AND i.item_code='CABLE-CAT8-3FT' AND c.customer_code='XYZMDM' AND i.customer_id=c.customer_id;

INSERT INTO order_lines (order_id, line_number, item_id, ordered_qty, allocated_qty, status)
SELECT o.order_id, 3, i.item_id, 25, 0, 'OPEN'
FROM orders o, items i, customers c
WHERE o.order_number='ORD-XYZ-2026-0003' AND i.item_code='SWITCH-8PT' AND c.customer_code='XYZMDM' AND i.customer_id=c.customer_id;

-- -------------------------------------------------------
-- 7. WAVE + PICKS for Order 2
-- -------------------------------------------------------
INSERT INTO waves (wave_number, warehouse_id, wave_date, status, total_orders, total_lines, total_units, created_by)
VALUES ('WAVE-2026-001', 1, '2026-04-22', 'RELEASED', 1, 3, 65, 'ADMIN');

INSERT INTO wave_orders (wave_id, order_id)
SELECT w.wave_id, o.order_id
FROM waves w, orders o
WHERE w.wave_number='WAVE-2026-001' AND o.order_number='ORD-XYZ-2026-0002';

-- Pick tasks for Wave-2026-001
INSERT INTO pick_tasks (wave_id, order_id, order_line_id, item_id, pick_location_id, pick_qty, status, picker_id)
SELECT w.wave_id, o.order_id, ol.order_line_id, ol.item_id, l.location_id, ol.ordered_qty, 'OPEN', NULL
FROM waves w, orders o, order_lines ol, locations l, items i
WHERE w.wave_number='WAVE-2026-001'
  AND o.order_number='ORD-XYZ-2026-0002'
  AND ol.order_id=o.order_id
  AND ol.line_number=1
  AND i.item_id=ol.item_id
  AND i.item_code='MODEM-5G-PRO'
  AND l.location_code='A-01-01-A';

INSERT INTO pick_tasks (wave_id, order_id, order_line_id, item_id, pick_location_id, pick_qty, status, picker_id)
SELECT w.wave_id, o.order_id, ol.order_line_id, ol.item_id, l.location_id, ol.ordered_qty, 'OPEN', NULL
FROM waves w, orders o, order_lines ol, locations l, items i
WHERE w.wave_number='WAVE-2026-001'
  AND o.order_number='ORD-XYZ-2026-0002'
  AND ol.order_id=o.order_id
  AND ol.line_number=2
  AND i.item_id=ol.item_id
  AND i.item_code='ROUTER-MESH-TRI'
  AND l.location_code='A-01-02-A';

INSERT INTO pick_tasks (wave_id, order_id, order_line_id, item_id, pick_location_id, pick_qty, status, picker_id)
SELECT w.wave_id, o.order_id, ol.order_line_id, ol.item_id, l.location_id, ol.ordered_qty, 'OPEN', NULL
FROM waves w, orders o, order_lines ol, locations l, items i
WHERE w.wave_number='WAVE-2026-001'
  AND o.order_number='ORD-XYZ-2026-0002'
  AND ol.order_id=o.order_id
  AND ol.line_number=3
  AND i.item_id=ol.item_id
  AND i.item_code='CABLE-CAT8-6FT'
  AND l.location_code='B-01-01-B';

-- -------------------------------------------------------
-- 8. SHIPMENT for Order 1 (completed)
-- -------------------------------------------------------
INSERT INTO pack_tasks (order_id, warehouse_id, station_code, status, packer_id, started_at, completed_at)
SELECT o.order_id, 1, 'PACK-01', 'COMPLETED', 'PACKER01', '2026-04-14 09:00:00', '2026-04-14 10:30:00'
FROM orders o WHERE o.order_number='ORD-XYZ-2026-0001';

INSERT INTO shipments (shipment_number, order_id, pack_task_id, carrier_id, carrier_name, service_level, tracking_number,
                       ship_date, estimated_delivery, status, total_weight, total_boxes, freight_cost, shipped_by, dispatched_at)
SELECT 'SHIP-XYZ-2026-001', o.order_id, pt.pack_task_id, cr.carrier_id, 'UPS', 'GROUND', '1Z999AA10123456784',
       '2026-04-15', '2026-04-18', 'DELIVERED', 85.50, 3, 42.75, 'SHIPPER01', '2026-04-15 14:00:00'
FROM orders o, pack_tasks pt, carriers cr
WHERE o.order_number='ORD-XYZ-2026-0001' AND pt.order_id=o.order_id AND cr.carrier_code='UPS-GRD';

-- -------------------------------------------------------
-- 9. VERIFICATION QUERIES
-- -------------------------------------------------------

-- Customer check
SELECT customer_code, customer_name, contact_email FROM customers WHERE customer_code='XYZMDM';

-- Item count
SELECT COUNT(*) AS total_items FROM items i JOIN customers c ON i.customer_id=c.customer_id WHERE c.customer_code='XYZMDM';

-- Inventory summary
SELECT i.item_code, inv.on_hand_qty, inv.reserved_qty, inv.available_qty, l.location_code
FROM inventory inv
JOIN items i ON inv.item_id=i.item_id
JOIN locations l ON inv.location_id=l.location_id
JOIN customers c ON inv.customer_id=c.customer_id
WHERE c.customer_code='XYZMDM'
ORDER BY i.item_code;

-- Orders summary
SELECT order_number, status, required_ship_date FROM orders o
JOIN customers c ON o.customer_id=c.customer_id WHERE c.customer_code='XYZMDM' ORDER BY order_number;

DO $$ BEGIN RAISE NOTICE 'SUCCESS: XYZ Modems onboarding complete! Customer, items, inventory, orders all loaded.'; END $$;
