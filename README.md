# SkipSense — Predicting Track Skips in Real-Time (Audio + Metadata)

SkipSense predicts whether a user will skip a track within the first 10 seconds using a **multi-modal model**:
- **Audio** → Mel-spectrogram → small CNN
- **Metadata** → numeric/tabular features (tempo, danceability, popularity, etc.) → MLP
- **Fusion** → concatenation → classifier (skip / no skip)

This repo includes:
- **Data simulation** (if you don’t have Spotify logs yet)
- **Training** (PyTorch)
- **Serving** (FastAPI)
- **Demo UI** (Streamlit)

> ⚠️ You can swap the simulated data for real Spotify data by filling in `scripts/download_spotify.py` and replacing the CSV files.

---

## Quickstart

### 1) Install
```bash
python -m venv .venv && source .venv/bin/activate  # (Windows: .venv\Scripts\activate)
pip install -r requirements.txt
