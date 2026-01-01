# VISI AI Development Server Başlatma Scripti
$ErrorActionPreference = "Stop"

Write-Host "VISI AI Development Server Başlatılıyor..." -ForegroundColor Green

# Mevcut dizine geç
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

# Node modules kontrolü
if (-not (Test-Path "node_modules")) {
    Write-Host "Node modules bulunamadı. npm install çalıştırılıyor..." -ForegroundColor Yellow
    npm install
}

# .env.local kontrolü
if (-not (Test-Path ".env.local")) {
    Write-Host "UYARI: .env.local dosyası bulunamadı!" -ForegroundColor Red
    Write-Host "Lütfen .env.local dosyası oluşturun ve GEMINI_API_KEY ekleyin." -ForegroundColor Yellow
    Write-Host ""
}

# Development server'ı başlat
Write-Host "Development server başlatılıyor..." -ForegroundColor Green
npm run dev

