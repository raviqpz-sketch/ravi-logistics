@echo off
:: ============================================================
:: RAVI LOGISTICS — Database Setup Script
:: RIGHT-CLICK THIS FILE → "Run as Administrator"
:: ============================================================
setlocal

set PG_BIN=C:\Program Files\PostgreSQL\18\bin
set SCRIPTS_DIR=%~dp0
set PGPASSWORD=postgres

echo.
echo ============================================================
echo  RAVI LOGISTICS — Database Setup
echo ============================================================
echo.

:: Prompt for postgres password
set /p PGPASSWORD="Enter your PostgreSQL 'postgres' user password: "
echo.

:: Test connection first
echo [1/6] Testing PostgreSQL connection...
"%PG_BIN%\psql.exe" -U postgres -c "SELECT 'Connection OK' AS status;" 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Could not connect to PostgreSQL!
    echo.
    echo Please check:
    echo   1. PostgreSQL service is running
    echo   2. The password you entered is correct
    echo   3. PostgreSQL is on port 5432
    echo.
    pause
    exit /b 1
)
echo Connection successful!
echo.

:: Step 1: Create database and user
echo [2/6] Creating RAVIEXPRESS database and ravilogistics user...
"%PG_BIN%\psql.exe" -U postgres -f "%SCRIPTS_DIR%01-init.sql"
if %ERRORLEVEL% NEQ 0 (
    echo WARNING: Step 1 had errors (database may already exist - continuing...)
)
echo Done.
echo.

:: Step 2: Create all tables
echo [3/6] Creating all tables (21 tables across all modules)...
set PGPASSWORD=ravi@123
"%PG_BIN%\psql.exe" -U ravilogistics -d RAVIEXPRESS -f "%SCRIPTS_DIR%02-tables.sql"
if %ERRORLEVEL% NEQ 0 (
    echo ERROR in step 2 - Check output above
    pause
    exit /b 1
)
echo Done.
echo.

:: Step 3: Create indexes
echo [4/6] Creating indexes and constraints...
"%PG_BIN%\psql.exe" -U ravilogistics -d RAVIEXPRESS -f "%SCRIPTS_DIR%03-constraints.sql"
if %ERRORLEVEL% NEQ 0 (
    echo ERROR in step 3 - Check output above
    pause
    exit /b 1
)
echo Done.
echo.

:: Step 4: Master data
echo [5/6] Inserting master data (warehouses, locations, carriers)...
"%PG_BIN%\psql.exe" -U ravilogistics -d RAVIEXPRESS -f "%SCRIPTS_DIR%04-sample-data.sql"
if %ERRORLEVEL% NEQ 0 (
    echo ERROR in step 4 - Check output above
    pause
    exit /b 1
)
echo Done.
echo.

:: Step 5: XYZ Modems data
echo [6/6] Onboarding XYZ Modems customer data...
"%PG_BIN%\psql.exe" -U ravilogistics -d RAVIEXPRESS -f "%SCRIPTS_DIR%05-xyz-modems-data.sql"
if %ERRORLEVEL% NEQ 0 (
    echo ERROR in step 5 - Check output above
    pause
    exit /b 1
)
echo Done.
echo.

:: Verification
echo ============================================================
echo  Verifying setup...
echo ============================================================
set PGPASSWORD=ravi@123
"%PG_BIN%\psql.exe" -U ravilogistics -d RAVIEXPRESS -c "SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name;"
echo.
"%PG_BIN%\psql.exe" -U ravilogistics -d RAVIEXPRESS -c "SELECT customer_name, customer_code FROM customers;"
echo.

echo ============================================================
echo  SUCCESS! RAVIEXPRESS database is ready.
echo.
echo  Database : RAVIEXPRESS
echo  User     : ravilogistics
echo  Password : ravi@123
echo  Host     : localhost:5432
echo ============================================================
echo.
pause
endlocal
