# Alternative: Setup Database via pgAdmin 4

If the batch file doesn't work, use pgAdmin 4 (already installed).

## Steps

### 1. Open pgAdmin 4
- Press **Win** → type `pgAdmin 4` → Open it
- It opens in your browser at http://127.0.0.1:<port>/

### 2. Connect to Server
- In the left panel: **Servers → PostgreSQL 18**
- Enter your postgres password when prompted

### 3. Run Script 01 — Create DB & User
- Click **Tools → Query Tool**
- Open file: `database/01-init.sql`
- Press **F5** to run
- You should see: "Database RAVIEXPRESS created successfully"

### 4. Switch to RAVIEXPRESS database
- In left panel, expand: **Servers → PostgreSQL 18 → Databases → RAVIEXPRESS**
- Right-click **RAVIEXPRESS** → **Query Tool**

### 5. Run Scripts 02–05 in order
In the RAVIEXPRESS Query Tool:
- Open and run `02-tables.sql` (F5)
- Open and run `03-constraints.sql` (F5)
- Open and run `04-sample-data.sql` (F5)
- Open and run `05-xyz-modems-data.sql` (F5)

### 6. Verify
Run this query to confirm everything is set up:
```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```
Should show 21 tables.

```sql
SELECT customer_name, customer_code FROM customers;
```
Should show: **XYZ Modems Inc.**

```sql
SELECT item_code, item_name, category FROM items ORDER BY item_code;
```
Should show 12 items.

```sql
SELECT order_number, status, required_ship_date FROM orders ORDER BY order_number;
```
Should show 3 orders.
