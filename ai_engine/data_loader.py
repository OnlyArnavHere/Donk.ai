import os
import pandas as pd
from datasets import load_dataset
from dotenv import load_dotenv

# 1. Load environment variables from .env file
load_dotenv()
hf_token = os.getenv("HF_TOKEN")

def load_hardware_dataset() -> pd.DataFrame:
    """Loads the remote hardware Parquet dataset from Hugging Face into Pandas."""
    print("Fetching dataset from Hugging Face...")
    
    # Load dataset stream or split directly from Hugging Face
    ds = load_dataset(
        "rayyanshk/dunkai", 
        data_files="hardware_dataset.parquet", 
        token=hf_token
    )
    
    # Convert 'train' split (default) directly to Pandas DataFrame
    df = ds["train"].to_pandas()
    print(f"Successfully loaded dataset with {len(df):,} rows!")
    return df

# Example Usage:
# df = load_hardware_dataset()