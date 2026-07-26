"""
CircuitMind Component Agent
Configuration
"""

import os
import io
import requests
import numpy as np
import pandas as pd
import faiss
import torch
from dotenv import load_dotenv
from huggingface_hub import hf_hub_url
load_dotenv() 
# =============================================================================
# Hugging Face Hub
# =============================================================================

HF_REPO_ID = "rayyanshk/dunkai"
HF_REPO_TYPE = "dataset"

# Private repo -> needs a token with read access.
# Set as an environment variable, never hardcode:
#   export HF_TOKEN="hf_xxxxxxxxxxxx"
HF_TOKEN = os.environ.get("HF_TOKEN_READ")

_HEADERS = {"Authorization": f"Bearer {HF_TOKEN}"} if HF_TOKEN else {}

def _fetch_bytes(filename: str) -> bytes:
    """Stream a file's raw bytes from the HF dataset repo — nothing touches disk."""
    url = hf_hub_url(repo_id=HF_REPO_ID, filename=filename, repo_type=HF_REPO_TYPE)
    resp = requests.get(url, headers=_HEADERS)
    resp.raise_for_status()
    return resp.content

# =============================================================================
# Dataset (loaded fully in memory)
# =============================================================================

DATASET_DF = pd.read_parquet(io.BytesIO(_fetch_bytes("components_ml.parquet")))

EMBEDDINGS = np.load(io.BytesIO(_fetch_bytes("component_embeddings.npy")))

_index_bytes = _fetch_bytes("component_faiss.index")
FAISS_INDEX = faiss.deserialize_index(np.frombuffer(_index_bytes, dtype=np.uint8))

# =============================================================================
# Embedding Model
# =============================================================================

MODEL_NAME = "BAAI/bge-small-en-v1.5"

DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

# =============================================================================
# Retrieval
# =============================================================================

TOP_K = 20

SIMILARITY_THRESHOLD = 0.70

BATCH_SIZE = 256

# =============================================================================
# Output
# =============================================================================

DEFAULT_QTY = 1

# =============================================================================
# Supported JSON Section
# =============================================================================

ARCHITECTURE_SECTION = "architecture_model"

# =============================================================================
# Logging
# =============================================================================

VERBOSE = True

# =============================================================================
# Gradio
# =============================================================================

APP_TITLE = "CircuitMind Component Agent"

APP_DESCRIPTION = """
AI-powered Electronic Component Selection Engine

Input:
Architecture Agent JSON

Output:
Bill of Materials (BOM)
"""

# =============================================================================

if VERBOSE:

    print("=" * 60)
    print("CircuitMind Component Agent")
    print("=" * 60)

    print(f"HF Repo: {HF_REPO_ID} (in-memory, no local cache)")

    print(f"\nDataset rows: {len(DATASET_DF)}")

    print(f"\nEmbeddings shape: {EMBEDDINGS.shape}")

    print(f"\nFAISS vectors: {FAISS_INDEX.ntotal}")

    print("\nModel")
    print(MODEL_NAME)

    print("\nDevice")
    print(DEVICE)

    print("=" * 60)