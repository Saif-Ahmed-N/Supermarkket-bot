#!/bin/bash
# setup_backend.sh
# Automates virtual environment creation and dependency installation.

BACKEND_DIR="cosmocartt_Bot/backend"

if [ ! -d "$BACKEND_DIR" ]; then
    echo "Error: Backend directory not found at $BACKEND_DIR"
    exit 1
fi

cd "$BACKEND_DIR"

echo "--- Creating Virtual Environment (.venv) ---"
python3 -m venv .venv

echo "--- Activating Environment and Installing Packages ---"
source .venv/bin/activate
pip install -r requirements.txt

echo "--- Setup Complete! ---"
echo "To run the server, use: uvicorn main.py --reload"
