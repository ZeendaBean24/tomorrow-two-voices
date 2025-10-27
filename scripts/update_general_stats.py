#!/usr/bin/env python3
"""Aggregate high-level stats for the archive."""

from __future__ import annotations

import json
import re
from pathlib import Path

DATA_PATH = Path("data/stories_skeleton.json")
OUTPUT_PATH = Path("data/general_stats.json")


def normalise_text(value: str | None) -> str:
    return (value or "").strip()


def count_letters(text: str) -> int:
    # Count non-whitespace characters to approximate letters processed.
    return len(re.sub(r"\s+", "", text))


def count_words(text: str) -> int:
    return len(re.findall(r"\b\w+\b", text))


def count_sentences(text: str) -> int:
    segments = re.split(r"[.!?]+", text)
    return sum(1 for segment in segments if segment.strip())


def main() -> None:
    if not DATA_PATH.exists():
        raise SystemExit(f"❌ cannot find {DATA_PATH}")

    stories_data = json.loads(DATA_PATH.read_text(encoding="utf-8"))

    seeds = len(stories_data)
    story_variants = ["hopeful", "balanced", "cautionary"]
    total_letters = 0
    total_words = 0
    total_sentences = 0

    for item in stories_data:
        ai_entries = item.get("ai", {})
        for variant in story_variants:
            payload = ai_entries.get(variant)
            if not isinstance(payload, dict):
                continue
            text = normalise_text(payload.get("text"))
            if not text:
                continue
            total_letters += count_letters(text)
            total_words += count_words(text)
            total_sentences += count_sentences(text)

    stats = {
        "seeds": seeds,
        "stories": seeds * len(story_variants),
        "letters": total_letters,
        "words": total_words,
        "sentences": total_sentences,
    }

    OUTPUT_PATH.write_text(json.dumps(stats, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"✅ wrote {OUTPUT_PATH}")
    for key, value in stats.items():
        print(f"  {key}: {value}")


if __name__ == "__main__":
    main()

