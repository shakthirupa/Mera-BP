$questions = @(
    "Can I eat halwa if I have high BP?",
    "Is chai bad for hypertension?",
    "Can I eat pickle daily with BP?",
    "My BP becomes high after stress, is it normal?",
    "Can I eat biryani once a week?",
    "Is walking enough to control BP?",
    "Can lack of sleep increase blood pressure?",
    "I feel headache every morning, is it BP?",
    "Can I drink coffee if I have hypertension?",
    "Is coconut water good for BP?",
    "Can I eat papad with high blood pressure?",
    "Is BP medicine lifelong?",
    "What foods reduce BP naturally?",
    "Can anxiety increase blood pressure suddenly?",
    "Is 150/90 dangerous?",
    "Can I skip BP tablet if my BP is normal today?",
    "Is lemon water good for hypertension?",
    "Can I eat sweets during hypertension?",
    "Does spicy food increase BP?",
    "Can I eat samosa sometimes?"
)

# Get a token first - replace with your credentials
$loginBody = '{"email":"727723euci043@skcet.ac.in","password":"shakthi3122G&"}'
$loginRes = Invoke-RestMethod -Uri "http://localhost:8080/auth/login/email" -Method POST -ContentType "application/json" -Body $loginBody
$token = $loginRes.accessToken

$i = 1
foreach ($q in $questions) {
    $body = @{ message = $q; history = @() } | ConvertTo-Json
    $res = Invoke-RestMethod -Uri "http://localhost:8080/chat" -Method POST -ContentType "application/json" -Headers @{ Authorization = "Bearer $token" } -Body $body
    Write-Host "Q$i`: $q"
    Write-Host "A`: $($res.message)"
    Write-Host "---"
    $i++
}
