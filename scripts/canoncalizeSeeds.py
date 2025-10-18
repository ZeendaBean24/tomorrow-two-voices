#!/usr/bin/env python3
import json
from pathlib import Path

IN  = Path("data/stories_skeleton.json")
OUT = Path("data/stories_for_llm.json")

def clean(s):
    return (s or "").strip()

data = json.loads(IN.read_text(encoding="utf-8"))
out_records = []

for item in data:
    seed = item.get("seed", {})
    rec = {
        "id": item.get("id", ""),
        "seed_canonical": {
            "language": clean(seed.get("language")),
            "central_actor": clean(seed.get("central_actor")),
            "hope": clean(seed.get("hope")),
            "worry": clean(seed.get("worry")),
            "ai_future": clean(seed.get("ai_future")),
            "anchors": {
                "technology":    clean(seed.get("technology")),
                "object":        clean(seed.get("object")),
                "place":         clean(seed.get("place")),
                "time":          clean(seed.get("time")),          # ← no normalization
                "person_or_role":clean(seed.get("person_or_role")),
                "value":         clean(seed.get("value")),
                "sensory_detail":clean(seed.get("sensory_detail"))
            },
            # keep themes exactly as provided (list or empty)
            "themes": seed.get("themes", [])
        },
        "completed": False
    }
    out_records.append(rec)

OUT.write_text(json.dumps(out_records, ensure_ascii=False, indent=2), encoding="utf-8")
print(f"✅ wrote {OUT} ({len(out_records)} records)")
