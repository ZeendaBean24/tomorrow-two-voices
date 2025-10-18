#!/usr/bin/env python3
import json, re
from pathlib import Path

IN  = Path("data/stories_skeleton.json")
OUT = Path("data/stories_for_llm.json")

def norm_time(s):
    s = (s or "").strip().lower()
    m = re.match(r"(\d{1,2}):?(\d{2})?\s*(am|pm)?", s)
    if m:
        h = int(m.group(1))
        mm = m.group(2) or "00"
        ap = m.group(3)
        if ap == "pm" and h != 12: h += 12
        if ap == "am" and h == 12: h = 0
        return f"{h:02d}:{mm}"
    return s

def noun_phrase(s):
    return re.sub(r"^(at|in|on|the|a|an)\s+", "", (s or "").strip(), flags=re.I)

def sensory(s):
    s = (s or "").strip()
    if not s:
        return s
    if " " not in s:
        return f"smell of {s.lower()}"
    return s

def title_case_list(xs):
    return [x.strip().title() for x in xs if x.strip()]

data = json.loads(IN.read_text(encoding="utf-8"))
out_records = []

for item in data:
    seed = item.get("seed", {})
    themes = seed.get("themes", [])
    rec = {
        "id": item.get("id", ""),
        "seed_canonical": {
            "language": seed.get("language", "English"),
            "central_actor": (seed.get("central_actor") or "me").lower(),
            "hope": (seed.get("hope") or "").strip().capitalize(),
            "worry": (seed.get("worry") or "").strip().capitalize(),
            "ai_future": (seed.get("ai_future") or "").strip().capitalize(),
            "anchors": {
                "technology": noun_phrase(seed.get("technology")),
                "object": noun_phrase(seed.get("object")),
                "place": noun_phrase(seed.get("place")),
                "time": norm_time(seed.get("time")),
                "person_or_role": noun_phrase(seed.get("person_or_role")),
                "value": (seed.get("value") or "").strip().lower(),
                "sensory_detail": sensory(seed.get("sensory_detail"))
            },
            "themes": title_case_list(themes)[:2]
        },
        "completed": False
    }
    out_records.append(rec)

OUT.write_text(json.dumps(out_records, ensure_ascii=False, indent=2), encoding="utf-8")
print(f"✅ wrote {OUT} ({len(out_records)} records)")
