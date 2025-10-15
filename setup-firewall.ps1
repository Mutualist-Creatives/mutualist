# Windows Firewall Setup Script
# Run as Administrator to configure firewall rules

Write-Host "🔥 Windows Firewall Setup" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Cyan
Write-Host ""

# Check if running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "❌ This script must be run as Administrator" -ForegroundColor Red
    Write-Host ""
    Write-Host "Right-click PowerShell and select 'Run as Administrator'" -ForegroundColor Yellow
    Write-Host "Then run: .\setup-firewall.ps1" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Running as Administrator" -ForegroundColor Green
Write-Host ""

# Remove existing rules (if any)
Write-Host "🧹 Removing old firewall rules..." -ForegroundColor Yellow
Remove-NetFirewallRule -DisplayName "Mutualist Dev - API" -ErrorAction SilentlyContinue
Remove-NetFirewallRule -DisplayName "Mutualist Dev - Life" -ErrorAction SilentlyContinue
Remove-NetFirewallRule -DisplayName "Mutualist Dev - Admin" -ErrorAction SilentlyContinue
Write-Host "✅ Old rules removed" -ForegroundColor Green

# Add new rules
Write-Host "➕ Adding new firewall rules..." -ForegroundColor Yellow

# API Server (Port 3002)
New-NetFirewallRule -DisplayName "Mutualist Dev - API" `
    -Direction Inbound `
    -Protocol TCP `
    -LocalPort 3002 `
    -Action Allow `
    -Profile Domain,Private,Public `
    -Description "Allow access to Mutualist API server"

Write-Host "✅ API (Port 3002) - Allowed" -ForegroundColor Green

# Life App (Port 3000)
New-NetFirewallRule -DisplayName "Mutualist Dev - Life" `
    -Direction Inbound `
    -Protocol TCP `
    -LocalPort 3000 `
    -Action Allow `
    -Profile Domain,Private,Public `
    -Description "Allow access to Mutualist Life app"

Write-Host "✅ Life (Port 3000) - Allowed" -ForegroundColor Green

# Admin App (Port 3001)
New-NetFirewallRule -DisplayName "Mutualist Dev - Admin" `
    -Direction Inbound `
    -Protocol TCP `
    -LocalPort 3001 `
    -Action Allow `
    -Profile Domain,Private,Public `
    -Description "Allow access to Mutualist Admin app"

Write-Host "✅ Admin (Port 3001) - Allowed" -ForegroundColor Green

Write-Host ""
Write-Host "🎉 Firewall configured successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📱 You can now access from other devices:" -ForegroundColor Cyan

# Get IP
$ip = (Get-NetIPAddress -AddressFamily IPv4 -InterfaceAlias "Wi-Fi*" | Where-Object {$_.IPAddress -notlike "169.*"}).IPAddress
if (-not $ip) {
    $ip = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.IPAddress -notlike "127.*" -and $_.IPAddress -notlike "169.*"} | Select-Object -First 1).IPAddress
}

if ($ip) {
    Write-Host "   Life App:  http://${ip}:3000" -ForegroundColor White
    Write-Host "   Admin App: http://${ip}:3001" -ForegroundColor White
    Write-Host "   API:       http://${ip}:3002/api" -ForegroundColor White
} else {
    Write-Host "   Run 'ipconfig' to find your IP address" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🔍 To verify rules:" -ForegroundColor Cyan
Write-Host "   Open Windows Defender Firewall → Inbound Rules" -ForegroundColor White
Write-Host "   Look for 'Mutualist Dev' rules" -ForegroundColor White
Write-Host ""
