# Network Access Setup Script
# Run this to automatically configure network access

Write-Host "🌐 Mutualist Network Access Setup" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Get local IP address
$ip = (Get-NetIPAddress -AddressFamily IPv4 -InterfaceAlias "Wi-Fi*" | Where-Object {$_.IPAddress -notlike "169.*"}).IPAddress

if (-not $ip) {
    $ip = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.IPAddress -notlike "127.*" -and $_.IPAddress -notlike "169.*"} | Select-Object -First 1).IPAddress
}

if (-not $ip) {
    Write-Host "❌ Could not detect IP address" -ForegroundColor Red
    Write-Host "Please run 'ipconfig' manually and update .env files" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Detected IP Address: $ip" -ForegroundColor Green
Write-Host ""

# Update API .env
Write-Host "📝 Updating apps/api/.env..." -ForegroundColor Yellow
$apiEnv = @"
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/mutualist?schema=public"

# Server Configuration
PORT=3002
HOST=0.0.0.0
NODE_ENV=development

# Supabase Configuration
SUPABASE_URL=https://aqmiasmqtueuqvdsgiez.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxbWlhc21xdHVldXF2ZHNnaWV6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTk5MTc3MiwiZXhwIjoyMDc1NTY3NzcyfQ.SERVICE_ROLE_KEY_HERE
"@
$apiEnv | Out-File -FilePath "apps/api/.env" -Encoding UTF8
Write-Host "✅ API .env updated" -ForegroundColor Green

# Update Life .env.local
Write-Host "📝 Updating apps/life/.env.local..." -ForegroundColor Yellow
$lifeEnv = @"
# API Backend URL (Network Access)
NEXT_PUBLIC_API_URL=http://${ip}:3002/api
"@
$lifeEnv | Out-File -FilePath "apps/life/.env.local" -Encoding UTF8
Write-Host "✅ Life .env.local updated" -ForegroundColor Green

# Update Admin .env.local
Write-Host "📝 Updating apps/admin/.env.local..." -ForegroundColor Yellow
$adminEnv = @"
# API Backend URL (Network Access)
NEXT_PUBLIC_API_URL=http://${ip}:3002/api

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://aqmiasmqtueuqvdsgiez.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxbWlhc21xdHVldXF2ZHNnaWV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5OTE3NzIsImV4cCI6MjA3NTU2Nzc3Mn0.8xqYvH_L5vPZQqxKGJYqZ0Zr5Zr5Zr5Zr5Zr5Zr5Zr5

# Auth Configuration (Network Access)
NEXTAUTH_URL=http://${ip}:3001
NEXTAUTH_SECRET=mutualist-admin-secret
"@
$adminEnv | Out-File -FilePath "apps/admin/.env.local" -Encoding UTF8
Write-Host "✅ Admin .env.local updated" -ForegroundColor Green

Write-Host ""
Write-Host "🎉 Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📱 Access URLs:" -ForegroundColor Cyan
Write-Host "   Life App:  http://${ip}:3000" -ForegroundColor White
Write-Host "   Admin App: http://${ip}:3001" -ForegroundColor White
Write-Host "   API:       http://${ip}:3002/api" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Next Steps:" -ForegroundColor Cyan
Write-Host "   1. Start API:   cd apps/api && bun run dev" -ForegroundColor White
Write-Host "   2. Start Life:  cd apps/life && bun run dev" -ForegroundColor White
Write-Host "   3. Start Admin: cd apps/admin && bun run dev" -ForegroundColor White
Write-Host ""
Write-Host "🔥 Firewall:" -ForegroundColor Yellow
Write-Host "   If you can't connect from other devices:" -ForegroundColor White
Write-Host "   Run: .\setup-firewall.ps1" -ForegroundColor White
Write-Host ""
