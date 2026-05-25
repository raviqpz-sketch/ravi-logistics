-- =============================================================
-- RAVI LOGISTICS - Master Sample Data
-- Script 04: Warehouses, locations, carriers
-- =============================================================

-- Warehouses
INSERT INTO warehouses (warehouse_code, warehouse_name, address_line1, city, state, zip_code, total_sqft) VALUES
('WH-MAIN', 'RAVI LOGISTICS Main Warehouse', '1000 Logistics Blvd', 'Dallas', 'TX', '75001', 250000.00),
('WH-EAST', 'RAVI LOGISTICS East Warehouse', '500 East Commerce Dr', 'Atlanta', 'GA', '30301', 150000.00);

-- Locations for WH-MAIN (warehouse_id = 1)
INSERT INTO locations (warehouse_id, location_code, zone, aisle, bay, level, position, location_type, max_weight, max_volume) VALUES
-- Receiving zone
(1, 'REC-DOCK-01', 'RCV', 'DOCK', '01', 'GRD', '01', 'RECEIVE', 5000, 2000),
(1, 'REC-DOCK-02', 'RCV', 'DOCK', '02', 'GRD', '01', 'RECEIVE', 5000, 2000),
(1, 'REC-DOCK-03', 'RCV', 'DOCK', '03', 'GRD', '01', 'RECEIVE', 5000, 2000),
-- Pick locations - Zone A
(1, 'A-01-01-A', 'A', '01', '01', 'A', '01', 'PICK', 500, 200),
(1, 'A-01-01-B', 'A', '01', '01', 'B', '01', 'PICK', 500, 200),
(1, 'A-01-01-C', 'A', '01', '01', 'C', '01', 'PICK', 500, 200),
(1, 'A-01-02-A', 'A', '01', '02', 'A', '01', 'PICK', 500, 200),
(1, 'A-01-02-B', 'A', '01', '02', 'B', '01', 'PICK', 500, 200),
(1, 'A-02-01-A', 'A', '02', '01', 'A', '01', 'PICK', 500, 200),
(1, 'A-02-01-B', 'A', '02', '01', 'B', '01', 'PICK', 500, 200),
-- Pick locations - Zone B
(1, 'B-01-01-A', 'B', '01', '01', 'A', '01', 'PICK', 500, 200),
(1, 'B-01-01-B', 'B', '01', '01', 'B', '01', 'PICK', 500, 200),
(1, 'B-01-02-A', 'B', '01', '02', 'A', '01', 'PICK', 500, 200),
(1, 'B-02-01-A', 'B', '02', '01', 'A', '01', 'PICK', 500, 200),
-- Reserve locations
(1, 'RES-A-01', 'RES', 'A', '01', 'GRD', '01', 'RESERVE', 2000, 1000),
(1, 'RES-A-02', 'RES', 'A', '02', 'GRD', '01', 'RESERVE', 2000, 1000),
(1, 'RES-B-01', 'RES', 'B', '01', 'GRD', '01', 'RESERVE', 2000, 1000),
-- Pack stations
(1, 'PACK-01', 'PACK', 'PACK', '01', 'GRD', '01', 'PACK', 200, 100),
(1, 'PACK-02', 'PACK', 'PACK', '02', 'GRD', '01', 'PACK', 200, 100),
(1, 'PACK-03', 'PACK', 'PACK', '03', 'GRD', '01', 'PACK', 200, 100),
-- Shipping dock
(1, 'SHIP-DOCK-01', 'SHIP', 'DOCK', '01', 'GRD', '01', 'SHIP', 5000, 2000),
(1, 'SHIP-DOCK-02', 'SHIP', 'DOCK', '02', 'GRD', '01', 'SHIP', 5000, 2000);

-- Carriers
INSERT INTO carriers (carrier_code, carrier_name, service_level) VALUES
('UPS-GRD', 'UPS', 'GROUND'),
('UPS-2DA', 'UPS', '2-DAY'),
('UPS-NXT', 'UPS', 'NEXT-DAY'),
('FEDEX-GRD', 'FedEx', 'GROUND'),
('FEDEX-EXP', 'FedEx', 'EXPRESS'),
('FEDEX-OVN', 'FedEx', 'OVERNIGHT'),
('USPS-PRI', 'USPS', 'PRIORITY'),
('DHL-EXP', 'DHL', 'EXPRESS'),
('LTL-FRT', 'LTL Freight', 'FREIGHT');

DO $$ BEGIN RAISE NOTICE 'SUCCESS: Master data inserted — 2 warehouses, 20 locations, 9 carriers.'; END $$;
