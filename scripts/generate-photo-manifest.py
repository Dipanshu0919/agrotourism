#!/usr/bin/env python3
from __future__ import annotations

import json
import re
from pathlib import Path


SUPPORTED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif"}


def natural_key(value: str):
    parts = re.split(r"(\d+)", value.lower())
    key = []
    for part in parts:
        if part.isdigit():
            key.append(int(part))
        else:
            key.append(part)
    return key


def main() -> None:
    root = Path(__file__).resolve().parents[1]
    photo_dir = root / "assets" / "photos"
    output_file = photo_dir / "photos.json"

    files = [
        path.name
        for path in photo_dir.iterdir()
        if path.is_file() and path.suffix.lower() in SUPPORTED_EXTENSIONS
    ]
    files.sort(key=natural_key)

    output_file.write_text(json.dumps(files, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
