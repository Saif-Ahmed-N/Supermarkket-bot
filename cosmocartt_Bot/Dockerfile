# Use official Python runtime
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies (needed for psycopg2)
RUN apt-get update && apt-get install -y \
    libpq-dev gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements from root
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code into /app/backend
COPY backend/ ./backend/

# Set Python path to include /app/backend so imports work
ENV PYTHONPATH=/app/backend

# Switch compatibility to backend directory
WORKDIR /app/backend

# Expose port (standard for App Runner is 8080 or 8000)
EXPOSE 8000

# Start command
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
