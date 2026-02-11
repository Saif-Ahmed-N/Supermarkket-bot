from fastapi import FastAPI
import sys
import os

# Add the parent directory AND backend directory to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.append(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "backend"))

# Import the app from your backend folder
from backend.main import app

# Vercel expects a variable named 'app' or handler
# We already imported 'app' so we are good.
