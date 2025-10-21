$body = @{
    title = "Test Project"
    createdBy = "Test User"
    year = "2024"
    category = "Testing"
    description = "This is a test project"
    images = @("https://example.com/test.jpg")
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:3002/api/portfolios" -Method Post -Body $body -ContentType "application/json"
$response | ConvertTo-Json
