-- =============================================================
-- RAVI LOGISTICS - Indexes & Constraints
-- Script 03: Performance indexes
-- =============================================================

-- Customer indexes
CREATE INDEX idx_customers_code ON customers(customer_code);
CREATE INDEX idx_customers_active ON customers(is_active);

-- Location indexes
CREATE INDEX idx_locations_warehouse ON locations(warehouse_id);
CREATE INDEX idx_locations_zone ON locations(warehouse_id, zone);
CREATE INDEX idx_locations_type ON locations(location_type);

-- Item indexes
CREATE INDEX idx_items_customer ON items(customer_id);
CREATE INDEX idx_items_code ON items(customer_id, item_code);
CREATE INDEX idx_items_barcode ON items(barcode);
CREATE INDEX idx_items_active ON items(is_active);

-- ASN indexes
CREATE INDEX idx_asns_customer ON asns(customer_id);
CREATE INDEX idx_asns_status ON asns(status);
CREATE INDEX idx_asns_expected_date ON asns(expected_date);
CREATE INDEX idx_asn_lines_asn ON asn_lines(asn_id);
CREATE INDEX idx_asn_lines_item ON asn_lines(item_id);
CREATE INDEX idx_receipts_asn ON receipts(asn_id);
CREATE INDEX idx_receipt_lines_receipt ON receipt_lines(receipt_id);

-- Inventory indexes
CREATE INDEX idx_inventory_customer ON inventory(customer_id);
CREATE INDEX idx_inventory_item ON inventory(item_id);
CREATE INDEX idx_inventory_location ON inventory(location_id);
CREATE INDEX idx_inventory_available ON inventory(customer_id, item_id) WHERE available_qty > 0;
CREATE INDEX idx_inv_txn_inventory ON inventory_transactions(inventory_id);
CREATE INDEX idx_inv_txn_type ON inventory_transactions(txn_type);
CREATE INDEX idx_inv_txn_date ON inventory_transactions(created_at);
CREATE INDEX idx_inv_txn_reference ON inventory_transactions(reference_type, reference_id);

-- Order indexes
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_ship_date ON orders(required_ship_date);
CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_order_lines_order ON order_lines(order_id);
CREATE INDEX idx_order_lines_item ON order_lines(item_id);
CREATE INDEX idx_order_lines_status ON order_lines(status);

-- Wave indexes
CREATE INDEX idx_waves_warehouse ON waves(warehouse_id);
CREATE INDEX idx_waves_status ON waves(status);
CREATE INDEX idx_waves_date ON waves(wave_date);
CREATE INDEX idx_wave_orders_wave ON wave_orders(wave_id);
CREATE INDEX idx_wave_orders_order ON wave_orders(order_id);

-- Pick indexes
CREATE INDEX idx_pick_tasks_wave ON pick_tasks(wave_id);
CREATE INDEX idx_pick_tasks_order ON pick_tasks(order_id);
CREATE INDEX idx_pick_tasks_status ON pick_tasks(status);
CREATE INDEX idx_pick_tasks_picker ON pick_tasks(picker_id);
CREATE INDEX idx_pick_tasks_location ON pick_tasks(pick_location_id);

-- Pack indexes
CREATE INDEX idx_pack_tasks_order ON pack_tasks(order_id);
CREATE INDEX idx_pack_tasks_status ON pack_tasks(status);
CREATE INDEX idx_pack_boxes_task ON pack_boxes(pack_task_id);
CREATE INDEX idx_pack_box_items_box ON pack_box_items(box_id);

-- Shipment indexes
CREATE INDEX idx_shipments_order ON shipments(order_id);
CREATE INDEX idx_shipments_status ON shipments(status);
CREATE INDEX idx_shipments_tracking ON shipments(tracking_number);
CREATE INDEX idx_shipments_date ON shipments(ship_date);

DO $$ BEGIN RAISE NOTICE 'SUCCESS: All indexes created successfully.'; END $$;
