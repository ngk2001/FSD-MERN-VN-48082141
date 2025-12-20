@echo off
echo ========================================
echo   FlightHub Flight Booking App Setup
echo ========================================
echo.

REM Check if .env exists in server folder
if not exist server\.env (
    echo Creating .env file in server folder...
    (
        echo PORT=5000
        echo MONGODB_URI=mongodb://localhost:27017/flight-booking
        echo JWT_SECRET=flighthub_secret_key_2025_change_in_production
        echo NODE_ENV=development
    ) > server\.env
    echo .env file created successfully!
    echo.
)

echo Checking MongoDB connection...
echo Please make sure MongoDB is running on your system.
echo.

echo ========================================
echo   Starting the application...
echo ========================================
echo.
echo Starting Server on port 5000...
echo Starting Client on port 5173...
echo.

REM Start the server in background and client
start "FlightHub Server" cmd /c "npm run server"
timeout /t 3 /nobreak > nul
start "FlightHub Client" cmd /c "npm run client"

echo.
echo ========================================
echo   Application Started!
echo ========================================
echo   Server: http://localhost:5000
echo   Client: http://localhost:5173
echo ========================================

