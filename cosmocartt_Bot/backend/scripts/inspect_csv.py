import pandas as pd
import os

# Path to CSV
csv_path = r"c:\Users\saleh\OneDrive\Desktop\cosmocartt\cleaned_products_dataset.csv"

if not os.path.exists(csv_path):
    print(f"File not found: {csv_path}")
    exit(1)

print(f"Reading {csv_path}...")
df = pd.read_csv(csv_path)

print("\n--- DISTINCT CATEGORIES ---")
if 'category' in df.columns:
    cats = sorted(df['category'].dropna().unique())
    for c in cats:
        print(f"Category: {c}")
else:
    print("Column 'category' not found.")

print("\n--- DISTINCT SUB-CATEGORIES ---")
if 'sub_category' in df.columns:
    subcats = sorted(df['sub_category'].dropna().unique())
    for sc in subcats:
        print(f"Sub-Category: {sc}")
else:
    print("Column 'sub_category' not found.")
