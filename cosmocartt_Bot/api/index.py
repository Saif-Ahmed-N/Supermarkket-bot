from fastapi import FastAPI
import sys
import os

# Add the parent directory to sys.path to find backend module
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import the app from your backend folder
from backend.main import app

# Vercel expects a variable named 'app' or handler
# We already imported 'app' so we are good.
