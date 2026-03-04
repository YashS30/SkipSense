import streamlit as st, pandas as pd, numpy as np, os, requests

st.set_page_config(page_title="SkipSense Demo", layout="wide")
st.title("🎧 SkipSense — Real-Time Skip Prediction")
st.write("Upload a 10s audio preview **or** select a sample. Provide metadata, and get a **skip probability**.")

backend_url = st.secrets.get("backend_url", "http://localhost:8000")
tab1, tab2 = st.tabs(["Upload & Predict", "Sample from CSV"])

with tab1:
    st.subheader("Upload Preview")
    file = st.file_uploader("Audio file (.wav/.mp3) or numpy waveform (.npy)", type=["wav","mp3","npy"])
    cols = st.columns(3)
    tempo = cols[0].number_input("Tempo (BPM)", 60, 220, 120)
    dance = cols[1].slider("Danceability", 0.0, 1.0, 0.5, 0.01)
    energy = cols[2].slider("Energy", 0.0, 1.0, 0.5, 0.01)
    cols2 = st.columns(3)
    valence = cols2[0].slider("Valence", 0.0, 1.0, 0.5, 0.01)
    popularity = cols2[1].number_input("Popularity", 0, 100, 50)
    year = cols2[2].number_input("Release Year", 1980, 2025, 2020)
    genre = st.selectbox("Genre", ["pop","hiphop","edm","rock","indie","rnb","latin"])

    if st.button("Predict", disabled=file is None):
        files = {"file": (file.name, file.getvalue())}
        data = { "tempo": str(tempo), "danceability": str(dance), "energy": str(energy),
                 "valence": str(valence), "popularity": str(popularity),
                 "release_year": str(year), "genre": genre }
        try:
            resp = requests.post(f"{backend_url}/predict_file", files=files, data=data, timeout=60)
            prob = resp.json()["skip_probability"]
            st.success(f"Predicted skip probability: **{prob:.3f}**")
            st.progress(min(max(prob, 0.0), 1.0))
        except Exception as e:
            st.error(f"Error calling backend: {e}")

with tab2:
    st.subheader("Use Simulated Row")
    csv_path = "data/dataset.csv"
    if os.path.exists(csv_path):
        df = pd.read_csv(csv_path)
        # Convert columns to proper types to avoid Arrow serialization issues
        df = df.astype({"skip_flag": "int64"})
        idx = st.slider("Row index", 0, len(df)-1, 0)
        row = df.iloc[idx]
        display_cols = ["track_id","user_id","genre","tempo","danceability","energy","valence","popularity","release_year","skip_flag"]
        st.dataframe(row[display_cols].to_frame().T)
        if st.button("Predict from spectrogram"):
            payload = {
                "spectrogram_path": str(row["spectrogram_path"]),
                "metadata": {
                    "tempo": float(row["tempo"]), "danceability": float(row["danceability"]),
                    "energy": float(row["energy"]), "valence": float(row["valence"]),
                    "popularity": int(row["popularity"]), "release_year": int(row["release_year"]),
                    "genre": str(row["genre"]),
                }
            }
            try:
                resp = requests.post(f"{backend_url}/predict", json=payload, timeout=60)
                prob = resp.json()["skip_probability"]
                st.success(f"Predicted skip probability: **{prob:.3f}** (label={int(row['skip_flag'])})")
                st.progress(min(max(prob, 0.0), 1.0))
            except Exception as e:
                st.error(f"Error calling backend: {e}")
    else:
        st.info("No dataset found. First run: simulate → preprocess → train")

st.caption("Tip: set `backend_url` in `.streamlit/secrets.toml` if your API is remote.")
