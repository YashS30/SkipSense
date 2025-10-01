from fastapi import FastAPI, UploadFile, File, Form
from pydantic import BaseModel
import numpy as np, os, tempfile, joblib
import importlib

# Lazy import torch & librosa only if present
try:
    import torch
except Exception:
    torch = None
try:
    import librosa
except Exception:
    librosa = None

from src.audio.preprocess import compute_mel
from src.model.multimodal_model import MultiModalClassifier

DEVICE = "cuda" if (torch is not None and hasattr(torch, "cuda") and torch.cuda.is_available()) else "cpu"
MODEL_DIR = os.environ.get("MODEL_DIR", "models")
MODEL_PATH = os.path.join(MODEL_DIR, "best.pt")
PREPROC_PATH = os.path.join(MODEL_DIR, "tab_preprocessor.joblib")

NUMERIC_COLS = ["tempo", "danceability", "energy", "valence", "popularity", "release_year"]
CAT_COLS = ["genre"]

class MetaPayload(BaseModel):
    tempo: float
    danceability: float
    energy: float
    valence: float
    popularity: int
    release_year: int
    genre: str

class PredictPayload(BaseModel):
    spectrogram_path: str
    metadata: MetaPayload

app = FastAPI(title="SkipSense API", version="1.0")

def load_artifacts():
    preproc = joblib.load(PREPROC_PATH)
    # Infer tab width
    import pandas as pd
    df = pd.DataFrame([{**{k:0 for k in NUMERIC_COLS}, "genre":"pop"}])
    X = preproc.transform(df)
    num_tab = X.shape[1]
    model = MultiModalClassifier(num_tab=num_tab)
    if torch is not None and os.path.exists(MODEL_PATH):
        model = model.to(DEVICE)
        state = None
        try:
            state = np.load(MODEL_PATH, allow_pickle=True).item()  # unlikely, but safe guard
        except Exception:
            pass
        try:
            import torch as _t
            model.load_state_dict(_t.load(MODEL_PATH, map_location=DEVICE))
        except Exception:
            # If loading fails (dummy file), keep random weights
            pass
        model.eval()
    return model, preproc

model, preproc = None, None

@app.on_event("startup")
def _startup():
    global model, preproc
    model, preproc = load_artifacts()

def predict_from_arrays(spec_np: np.ndarray, meta: dict):
    import pandas as pd
    tab = preproc.transform(pd.DataFrame([{**{k: meta[k] for k in NUMERIC_COLS}, "genre": meta["genre"]}] )).astype(np.float32)
    if torch is not None:
        spec_t = (torch.from_numpy(spec_np[None,None,...].astype(np.float32))).to(DEVICE)
        tab_t = torch.from_numpy(tab).to(DEVICE)
        with torch.no_grad():
            logit = model(spec_t, tab_t)
            prob = float((logit.sigmoid().cpu().numpy().item()))
        return prob
    # Fallback: simple heuristic if torch is not present (uses metadata popularity)
    p = 0.6 - 0.002*float(meta.get("popularity", 50)) + 0.1*(1.0 - float(meta.get("danceability",0.5)))
    return float(max(0.01, min(0.99, p)))

@app.post("/predict")
def predict(payload: PredictPayload):
    spec = np.load(payload.spectrogram_path)
    prob = predict_from_arrays(spec, payload.metadata.model_dump())
    return {"skip_probability": prob}

@app.post("/predict_file")
async def predict_file(file: UploadFile = File(...),
                       tempo: float = Form(...),
                       danceability: float = Form(...),
                       energy: float = Form(...),
                       valence: float = Form(...),
                       popularity: int = Form(...),
                       release_year: int = Form(...),
                       genre: str = Form(...)):
    # Load audio (if librosa present) else assume uploaded is a numpy .npy preview saved as waveform
    suffix = os.path.splitext(file.filename)[1].lower()
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        tmp.write(await file.read())
        tmp_path = tmp.name
    if librosa is not None and suffix in [".mp3",".wav",".flac",".ogg"]:
        y, sr = librosa.load(tmp_path, sr=16000, mono=True)
        spec = compute_mel(y, sr=sr)
    else:
        # Try reading as numpy waveform
        try:
            y = np.load(tmp_path)
        except Exception:
            y = np.zeros(16000*10, dtype=np.float32)
        spec = compute_mel(y, sr=16000)
    os.remove(tmp_path)
    prob = predict_from_arrays(spec, {
        "tempo": tempo, "danceability": danceability, "energy": energy,
        "valence": valence, "popularity": popularity, "release_year": release_year,
        "genre": genre
    })
    return {"skip_probability": prob}
