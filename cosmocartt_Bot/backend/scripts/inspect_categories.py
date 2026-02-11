from backend.database import SessionLocal
from sqlalchemy import text

def inspect_categories():
    db = SessionLocal()
    try:
        print("--- DISTINCT CATEGORIES ---")
        cats = db.execute(text("SELECT DISTINCT category FROM products_v2")).fetchall()
        for c in cats:
            print(f"Category: {c[0]}")

        print("\n--- DISTINCT SUB-CATEGORIES ---")
        subcats = db.execute(text("SELECT DISTINCT sub_category FROM products_v2")).fetchall()
        for sc in subcats:
            print(f"Sub-Category: {sc[0]}")
            
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    inspect_categories()
