"""
Rebuild the web-optimised images for the Experience section.

Takes every PNG in the experience/ folder, e.g. "Opticent A.png",
and writes a small .webp copy next to it, e.g. "opticent-a.webp".
Only rebuilds copies whose PNG is newer. The PNGs are never modified.

Run from the site folder:   python tools/build-images.py
Needs Pillow:               pip install pillow
"""
from pathlib import Path
from PIL import Image

SRC = Path(__file__).resolve().parent.parent / "experience"

def slug(name: str) -> str:
    return "-".join(name.lower().split())

built = 0
for png in sorted(SRC.glob("*.png")):
    out = png.with_name(slug(png.stem) + ".webp")
    if out.exists() and out.stat().st_mtime >= png.stat().st_mtime:
        continue
    Image.open(png).convert("RGB").save(out, "WEBP", quality=84, method=6)
    print(f"{png.name}  ->  {out.name}  ({out.stat().st_size // 1024} KB)")
    built += 1

print(f"Done. {built} image(s) rebuilt." if built else "All images already up to date.")
