netsh advfirewall firewall add rule name="MeraBP Backend 8080" dir=in action=allow protocol=TCP localport=8080
Write-Host "Firewall rule added!"
