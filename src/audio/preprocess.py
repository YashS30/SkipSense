import argparse, os, numpy as np, pandas as pd, librosa

def compute_mel(y, sr, n_mels=64, n_fft=1024, hop_length=256):
    S = librosa.feature.melspectrogram(y=y, sr=sr, n_mels=n_mels, n_fft=n_fft, hop_length=hop_length)
    S_db = librosa.power_to_db(S, ref=np.max)
    # Normalize to [-1,1]
    S_db = (S_db - S_db.min()) / max(1e-8, (S_db.max() - S_db.min()))
    S_db = 2.0*S_db - 1.0
    return S_db.astype(np.float32)

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--csv", type=str, required=True)
    parser.add_argument("--out_dir", type=str, default="data/spectrograms")
    parser.add_argument("--sr", type=int, default=16000)
    args = parser.parse_args()

    os.makedirs(args.out_dir, exist_ok=True)
    df = pd.read_csv(args.csv)
    updated_paths = []

    for track_id, group in df.groupby("track_id"):
        audio_path = group["audio_path"].iloc[0]
        y = np.load(audio_path)  # Mono waveform
        # If audio saved at other SR, we assume 16k here since synth was 16k
        S_db = compute_mel(y, sr=args.sr, n_mels=64, n_fft=1024, hop_length=256)
        spec_path = os.path.join(args.out_dir, f"{track_id}.npy")
        np.save(spec_path, S_db)
        updated_paths.append((track_id, spec_path))

    # Write spectrogram paths back
    spec_map = {tid: p for tid, p in updated_paths}
    df["spectrogram_path"] = df["track_id"].map(spec_map)
    df.to_csv(args.csv, index=False)
    print(f"Updated {args.csv} with spectrogram_path. Saved specs in {args.out_dir}")

if __name__ == "__main__":
    main()
