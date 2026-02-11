# PowerShell script to run the UNIFIED CosmoCartt project

# 1. Start Backend
Write-Host "Starting Backend..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'c:\Users\saleh\OneDrive\Desktop\cosmocartt\cosmocartt_Bot\backend'; .\venv\Scripts\activate; uvicorn main:app --reload"

# 2. Start Unified Frontend (Mart + Admin)
Write-Host "Starting Unified Frontend (Port 5173)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'c:\Users\saleh\OneDrive\Desktop\cosmocartt\cosmocartt_Bot'; npm run dev"

# 3. Open Root Landing Page
Write-Host "Opening Landing Page..." -ForegroundColor Blue
Start-Process "http://localhost:5173" # Since the unified app is now the primary entry

Write-Host "Services are starting in separate windows." -ForegroundColor Magenta
Write-Host "Access everything at: http://localhost:5173"
