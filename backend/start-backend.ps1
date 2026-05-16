# Optional helper: frees port 8080 then runs mvnw (Spring Boot loads backend/.env automatically)
$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot

if (-not (Test-Path .env)) {
    Write-Error 'Missing backend/.env — copy .env.example to .env and fill in values'
}

$on8080 = Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue
if ($on8080) {
    Write-Host 'Port 8080 is in use. Stopping existing process...' -ForegroundColor Yellow
    $on8080 | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }
    Start-Sleep -Seconds 2
}

Write-Host 'Starting backend on http://localhost:8080 ...' -ForegroundColor Cyan
.\mvnw.cmd spring-boot:run
