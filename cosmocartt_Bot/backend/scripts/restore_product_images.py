import csv
import sys
import os
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# Load env vars
env_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(env_path)

# Setup Database Connection directly
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")
if not SQLALCHEMY_DATABASE_URL:
     # try current dir if script run from backend
     load_dotenv(".env")
     SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

if SQLALCHEMY_DATABASE_URL and SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
     engine = create_engine(
        SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
    )
else:
     engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def restore_images():
    db = SessionLocal()
    # CSV path hardcoded for now, assuming standard location
    csv_path = r"c:\Users\saleh\OneDrive\Desktop\cosmocartt\cleaned_products_dataset.csv"
    
    print(f"Reading from {csv_path}...")
    
    try:
        with open(csv_path, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            count = 0
            updated_count = 0
            
            rows_to_update = []
            for row in reader:
                product_name = row['product_name']
                image_url = row['image_url']
                rows_to_update.append({"url": image_url, "name": product_name})
            
            print(f"Collected {len(rows_to_update)} rows. Executing batch update...")
            
            # Batch update
            stmt = text("UPDATE products_v2 SET image_url = :url WHERE product = :name")
            db.execute(stmt, rows_to_update)
            db.commit()
            
            print("--- RESTORATION COMPLETE ---")
            print(f"Total rows in CSV: {len(rows_to_update)}")
            # rowcount might not be accurate for executemany in some drivers, but let's try
            # print(f"Total database rows updated: {result.rowcount}") 

    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    restore_images()
