import argparse, os, numpy as np, pandas as pd, joblib
NUMERIC_COLS = ["tempo", "danceability", "energy", "valence", "popularity", "release_year"]
CAT_COLS = ["genre"]

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--csv", required=True)
    ap.add_argument("--epochs", type=int, default=1)
    ap.add_argument("--batch_size", type=int, default=32)
    ap.add_argument("--lr", type=float, default=1e-3)
    ap.add_argument("--out_dir", type=str, default="models")
    ap.add_argument("--seed", type=int, default=42)
    args = ap.parse_args()

    os.makedirs(args.out_dir, exist_ok=True)
    df = pd.read_csv(args.csv).dropna(subset=["spectrogram_path"])

    # Try PyTorch training; fallback to sklearn LogisticRegression baseline.
    try:
        import torch, torch.nn as nn
        from torch.utils.data import Dataset, DataLoader
        from sklearn.preprocessing import StandardScaler, OneHotEncoder
        from sklearn.compose import ColumnTransformer
        from sklearn.metrics import accuracy_score, roc_auc_score, confusion_matrix
        from sklearn.pipeline import Pipeline
        from src.model.multimodal_model import MultiModalClassifier

        DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

        class SkipDataset(Dataset):
            def __init__(self, df, tab_transform):
                self.df = df.reset_index(drop=True)
                self.tab_transform = tab_transform
                self._tab = self.tab_transform.transform(df[NUMERIC_COLS+CAT_COLS])
            def __len__(self): return len(self.df)
            def __getitem__(self, idx):
                r = self.df.iloc[idx]
                spec = np.load(r["spectrogram_path"]).astype(np.float32)[None, ...]
                tab = self._tab[idx].astype(np.float32)
                y = np.float32(r["skip_flag"])
                import torch
                return torch.from_numpy(spec), torch.from_numpy(tab), torch.tensor(y)

        # split
        rng = np.random.default_rng(args.seed)
        idx = np.arange(len(df)); rng.shuffle(idx)
        n = len(idx); n_tr=int(0.7*n); n_va=int(0.15*n)
        tr, va, te = idx[:n_tr], idx[n_tr:n_tr+n_va], idx[n_tr+n_va:]
        tr_df, va_df, te_df = df.iloc[tr], df.iloc[va], df.iloc[te]

        num_proc = Pipeline([("scaler", StandardScaler())])
        cat_proc = Pipeline([("ohe", OneHotEncoder(handle_unknown="ignore"))])
        from sklearn.compose import ColumnTransformer
        ct = ColumnTransformer([("num", num_proc, NUMERIC_COLS),
                                ("cat", cat_proc, CAT_COLS)])
        ct.fit(tr_df[NUMERIC_COLS+CAT_COLS])
        joblib.dump(ct, os.path.join(args.out_dir, "tab_preprocessor.joblib"))

        train_ds = SkipDataset(tr_df, ct); val_ds = SkipDataset(va_df, ct); test_ds = SkipDataset(te_df, ct)
        train_loader = DataLoader(train_ds, batch_size=args.batch_size, shuffle=True)
        val_loader   = DataLoader(val_ds, batch_size=args.batch_size, shuffle=False)
        test_loader  = DataLoader(test_ds, batch_size=args.batch_size, shuffle=False)

        # infer tab dim
        s_spec, s_tab, _ = next(iter(train_loader))
        num_tab = s_tab.shape[1]
        model = MultiModalClassifier(num_tab=num_tab).to(DEVICE)
        crit = nn.BCEWithLogitsLoss()
        opt = torch.optim.Adam(model.parameters(), lr=args.lr)

        def run_epoch(loader, train=True):
            if train: model.train()
            else: model.eval()
            losses=[]; all_p=[]; all_y=[]
            for spec, tab, y in loader:
                spec, tab, y = spec.to(DEVICE), tab.to(DEVICE), y.to(DEVICE)
                with torch.set_grad_enabled(train):
                    logit = model(spec, tab)
                    loss = crit(logit, y)
                if train:
                    opt.zero_grad(); loss.backward(); opt.step()
                losses.append(loss.item())
                all_p.extend(torch.sigmoid(logit).detach().cpu().numpy().tolist())
                all_y.extend(y.cpu().numpy().tolist())
            return float(np.mean(losses)), np.array(all_y), np.array(all_p)

        # Train few epochs
        best_auc = -1.0
        for e in range(args.epochs):
            tr_loss, _, _ = run_epoch(train_loader, True)
            vl_loss, vy, vp = run_epoch(val_loader, False)
            from sklearn.metrics import roc_auc_score
            try: auc = roc_auc_score(vy, vp)
            except: auc = float("nan")
            if (not np.isnan(auc)) and auc > best_auc:
                best_auc = auc
                import torch
                torch.save(model.state_dict(), os.path.join(args.out_dir, "best.pt"))

        # Test
        import torch
        model.load_state_dict(torch.load(os.path.join(args.out_dir, "best.pt"), map_location=DEVICE))
        _, ty, tp = run_epoch(test_loader, False)
        from sklearn.metrics import accuracy_score, confusion_matrix, roc_auc_score
        yhat = (tp>=0.5).astype(int)
        acc = accuracy_score(ty, yhat)
        try: auc = roc_auc_score(ty, tp)
        except: auc = float("nan")
        cm = confusion_matrix(ty, yhat).tolist()
        with open(os.path.join(args.out_dir, "report.json"), "w") as f:
            json.dump({"test_acc": float(acc), "test_auc": float(auc), "confusion_matrix": cm}, f, indent=2)
        return

    except Exception as e:
        # Fallback: sklearn baseline
        from sklearn.preprocessing import StandardScaler, OneHotEncoder
        from sklearn.compose import ColumnTransformer
        from sklearn.pipeline import Pipeline
        from sklearn.linear_model import LogisticRegression
        from sklearn.metrics import accuracy_score, roc_auc_score, confusion_matrix
        ct = ColumnTransformer([("num", StandardScaler(), NUMERIC_COLS),
                                ("cat", OneHotEncoder(handle_unknown='ignore'), CAT_COLS)])
        X = df[NUMERIC_COLS+CAT_COLS]; y = df["skip_flag"].astype(int).values
        rng = np.random.default_rng(args.seed)
        idx = np.arange(len(df)); rng.shuffle(idx)
        n = len(idx); n_tr=int(0.7*n); n_va=int(0.15*n)
        tr, va, te = idx[:n_tr], idx[n_tr:n_tr+n_va], idx[n_tr+n_va:]
        clf = Pipeline([("prep", ct), ("lr", LogisticRegression(max_iter=1000))])
        clf.fit(X.iloc[tr], y[tr])
        joblib.dump(ct, os.path.join(args.out_dir, "tab_preprocessor.joblib"))
        yp = clf.predict_proba(X.iloc[te])[:,1]; yhat=(yp>=0.5).astype(int)
        try: auc = roc_auc_score(y[te], yp)
        except: auc = float("nan")
        acc = accuracy_score(y[te], yhat); cm = confusion_matrix(y[te], yhat).tolist()
        with open(os.path.join(args.out_dir, "report.json"), "w") as f:
            json.dump({"test_acc": float(acc), "test_auc": float(auc), "confusion_matrix": cm,
                       "note": "Metadata-only LogisticRegression baseline (PyTorch path failed)."}, f, indent=2)
        open(os.path.join(args.out_dir, "best.pt"), "wb").close()

if __name__ == "__main__":
    main()
