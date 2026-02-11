from backend.database import SessionLocal
from sqlalchemy import text

def update_missing_images():
    db = SessionLocal()
    try:
        print("--- UPDATING MISSING IMAGES ---")
        
        # Define the mappings based on user request
        # Note: We are using the local static paths we just set up
        # We'll map generic "Kitchen" and "Beauty" to image1, and "Cleaning" to image2 for now
        # The user can swap them later if needed by renaming the files
        
        updates = [
            # Kitchen, Garden & Pets -> using image1 (assumed Kitchen/Beauty)
            {
                "category_pattern": "%Kitchen%", 
                "image_url": "http://localhost:8000/static/images/image1.jpg"
            },
            # Beauty & Hygiene -> using image1 (assumed Kitchen/Beauty)
            {
                "category_pattern": "%Beauty%", 
                "image_url": "http://localhost:8000/static/images/beauty.jpg"
            },
            # Cleaning & Household -> using image2 (assumed Cleaning)
            {
                "category_pattern": "%Cleaning%", 
                "image_url": "http://localhost:8000/static/images/image2.png"
            }
        ]

        for up in updates:
            print(f"Updating category matching '{up['category_pattern']}' to '{up['image_url']}'...")
            
            # Update by Category
            result = db.execute(
                text("UPDATE products_v2 SET image_url = :url WHERE category LIKE :cat"),
                {"url": up['image_url'], "cat": up['category_pattern']}
            )
            print(f"  Rows updated: {result.rowcount}")

        db.commit()
        print("--- UPDATE COMPLETE ---")

    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    update_missing_images()
