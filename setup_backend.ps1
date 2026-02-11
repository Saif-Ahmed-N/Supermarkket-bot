# setup_backend.ps1
# This script automates the creation of a virtual environment and installs dependencies.

$BackendDir = "cosmocartt_Bot/backend"

if (!(Test-Path $BackendDir)) {
    Write-Host "Error: Backend directory not found at $BackendDir" -ForegroundColor Red
    exit
}

Set-Location $BackendDir

Write-Host "--- Creating Virtual Environment (.venv) ---" -ForegroundColor Cyan
python -m venv .venv

Write-Host "--- Activating Environment and Installing Packages ---" -ForegroundColor Cyan
& ".\.venv\Scripts\Activate.ps1"
pip install -r requirements.txt

Write-Host "--- Setup Complete! ---" -ForegroundColor Green
Write-Host "To run the server, use: uvicorn main:app --reload" -ForegroundColor Yellow
