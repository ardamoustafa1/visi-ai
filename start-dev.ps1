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

# .env.local kontrolü ve yükleme
if (-not (Test-Path ".env.local")) {
    Write-Host "UYARI: .env.local dosyası bulunamadı!" -ForegroundColor Red
    Write-Host "Lütfen .env.local dosyası oluşturun ve GEMINI_API_KEY ekleyin." -ForegroundColor Yellow
}
else {
    Write-Host ".env.local yükleniyor..." -ForegroundColor Cyan
    Get-Content ".env.local" | ForEach-Object {
        if ($_ -match "^\s*([^#=]+)\s*=\s*(.*)$") {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim()
            [System.Environment]::SetEnvironmentVariable($name, $value, [System.EnvironmentVariableTarget]::Process)
            [System.Environment]::SetEnvironmentVariable($name, $value, [System.EnvironmentVariableTarget]::Process)
            Set-Item -Path "env:$name" -Value $value
            Write-Host "Env yüklendi: $name" -ForegroundColor DarkGray
        }
    }
}

# Development server'ı başlat
Write-Host "Development server başlatılıyor..." -ForegroundColor Green

# Backend'i başlat (Yeni pencerede)
Write-Host "Python Backend başlatılıyor (Port 8000)..." -ForegroundColor Cyan
Start-Process -FilePath "python" -ArgumentList "python-api/main.py" -WindowStyle Minimized

# Frontend'i başlat
Write-Host "Frontend başlatılıyor (Port 3000)..." -ForegroundColor Green
npm run dev

