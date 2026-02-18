@echo off
echo ==========================================
echo   Mutualist Local Development Environment
echo ==========================================
echo.
echo [1/2] Starting Database (Docker)...
docker-compose -f docker-compose.dev.yml up -d postgres

echo.
echo [2/2] Starting Applications (Turbo)...
echo       - API: http://localhost:8080/api
echo       - Main: http://localhost:3000
echo       - Admin: http://localhost:3002
echo       - Life: http://localhost:3001
echo.
bun run dev
