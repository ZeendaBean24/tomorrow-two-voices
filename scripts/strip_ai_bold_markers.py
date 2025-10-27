#!/usr/bin/env python3
import json
from pathlib import Path

# Default target file
TARGET = Path("data/stories_skeleton.json")

def strip_bold_markers(text: str) -> str:
    if text is None:
        return text
    return text.replace("**", "")

def main() -> None:
    if not TARGET.exists():
        raise SystemExit(f"❌ cannot find {TARGET}")

    data = json.loads(TARGET.read_text(encoding="utf-8"))

    changed_texts = 0
    records_seen = 0

    for item in data:
        records_seen += 1
        ai = item.get("ai", {})
        for tone in ("hopeful", "balanced", "cautionary"):
            chunk = ai.get(tone)
            if not isinstance(chunk, dict):
                continue
            txt = chunk.get("text")
            if isinstance(txt, str):
                cleaned = strip_bold_markers(txt)
                if cleaned != txt:
                    chunk["text"] = cleaned
                    changed_texts += 1

    TARGET.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"✅ cleaned bold markers in {TARGET}")
    print(f"   records scanned: {records_seen}")
    print(f"   ai.text fields changed: {changed_texts}")

if __name__ == "__main__":
    main()

