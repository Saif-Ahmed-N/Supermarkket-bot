from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

env_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(env_path)

SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)

def check():
    db = SessionLocal()
    total = db.execute(text("SELECT COUNT(*) FROM products_v2")).scalar()
    res_https = db.execute(text("SELECT COUNT(*) FROM products_v2 WHERE image_url LIKE 'https%'")).scalar()
    res_local = db.execute(text("SELECT COUNT(*) FROM products_v2 WHERE image_url LIKE 'http://localhost%'")).scalar()
    
    print(f"Total rows: {total}")
    print(f"Restored (https): {res_https}")
    print(f"Overwritten (localhost): {res_local}")
    
    if res_local > 0:
        row = db.execute(text("SELECT product FROM products_v2 WHERE image_url LIKE 'http://localhost%' LIMIT 1")).fetchone()
        if row:
            print(f"Sample Localhost Product in DB: '{row[0]}'")

    # Check other URLs
    # others = db.execute(text("SELECT image_url FROM products_v2 WHERE image_url NOT LIKE 'https%' AND image_url NOT LIKE 'http://localhost%' LIMIT 5")).fetchall()
    # print("Other URLs sample:")
    # for o in others:
    #     print(o[0])
    db.close()

if __name__ == "__main__":
    check()
