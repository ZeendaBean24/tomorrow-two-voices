#!/usr/bin/env python3
"""Generate keyword and distribution summaries for the Insights page."""

from __future__ import annotations

import json
import re
from collections import Counter
from pathlib import Path

DATA_PATH = Path("data/stories_skeleton.json")
OUTPUT_PATH = Path("data/insights_summary.json")

FIELDS = [
    ("ai_future", "Feelings about AI"),
    ("hope", "Common Hopes"),
    ("worry", "Common Worries"),
    ("technology", "Top Technologies"),
    ("place", "Where We Are"),
    ("value", "Values We Lean On"),
]

STOPWORDS = {
    "the",
    "and",
    "for",
    "that",
    "with",
    "this",
    "from",
    "have",
    "about",
    "your",
    "their",
    "they",
    "them",
    "but",
    "are",
    "was",
    "were",
    "had",
    "has",
    "not",
    "you",
    "our",
    "out",
    "all",
    "any",
    "can",
    "will",
    "its",
    "her",
    "his",
    "she",
    "him",
    "who",
    "what",
    "why",
    "how",
    "when",
    "where",
    "too",
    "use",
    "used",
    "into",
    "get",
    "got",
    "yet",
    "off",
    "per",
    "or",
    "nor",
    "don",
    "hasn",
    "hadn",
    "did",
    "didn",
    "than",
    "then",
    "there",
    "here",
    "because",
    "over",
    "under",
    "onto",
    "upon",
    "between",
    "among",
    "once",
    "ever",
    "even",
    "just",
    "more",
    "most",
    "less",
    "least",
    "very",
    "much",
    "many",
    "also",
    "still",
    "such",
    "own",
    "same",
    "each",
    "other",
    "every",
    "either",
    "neither",
    "both",
    "few",
    "lot",
    "lots",
    "via",
    "due",
    "like",
    "made",
    "make",
    "makes",
    "using",
    "able",
    "need",
    "needs",
    "needed",
    "toward",
    "towards",
    "would",
    "could",
    "should",
    "shall",
    "may",
    "might",
    "must",
    "thus",
    "two",
    "one",
    "new",
    "into",
    "onto",
    "upon",
    "of",
    "in",
    "on",
    "at",
    "by",
    "be",
    "is",
    "it",
    "as",
    "to",
    "an",
    "a",
}

WORD_RE = re.compile(r"[a-zA-Z']+")


def tokenize(text: str) -> list[str]:
    return [
        token
        for token in WORD_RE.findall(text.lower())
        if len(token) >= 3 and token not in STOPWORDS
    ]


def top_terms(counter: Counter[str], limit: int = 50) -> list[dict]:
    return [
        {"term": term, "count": count}
        for term, count in counter.most_common(limit)
    ]


def build_keyword_summary(records: list[dict]) -> dict:
    summary = {}
    for field, label in FIELDS:
        unigrams = Counter()
        bigrams = Counter()
        for record in records:
            tokens = tokenize(record.get("seed", {}).get(field, ""))
            if not tokens:
                continue
            unigrams.update(tokens)
            for idx in range(len(tokens) - 1):
                first, second = tokens[idx], tokens[idx + 1]
                if first in STOPWORDS or second in STOPWORDS:
                    continue
                bigrams.update([f"{first} {second}"])
        summary[field] = {
            "label": label,
            "unigrams": top_terms(unigrams),
            "bigrams": top_terms(bigrams),
        }
    return summary


def build_overlap(records: list[dict]) -> dict:
    hope_tokens = Counter()
    worry_tokens = Counter()
    for record in records:
        hope_tokens.update(tokenize(record.get("seed", {}).get("hope", "")))
        worry_tokens.update(tokenize(record.get("seed", {}).get("worry", "")))

    overlap_terms = set(hope_tokens) & set(worry_tokens)
    overlap = Counter({
        term: hope_tokens[term] + worry_tokens[term]
        for term in overlap_terms
    })

    hope_unique = [
        {"term": term, "count": hope_tokens[term]}
        for term in hope_tokens
        if term not in overlap_terms
    ]
    hope_unique.sort(key=lambda item: item["count"], reverse=True)

    worry_unique = [
        {"term": term, "count": worry_tokens[term]}
        for term in worry_tokens
        if term not in overlap_terms
    ]
    worry_unique.sort(key=lambda item: item["count"], reverse=True)

    return {
        "overlap": top_terms(overlap),
        "hope_unique": hope_unique[:50],
        "worry_unique": worry_unique[:50],
    }


def build_distribution(records: list[dict]) -> dict:
    total = len(records)
    agency = Counter()
    age_band = Counter()
    themes = Counter()

    for record in records:
        seed = record.get("seed", {})
        agency_key = seed.get("central_actor", "Unknown") or "Unknown"
        agency[agency_key] += 1
        age_key = seed.get("age_band", "Unknown") or "Unknown"
        age_band[age_key] += 1
        for theme in seed.get("themes", []) or []:
            if theme:
                themes[theme] += 1

    def format_counts(counter: Counter[str]) -> list[dict]:
        return [
            {
                "label": label,
                "count": count,
                "percent": round((count / total) * 100, 2) if total else 0,
            }
            for label, count in counter.most_common()
        ]

    return {
        "agency": format_counts(agency),
        "age_band": format_counts(age_band),
        "themes": format_counts(themes),
    }


def main() -> None:
    if not DATA_PATH.exists():
        raise SystemExit(f"❌ cannot find {DATA_PATH}")

    records = json.loads(DATA_PATH.read_text(encoding="utf-8"))
    summary = {
        "keywords": build_keyword_summary(records),
        "hope_vs_worry": build_overlap(records),
        "distributions": build_distribution(records),
    }

    OUTPUT_PATH.write_text(
        json.dumps(summary, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    print(f"✅ wrote {OUTPUT_PATH}")


if __name__ == "__main__":
    main()

