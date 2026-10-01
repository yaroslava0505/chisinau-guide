"""Generate favicon assets matching the navbar 'CH' logo (zinc-900 rounded square)."""
from PIL import Image, ImageDraw, ImageFont

BG = (24, 24, 27, 255)   # zinc-900
FG = (255, 255, 255, 255)
FONT_PATH = "/System/Library/Fonts/Supplemental/Arial Black.ttf"

def make_icon(size: int, corner_ratio: float = 0.22) -> Image.Image:
    scale = 4  # supersample for smooth edges/text
    s = size * scale
    img = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    radius = int(s * corner_ratio)
    draw.rounded_rectangle([0, 0, s - 1, s - 1], radius=radius, fill=BG)

    text = "CH"
    font_size = int(s * 0.46)
    font = ImageFont.truetype(FONT_PATH, font_size)
    bbox = draw.textbbox((0, 0), text, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    pos = ((s - tw) / 2 - bbox[0], (s - th) / 2 - bbox[1] - s * 0.02)
    draw.text(pos, text, font=font, fill=FG)

    return img.resize((size, size), Image.LANCZOS)

sizes_png = [16, 32, 48, 96, 180, 192, 512]
out = {}
for sz in sizes_png:
    out[sz] = make_icon(sz)

out[16].save("public/favicon-16x16.png")
out[32].save("public/favicon-32x32.png")
out[96].save("public/favicon-96x96.png")
out[180].save("public/apple-touch-icon.png")
out[192].save("public/android-chrome-192x192.png")
out[512].save("public/android-chrome-512x512.png")

# Multi-size .ico
out[16].convert("RGBA").save(
    "public/favicon.ico",
    sizes=[(16, 16), (32, 32), (48, 48)],
)

print("done")
