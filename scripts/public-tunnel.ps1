# Exposes local backend (port 8080) on a public HTTPS URL for testing on any phone.
# 1. Start backend first: cd backend && mvnw.cmd spring-boot:run
# 2. Run this script and copy the https://....trycloudflare.com URL
# 3. Set EXPO_PUBLIC_API_URL to that URL and rebuild the APK (eas build)

$ErrorActionPreference = 'Stop'

if (-not (Get-Command cloudflared -ErrorAction SilentlyContinue)) {
    Write-Host 'Installing cloudflared via winget...' -ForegroundColor Yellow
    winget install --id Cloudflare.cloudflared -e --accept-source-agreements --accept-package-agreements
    $env:Path = [System.Environment]::GetEnvironmentVariable('Path', 'Machine') + ';' +
                [System.Environment]::GetEnvironmentVariable('Path', 'User')
}

Write-Host ''
Write-Host 'Starting HTTPS tunnel to http://localhost:8080 ...' -ForegroundColor Cyan
Write-Host 'Copy the https://*.trycloudflare.com URL into frontend EAS env EXPO_PUBLIC_API_URL, then rebuild APK.' -ForegroundColor Cyan
Write-Host ''

cloudflared tunnel --url http://localhost:8080
