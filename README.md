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


# SkipSense — Start-to-Finish Run Guide (copy/paste)

> Run everything from the **project root** folder (the one containing `src/`, `app/`, `data/`).

---

## 0) Go to the project root

```bash
cd "/Users/yashs/Documents/Move Over/GitHub/SkipSense"

source .venv/bin/activate

python3 -m pip install --upgrade pip
pip install numpy pandas tqdm librosa scikit-learn torch torchaudio streamlit fastapi uvicorn

python3 -c "import numpy, pandas, tqdm, librosa; print('deps ok')"

python3 data/simulate_dataset.py --n_tracks 500 --n_users 100 --out_csv data/dataset.csv

ls -la data/dataset.csv
python3 -m src.audio.preprocess --csv data/dataset.csv --out_dir data/spectrograms
ls -la data/spectrograms | head
python3 src/train.py --csv data/dataset.csv --epochs 10 --batch_size 32 --out_dir models
ls -la models
uvicorn src.serve.api:app --reload --port 8000

##  in different terminal:

cd "/Users/yashs/Documents/Move Over/GitHub/SkipSense"
source .venv/bin/activate

streamlit run app/app.py    
