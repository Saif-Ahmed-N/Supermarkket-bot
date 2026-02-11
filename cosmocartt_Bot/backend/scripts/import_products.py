import csv
import os
from sqlalchemy import create_engine, Column, Integer, String, Float, Text, Boolean, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# 1. Setup Database Connection (Standalone)
load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    print("ERROR: DATABASE_URL not found in .env")
    exit(1)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# 2. Define Model locally to avoid import issues
class Product(Base):
    __tablename__ = "products_v2"
    index = Column(Integer, primary_key=True, index=True)
    product = Column(String, index=True)
    category = Column(String, index=True)
    sub_category = Column(String, index=True)
    brand = Column(String, index=True)
    sale_price = Column(Float)
    market_price = Column(Float)
    type = Column(String)
    rating = Column(Float, nullable=True)
    description = Column(Text)
    weight_str = Column(String, index=True)
    unit_type = Column(String)
    is_veg = Column(Boolean, default=True)
    image_url = Column(String)
    packed_date = Column(String, index=True)
    expiry_date = Column(String, index=True)
    stock = Column(Integer, default=0)

CSV_FILE_PATH = r"c:\Users\saleh\OneDrive\Desktop\cosmocartt\cleaned_products_dataset.csv"

def migrate():
    db = SessionLocal()
    try:
        print("--- COMMENCING STANDALONE DATABASE MIGRATION ---")
        
        # 1. Update schema
        print("Applying SQL schema updates...")
        with engine.connect() as conn:
            conn.execute(text("ALTER TABLE products_v2 ADD COLUMN IF NOT EXISTS packed_date VARCHAR;"))
            conn.execute(text("ALTER TABLE products_v2 ADD COLUMN IF NOT EXISTS expiry_date VARCHAR;"))
            conn.execute(text("ALTER TABLE products_v2 ADD COLUMN IF NOT EXISTS stock INTEGER DEFAULT 0;"))
            # Ensure index is there
            conn.execute(text("CREATE INDEX IF NOT EXISTS ix_products_v2_packed_date ON products_v2 (packed_date);"))
            conn.execute(text("CREATE INDEX IF NOT EXISTS ix_products_v2_expiry_date ON products_v2 (expiry_date);"))
            conn.commit()
        
        # 2. Clear data
        print("Clearing existing products...")
        db.execute(text("TRUNCATE TABLE products_v2 RESTART IDENTITY CASCADE"))
        db.commit()
        
        # 3. Import
        print(f"Reading {CSV_FILE_PATH}...")
        with open(CSV_FILE_PATH, mode='r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            count = 0
            batch = []
            
            for row in reader:
                try:
                    product = Product(
                        product=row['product_name'],
                        brand=row['brand'],
                        category=row['category'],
                        sub_category=row['sub_category'],
                        market_price=float(row['market_price']) if row['market_price'] else 0.0,
                        sale_price=float(row['sale_price']) if row['sale_price'] else 0.0,
                        packed_date=row['packed_date'],
                        expiry_date=row['expiry_date'],
                        rating=float(row['ratings']) if row['ratings'] else 0.0,
                        image_url=row['image_url'],
                        stock=int(row['stock']) if row['stock'] else 0,
                        type="General",
                        description=f"{row['product_name']} by {row['brand']}",
                        weight_str="Standard", # Fallback
                        unit_type="pcs" # Fallback
                    )
                    batch.append(product)
                    count += 1
                    
                    if len(batch) >= 1000:
                        db.bulk_save_objects(batch)
                        db.commit()
                        batch = []
                        print(f"Progress: {count} items imported...")
                except Exception as row_error:
                    print(f"Error processing row {count}: {row_error}")
                    continue

            if batch:
                db.bulk_save_objects(batch)
                db.commit()
        
        print(f"--- SUCCESS: {count} PRODUCTS IMPORTED ---")
        
    except Exception as e:
        print(f"CRITICAL ERROR: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    migrate()
