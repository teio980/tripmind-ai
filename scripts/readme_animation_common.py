from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont


WIDTH, HEIGHT = 1000, 640

BG = (247, 248, 245)
SURFACE = (255, 255, 255)
INK = (23, 51, 47)
INK_SOFT = (56, 78, 73)
MUTED = (108, 125, 120)
TEAL = (14, 113, 104)
TEAL_DARK = (8, 87, 80)
TEAL_100 = (221, 242, 237)
TEAL_50 = (241, 250, 247)
BLUE = (54, 120, 184)
BLUE_100 = (229, 240, 250)
AMBER = (199, 131, 36)
AMBER_100 = (252, 241, 219)
CORAL = (201, 94, 75)
CORAL_100 = (252, 232, 226)
LINE = (226, 233, 229)
LOCKED = (91, 91, 114)
LOCKED_100 = (239, 238, 247)


def find_font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    names = [
        "C:/Windows/Fonts/segoeuib.ttf" if bold else "C:/Windows/Fonts/segoeui.ttf",
        "C:/Windows/Fonts/arialbd.ttf" if bold else "C:/Windows/Fonts/arial.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    ]
    for name in names:
        path = Path(name)
        if path.exists():
            return ImageFont.truetype(str(path), size)
    return ImageFont.load_default()


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    return find_font(size, bold)


def rounded(draw: ImageDraw.ImageDraw, box, radius, fill, outline=None, width=1):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def label(draw: ImageDraw.ImageDraw, xy, value, size=12, fill=MUTED, bold=False, anchor="la"):
    draw.text(xy, value, font=font(size, bold), fill=fill, anchor=anchor)


def centered_label(draw: ImageDraw.ImageDraw, box, value, size=12, fill=MUTED, bold=False):
    left, top, right, bottom = box
    label(draw, ((left + right) / 2, (top + bottom) / 2), value, size, fill, bold, "mm")


def line(draw: ImageDraw.ImageDraw, points, fill=LINE, width=1):
    draw.line(points, fill=fill, width=width, joint="curve")


def pill(draw: ImageDraw.ImageDraw, xy, value, fill, text_fill, size=10, padding_x=9, padding_y=5, bold=True):
    x, y = xy
    f = font(size, bold)
    left, top, right, bottom = draw.textbbox((0, 0), value, font=f)
    width = right - left + padding_x * 2
    height = bottom - top + padding_y * 2
    rounded(draw, (x, y, x + width, y + height), height // 2, fill)
    draw.text((x + padding_x, y + padding_y - 1), value, font=f, fill=text_fill)
    return width, height


def ease(value: float) -> float:
    value = max(0.0, min(1.0, value))
    return value * value * (3 - 2 * value)


def mix(first, second, amount):
    amount = max(0.0, min(1.0, amount))
    return tuple(int(first[index] * (1 - amount) + second[index] * amount) for index in range(3))


def background() -> Image.Image:
    image = Image.new("RGB", (WIDTH, HEIGHT), BG)
    draw = ImageDraw.Draw(image)
    for y in range(HEIGHT):
        blend = y / HEIGHT
        color = tuple(int(BG[i] * (1 - blend) + (255, 255, 255)[i] * blend) for i in range(3))
        draw.line((0, y, WIDTH, y), fill=color)

    glow = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow)
    glow_draw.ellipse((-130, -160, 430, 260), fill=(*TEAL_100, 120))
    glow_draw.ellipse((670, 360, 1130, 780), fill=(*AMBER_100, 95))
    glow = glow.filter(ImageFilter.GaussianBlur(62))
    return Image.alpha_composite(image.convert("RGBA"), glow).convert("RGB")


def cubic(start, control_a, control_b, end, steps=18):
    points = []
    for index in range(steps + 1):
        t = index / steps
        inverse = 1 - t
        points.append(
            (
                inverse**3 * start[0]
                + 3 * inverse**2 * t * control_a[0]
                + 3 * inverse * t**2 * control_b[0]
                + t**3 * end[0],
                inverse**3 * start[1]
                + 3 * inverse**2 * t * control_a[1]
                + 3 * inverse * t**2 * control_b[1]
                + t**3 * end[1],
            )
        )
    return points


def draw_tripmind_mark(draw: ImageDraw.ImageDraw, x, y, size=34):
    scale = size / 64
    left = x - size / 2
    top = y - size / 2

    def point(value):
        return (left + value[0] * scale, top + value[1] * scale)

    rounded(draw, (left, top, left + size, top + size), 18 * scale, TEAL)
    route = []
    route.extend(cubic((14.5, 43.5), (22.5, 48), (38.8, 46.2), (43, 35.4)))
    route.extend(cubic((43, 35.4), (46, 27.7), (40.3, 22.5), (32.9, 25.2))[1:])
    route.extend(cubic((32.9, 25.2), (26.5, 27.5), (24.9, 33.9), (30.9, 36.7))[1:])
    route.extend(cubic((30.9, 36.7), (36.9, 39.5), (44.5, 33.1), (49, 20.4))[1:])
    draw.line([point(item) for item in route], fill=(217, 241, 232), width=max(2, round(4.6 * scale)), joint="curve")

    detail = cubic((14.5, 43.5), (20, 46), (25.6, 46.9), (31.3, 46.3))
    draw.line([point(item) for item in detail], fill=SURFACE, width=max(1, round(1.8 * scale)), joint="curve")
    start_x, start_y = point((14.5, 43.5))
    radius = 3.2 * scale
    draw.ellipse((start_x - radius, start_y - radius, start_x + radius, start_y + radius), fill=SURFACE)

    star = [
        (49, 9.7),
        (51.35, 15.25),
        (56.9, 17.6),
        (51.35, 19.95),
        (49, 25.5),
        (46.65, 19.95),
        (41.1, 17.6),
        (46.65, 15.25),
    ]
    draw.polygon([point(item) for item in star], fill=(244, 185, 95))


def draw_shell(draw: ImageDraw.ImageDraw, eyebrow, title, subtitle, tag):
    label(draw, (WIDTH // 2, 26), eyebrow, 12, TEAL, True, "ma")
    rounded(draw, (47, 72, 953, 526), 28, (218, 226, 221))
    rounded(draw, (50, 68, 950, 522), 28, SURFACE, LINE, 1)
    draw_tripmind_mark(draw, 83, 101, 34)
    label(draw, (113, 93), title, 17, INK, True)
    label(draw, (113, 113), subtitle, 9, MUTED)
    pill(draw, (790, 86), tag, TEAL_100, TEAL, 9, 9, 5)
    line(draw, [(73, 136), (927, 136)], LINE, 1)


def draw_footer(draw: ImageDraw.ImageDraw, caption, step, total, note="Plan  •  Explain  •  Approve"):
    label(draw, (WIDTH // 2, 558), caption, 17, INK, True, "ma")
    label(draw, (WIDTH // 2, 583), note, 10, MUTED, True, "ma")
    rail_y = 613
    start_x = WIDTH // 2 - ((total - 1) * 42) // 2
    for index in range(total):
        x = start_x + index * 42
        color = TEAL if index <= step else LINE
        draw.ellipse((x - 5, rail_y - 5, x + 5, rail_y + 5), fill=color)
        if index < total - 1:
            line(draw, [(x + 6, rail_y), (x + 36, rail_y)], color, 2)
