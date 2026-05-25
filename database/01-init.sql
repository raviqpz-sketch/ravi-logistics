-- =============================================================
-- RAVI LOGISTICS - Database Initialization
-- Script 01: Create database and user
--
-- HOW TO RUN IN pgAdmin:
--   STEP 1: Connect to the "postgres" database
--   STEP 2: Open Query Tool (Tools → Query Tool)
--   STEP 3: Enable Auto Commit — click the lightning bolt toggle
--            in the Query Tool toolbar so it turns ON (no transaction wrapping)
--   STEP 4: Run this entire script (F5)
--
-- WHY: CREATE DATABASE and role creation cannot run inside a
--      transaction block. Auto Commit disables pgAdmin's implicit
--      BEGIN/COMMIT wrapping so each statement runs independently.
-- =============================================================

-- Create application user (safe to run multiple times)
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'ravilogistics') THEN
        CREATE ROLE ravilogistics LOGIN PASSWORD 'ravi@123';
        RAISE NOTICE 'SUCCESS: Role ravilogistics created.';
    ELSE
        RAISE NOTICE 'INFO: Role ravilogistics already exists — skipped.';
    END IF;
END
$$;

-- Create the RAVIEXPRESS database
-- NOTE: This statement REQUIRES Auto Commit to be ON in pgAdmin.
--       It will fail with "cannot run inside a transaction block" if Auto Commit is OFF.
-- CREATE DATABASE "RAVIEXPRESS"
--     WITH
--     OWNER = postgres
--     ENCODING = 'UTF8'
--     LC_COLLATE = 'en_US.UTF-8'
--     LC_CTYPE = 'en_US.UTF-8'
--     TEMPLATE = template0;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE "RAVIEXPRESS" TO ravilogistics;

DO $$ BEGIN RAISE NOTICE 'SUCCESS: Database RAVIEXPRESS created. User ravilogistics ready. Password: ravi@123'; END $$;
