#!/usr/bin/env python3
import json
import argparse
from pathlib import Path
import pandas as pd

# ---------- paths ----------
SCRIPT_DIR = Path(__file__).resolve().parent          # .../scripts
REPO_ROOT  = SCRIPT_DIR.parent                        # repo root
DATA_DIR   = REPO_ROOT / "data"

DEFAULT_CSV = DATA_DIR / "2050 Storylets_Submissions_2025-09-25.csv"
DEFAULT_OUT = DATA_DIR / "stories_skeleton.json"

# ---------- utils ----------
def clean(x):
    if pd.isna(x):
        return ""
    if isinstance(x, str):
        return x.strip()
    return x

def build_stories_skeleton(csv_path: Path, out_json_path: Path):
    if not csv_path.exists():
        raise FileNotFoundError(f"CSV not found: {csv_path}")

    df = pd.read_csv(csv_path)

    # boolean consent column (the 2nd consent col is boolean)
    consent_col = df.columns[4]

    records = []
    for _, row in df.iterrows():
        submission_id = clean(row["Submission ID"])
        respondent_id = clean(row["Respondent ID"])
        submitted_at  = clean(row["Submitted at"])
        consent       = bool(row[consent_col])

        raw_themes = clean(row["Which theme(s) best describe your overall hope, worry, and anchors? Max 2."])
        if isinstance(raw_themes, str) and raw_themes:
            parts = [
                p.strip() for p in (
                    raw_themes
                    .replace("；", ";")
                    .replace("、", ",")
                    .replace("，", ",")
                    .replace(";", ",")
                ).split(",") if p.strip()
            ]
        else:
            parts = []
        themes = parts[:2]

        rec = {
            "id": f"S-{submission_id}",
            "submitted_at": submitted_at,
            "seed": {
                "respondent_id": respondent_id,
                "language": clean(row["What language are you responding in?"]),
                "age_band": clean(row["Which age band are you in?"]),
                "consent": consent,
                "hope": clean(row["What's one thing you hope for in your 2050 day? (120 char.)"]),
                "worry": clean(row["What’s one thing you worry about in your 2050 day? (120 char.)"]),
                "ai_future": clean(row["Finish this about AI in your future. (120 char.)"]),
                "technology": clean(row["Name one technology you will use in 2050."]),
                "object": clean(row["Name one other object in your day."]),
                "place": clean(row["Name one place you'll be."]),
                "time": clean(row["Name one specific time."]),
                "person_or_role": clean(row["Name one person or role."]),
                "value": clean(row["What value matters the most here?"]),
                "sensory_detail": clean(row["Add one sensory detail (see/hear/smell/taste/touch)"]),
                "central_actor": clean(row["Looking at your hope, worry, and anchors, who is most central to the action?"]),
                "themes": themes
            },
            "ai": {
                "hopeful":   { "title": "", "text": "" },
                "cautionary":{ "title": "", "text": "" },
                "balanced":  { "title": "", "text": "" }
            },
            "metrics": {}
        }
        records.append(rec)

    out_json_path.parent.mkdir(parents=True, exist_ok=True)
    with open(out_json_path, "w", encoding="utf-8") as f:
        json.dump(records, f, ensure_ascii=False, indent=2)

    print(f"✅ Wrote {len(records)} records → {out_json_path}")

# ---------- cli ----------
if __name__ == "__main__":
    p = argparse.ArgumentParser(description="Map 2050 Storylets CSV → JSON skeleton.")
    p.add_argument("--csv", type=Path, default=DEFAULT_CSV, help="Path to input CSV")
    p.add_argument("--out", type=Path, default=DEFAULT_OUT, help="Path to output JSON")
    args = p.parse_args()

    # If user passed relative paths, make them relative to repo root
    csv_path = args.csv if args.csv.is_absolute() else (REPO_ROOT / args.csv)
    out_path = args.out if args.out.is_absolute() else (REPO_ROOT / args.out)

    build_stories_skeleton(csv_path, out_path)
