import argparse, os, numpy as np, pandas as pd
from tqdm import tqdm

# Lightweight audio synth for previews
def synth_wave(duration_s=10, sr=16000, freq=220.0, noise=0.02, seed=0):
    rng = np.random.default_rng(seed)
    t = np.linspace(0, duration_s, int(sr*duration_s), endpoint=False)
    wave = 0.6*np.sin(2*np.pi*freq*t) + 0.4*np.sin(2*np.pi*freq*0.5*t)
    wave += noise*rng.normal(size=t.shape)
    # Normalize
    wave = wave / max(1e-8, np.abs(wave).max())
    return wave.astype(np.float32), sr

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--n_tracks", type=int, default=500)
    parser.add_argument("--n_users", type=int, default=100)
    parser.add_argument("--out_csv", type=str, default="data/dataset.csv")
    parser.add_argument("--seed", type=int, default=42)
    args = parser.parse_args()

    rng = np.random.default_rng(args.seed)

    os.makedirs("data/audio", exist_ok=True)
    os.makedirs("data/spectrograms", exist_ok=True)

    rows = []
    print("Simulating tracks/users...")
    for i in tqdm(range(args.n_tracks)):
        track_id = f"track_{i:05d}"
        # Simple metadata
        tempo = rng.uniform(70, 180)
        danceability = rng.uniform(0,1)
        energy = rng.uniform(0,1)
        valence = rng.uniform(0,1)
        popularity = rng.integers(0, 100)
        release_year = rng.integers(1995, 2025)
        genre = rng.choice(["pop","hiphop","edm","rock","indie","rnb","latin"])

        # Audio preview (one per track)
        wave, sr = synth_wave(freq=rng.uniform(120, 440), seed=i)
        audio_path = f"data/audio/{track_id}.npy"
        np.save(audio_path, wave)

        # Create multiple user interactions per track
        n_users_for_track = rng.integers(max(1, args.n_users//args.n_tracks), max(3, args.n_users//args.n_tracks + 3))
        for u in range(n_users_for_track):
            user_id = f"user_{rng.integers(0, args.n_users):05d}"
            # True skip probability (synthetic): higher energy+danceability early peaks → lower skip; mismatched genre ↑ skip
            base = 0.55 - 0.2*danceability - 0.1*energy + 0.0005*(2025 - release_year) + (0.1 if genre in ["indie","rock"] else 0.0)
            base += (0.05 if popularity < 20 else -0.02)
            base = np.clip(base, 0.05, 0.95)
            skip_flag = int(rng.uniform() < base)

            rows.append({
                "track_id": track_id,
                "user_id": user_id,
                "skip_flag": skip_flag,
                "genre": genre,
                "tempo": tempo,
                "danceability": danceability,
                "energy": energy,
                "valence": valence,
                "popularity": popularity,
                "release_year": release_year,
                "audio_path": audio_path,
                # spectrogram_path filled later by preprocess (to keep separation of concerns)
                "spectrogram_path": ""
            })

    df = pd.DataFrame(rows)
    df.to_csv(args.out_csv, index=False)
    print(f"Wrote {args.out_csv}. Next: run spectrogram extraction:\n"
          f"  python -m src.audio.preprocess --csv {args.out_csv} --out_dir data/spectrograms")

if __name__ == "__main__":
    main()
