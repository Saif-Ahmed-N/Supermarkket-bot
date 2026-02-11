import sys
import os

# Add the backend directory to the sys.path
current_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.join(current_dir, "../../backend")
sys.path.append(backend_dir)

from mangum import Mangum
from main import app

handler = Mangum(app)
