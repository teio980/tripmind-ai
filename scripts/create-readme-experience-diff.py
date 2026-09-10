from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public" / "tripmind-experience-diff.gif"
WIDTH, HEIGHT = 1000, 640
FPS = 10
FRAME_COUNT = 60
STAGES = 6
STAGE_FRAMES = FRAME_COUNT // STAGES

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


def line(draw: ImageDraw.ImageDraw, points, fill=LINE, width=1):
    draw.line(points, fill=fill, width=width, joint="curve")


def pill(
    draw: ImageDraw.ImageDraw,
    xy,
    value,
    fill,
    text_fill,
    size=11,
    padding_x=10,
    padding_y=5,
    bold=True,
):
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
    glow_draw.ellipse((-120, -150, 440, 280), fill=(*TEAL_100, 125))
    glow_draw.ellipse((670, 360, 1130, 780), fill=(*AMBER_100, 100))
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
    """Draw the existing tripmind-mark.svg geometry at GIF resolution."""
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


def centered_label(draw: ImageDraw.ImageDraw, box, value, size=12, fill=MUTED, bold=False):
    left, top, right, bottom = box
    label(draw, ((left + right) / 2, (top + bottom) / 2), value, size, fill, bold, "mm")


def draw_frame(draw: ImageDraw.ImageDraw):
    rounded(draw, (47, 72, 953, 526), 28, (218, 226, 221))
    rounded(draw, (50, 68, 950, 522), 28, SURFACE, LINE, 1)
    draw_tripmind_mark(draw, 83, 101, 34)
    label(draw, (113, 93), "TripMind", 17, INK, True)
    label(draw, (113, 113), "Penang Food & Culture Escape", 9, MUTED, False)
    pill(draw, (783, 86), "Experience Diff", TEAL_100, TEAL, 9, 9, 5)
    line(draw, [(73, 136), (927, 136)], LINE, 1)


def draw_timeline(draw: ImageDraw.ImageDraw, stage: int, progress: float):
    x1, y1, x2, y2 = 75, 154, 505, 488
    rounded(draw, (x1, y1, x2, y2), 20, (252, 253, 252), LINE, 1)
    label(draw, (x1 + 23, y1 + 23), "DAY 2 · TUESDAY", 8, MUTED, True)

    if stage == 0:
        pill(draw, (x2 - 128, y1 + 16), "Version 1 · Formal", TEAL_100, TEAL, 8, 8, 4)
    elif stage == 5:
        pill(draw, (x2 - 129, y1 + 16), "Version 2 · Formal", TEAL_100, TEAL, 8, 8, 4)
    else:
        pill(draw, (x2 - 128, y1 + 16), "Pending draft", AMBER_100, AMBER, 8, 8, 4)

    line(draw, [(x1 + 48, y1 + 86), (x1 + 48, y2 - 28)], LINE, 2)
    items = [
        ("12:00", "George Town old-town lunch", "Shared interest · Food", TEAL),
        ("14:00", "Mural & neighborhood walk", "Outdoor activity · Scheduled", CORAL),
        ("17:00", "Rest block", "Buffer before dinner", AMBER),
        ("19:30", "Hai Keng Restaurant", "Fixed arrangement · Locked", LOCKED),
    ]
    for index, (time, title, subtitle, color) in enumerate(items):
        row_y = y1 + 81 + index * 67
        is_affected = index == 1 and 1 <= stage <= 4
        is_updated = index == 1 and stage == 5
        if is_affected:
            rounded(draw, (x1 + 13, row_y - 20, x2 - 13, row_y + 37), 13, CORAL_100)
        elif is_updated:
            rounded(draw, (x1 + 13, row_y - 20, x2 - 13, row_y + 37), 13, TEAL_50)

        dot_color = CORAL if is_affected else TEAL if is_updated else color
        draw.ellipse((x1 + 41, row_y - 8, x1 + 55, row_y + 6), fill=dot_color)
        if index == 3:
            draw.ellipse((x1 + 44, row_y - 5, x1 + 52, row_y + 3), outline=SURFACE, width=2)
        label(draw, (x1 + 74, row_y - 9), time, 9, MUTED, True)

        title_value = title
        subtitle_value = subtitle
        if index == 1 and stage >= 1 and stage < 5:
            subtitle_value = "Outdoor activity · Affected"
        if stage == 5 and index == 1:
            title_value = "Covered food hall"
            subtitle_value = "Indoor replacement · Updated"
        label(draw, (x1 + 122, row_y - 9), title_value, 10, INK_SOFT, True if is_affected or is_updated else False)
        label(draw, (x1 + 122, row_y + 11), subtitle_value, 8, CORAL if is_affected else TEAL if is_updated else MUTED)

    if stage >= 1 and stage < 5:
        # A small animated marker makes the affected window feel discovered rather than merely recolored.
        marker_x = x1 + 27 + int(13 * ease(progress))
        draw.ellipse((marker_x - 3, y1 + 182, marker_x + 3, y1 + 188), fill=CORAL)
        label(draw, (x1 + 22, y2 - 25), "14:00–17:00 needs a local repair", 8, CORAL, True)
    elif stage == 5:
        label(draw, (x1 + 22, y2 - 25), "Only the affected window changed", 8, TEAL, True)
    else:
        label(draw, (x1 + 22, y2 - 25), "Locked arrangements stay protected", 8, LOCKED, True)


def draw_summary(draw: ImageDraw.ImageDraw, stage: int, progress: float):
    x1, y1, x2, y2 = 528, 154, 925, 488
    rounded(draw, (x1, y1, x2, y2), 20, SURFACE, LINE, 1)

    if stage == 0:
        label(draw, (x1 + 24, y1 + 27), "CURRENT FORMAL PLAN", 8, MUTED, True)
        label(draw, (x1 + 24, y1 + 59), "Ready to adapt", 22, INK, True)
        label(draw, (x1 + 24, y1 + 88), "TripMind keeps the rest of the day stable.", 10, INK_SOFT)
        draw_stat(draw, x1 + 24, y1 + 130, "Harmony", "72%", TEAL, TEAL_50)
        draw_stat(draw, x1 + 157, y1 + 130, "Spend", "RM 4,360", BLUE, BLUE_100)
        draw_stat(draw, x1 + 290, y1 + 130, "Locked", "1 plan", LOCKED, LOCKED_100)
        rounded(draw, (x1 + 24, y1 + 231, x2 - 24, y1 + 297), 15, TEAL_50)
        label(draw, (x1 + 43, y1 + 252), "When something changes", 10, TEAL_DARK, True)
        label(draw, (x1 + 43, y1 + 274), "we repair the smallest affected window.", 9, INK_SOFT)

    elif stage == 1:
        alert_box = (x1 + 22, y1 + 20, x2 - 22, y1 + 104)
        rounded(draw, alert_box, 17, CORAL_100)
        centered_label(draw, (alert_box[0], alert_box[1] + 8, alert_box[2], alert_box[1] + 28), "DISRUPTION DETECTED", 8, CORAL, True)
        centered_label(draw, (alert_box[0], alert_box[1] + 28, alert_box[2], alert_box[1] + 61), "Heavy rain · Day 2 · 13:30", 15, INK, True)
        centered_label(draw, (alert_box[0], alert_box[1] + 61, alert_box[2], alert_box[3] - 4), "Outdoor activities may be affected.", 9, INK_SOFT)
        label(draw, (x1 + 24, y1 + 137), "TripMind found a local impact", 15, INK, True)
        draw_check_row(draw, x1 + 24, y1 + 175, "Affected window", "14:00–17:00", CORAL)
        draw_check_row(draw, x1 + 24, y1 + 218, "Dinner", "19:30 · Locked", LOCKED)
        draw_check_row(draw, x1 + 24, y1 + 261, "Rest of itinerary", "Unchanged", TEAL)

    elif stage == 2:
        label(draw, (x1 + 24, y1 + 27), "LOCAL REPAIR", 8, TEAL, True)
        label(draw, (x1 + 24, y1 + 58), "Repair only what changed", 19, INK, True)
        label(draw, (x1 + 24, y1 + 86), "Three rules guide the candidates.", 10, INK_SOFT)
        constraints = [
            ("Keep 19:30 dinner", LOCKED_100, LOCKED),
            ("End by 17:00", TEAL_100, TEAL),
            ("Protect walking limit", BLUE_100, BLUE),
        ]
        for index, (value, fill, color) in enumerate(constraints):
            yy = y1 + 127 + index * 44
            rounded(draw, (x1 + 24, yy, x2 - 24, yy + 30), 10, fill)
            draw.ellipse((x1 + 37, yy + 9, x1 + 45, yy + 17), fill=color)
            label(draw, (x1 + 59, yy + 15), value, 10, INK_SOFT, True, "lm")
        rounded(draw, (x1 + 24, y1 + 273, x2 - 24, y1 + 307), 11, AMBER_100)
        label(draw, (x1 + 42, y1 + 290), "No full-day rebuild required", 9, AMBER, True, "lm")

    elif stage == 3:
        label(draw, (x1 + 24, y1 + 27), "CANDIDATES", 8, BLUE, True)
        label(draw, (x1 + 24, y1 + 58), "Choose your trade-off", 19, INK, True)
        label(draw, (x1 + 24, y1 + 86), "Every option explains its impact.", 10, INK_SOFT)
        cards = [
            ("Covered food hall", "+RM 40", "4.6 km walking", "Low weather risk", TEAL, TEAL_50),
            ("Museum + tasting", "+RM 80", "5.2 km walking", "More interests", BLUE, BLUE_100),
            ("Cafe + rest block", "−RM 60", "3.8 km walking", "Lower budget", AMBER, AMBER_100),
        ]
        active = 0 if progress < 0.72 else min(2, int((progress - 0.72) * 10))
        for index, (title, cost, walking, note, color, fill) in enumerate(cards):
            yy = y1 + 120 + index * 62
            is_active = index == active
            rounded(draw, (x1 + 20, yy, x2 - 20, yy + 49), 12, fill if is_active else SURFACE, color if is_active else LINE, 2 if is_active else 1)
            draw.ellipse((x1 + 36, yy + 17, x1 + 46, yy + 27), outline=color, width=2)
            if is_active:
                draw.ellipse((x1 + 39, yy + 20, x1 + 43, yy + 24), fill=color)
            label(draw, (x1 + 62, yy + 15), title, 10, INK_SOFT, True, "lm")
            label(draw, (x1 + 62, yy + 33), f"{walking} · {note}", 8, MUTED, False, "lm")
            label(draw, (x2 - 38, yy + 20), cost, 9, color, True, "rm")
        pill(draw, (x1 + 24, y2 - 40), "Recommended: least walking", TEAL_100, TEAL, 8, 8, 4)

    elif stage == 4:
        label(draw, (x1 + 24, y1 + 27), "EXPERIENCE DIFF", 8, TEAL, True)
        label(draw, (x1 + 24, y1 + 58), "Review before apply", 19, INK, True)
        label(draw, (x1 + 24, y1 + 86), "The proposal is still a pending draft.", 10, INK_SOFT)
        amount = ease(progress)
        diff_rows = [
            ("Harmony", f"72% → {72 + int(19 * amount)}%", TEAL),
            ("Walking", f"8.4 → {8.4 - 3.8 * amount:.1f} km", BLUE),
            ("Budget", f"RM 4,360 → RM {4_360 + int(40 * amount):,}", AMBER),
        ]
        for index, (name, value, color) in enumerate(diff_rows):
            yy = y1 + 112 + index * 37
            rounded(draw, (x1 + 22, yy, x2 - 22, yy + 33), 10, SURFACE, LINE, 1)
            draw.ellipse((x1 + 36, yy + 12, x1 + 44, yy + 20), fill=color)
            label(draw, (x1 + 58, yy + 16), name, 9, MUTED, True, "lm")
            label(draw, (x2 - 39, yy + 16), value, 9, INK_SOFT, True, "rm")
        locked_box = (x1 + 22, y1 + 225, x2 - 22, y1 + 259)
        rounded(draw, locked_box, 12, LOCKED_100)
        centered_label(draw, locked_box, "✓  19:30 dinner preserved", 9, LOCKED, True)
        button_fill = mix(TEAL_100, TEAL, ease(progress))
        button_left, button_right = x1 + 22, x2 - 22
        button_bottom = y2 - 20
        button_top = button_bottom - 40
        rounded(draw, (button_left, button_top, button_right, button_bottom), 13, button_fill)
        centered_label(
            draw,
            (button_left, button_top, button_right, button_bottom),
            "Approve candidate",
            10,
            SURFACE if progress > 0.35 else TEAL,
            True,
        )

    else:
        version_box = (x1 + 22, y1 + 18, x2 - 22, y1 + 82)
        rounded(draw, version_box, 17, TEAL_50)
        centered_label(draw, (version_box[0], version_box[1] + 4, version_box[2], version_box[1] + 24), "CANDIDATE APPROVED", 8, TEAL, True)
        centered_label(draw, (version_box[0], version_box[1] + 27, version_box[2], version_box[3] - 2), "Version 2 · Formal", 16, INK, True)

        rain_box = (x1 + 22, y1 + 94, x2 - 22, y1 + 145)
        rounded(draw, rain_box, 14, AMBER_100)
        centered_label(draw, (rain_box[0], rain_box[1] + 5, rain_box[2], rain_box[1] + 24), "RAIN REPLAN", 8, AMBER, True)
        centered_label(draw, (rain_box[0], rain_box[1] + 24, rain_box[2], rain_box[3] - 3), "14:00–17:00 window repaired", 9, INK_SOFT, True)

        label(draw, (x1 + 24, y1 + 171), "APPLIED CHANGES", 8, MUTED, True)
        draw_check_row(draw, x1 + 24, y1 + 204, "14:00–17:00", "Covered food hall", TEAL)
        draw_check_row(draw, x1 + 24, y1 + 242, "Walking", "8.4 → 4.6 km", BLUE)
        draw_check_row(draw, x1 + 24, y1 + 280, "Dinner", "Still locked", LOCKED)
        rounded(draw, (x1 + 24, y1 + 294, x2 - 24, y1 + 309), 8, TEAL_100)
        rounded(draw, (x1 + 24, y1 + 294, x1 + 24 + int(345 * ease(progress)), y1 + 309), 8, TEAL)
        centered_label(draw, (x1 + 24, y1 + 313, x2 - 24, y1 + 333), "Ready to share with the group", 9, TEAL_DARK, True)


def draw_stat(draw, x, y, name, value, color, fill):
    rounded(draw, (x, y, x + 116, y + 68), 13, fill)
    label(draw, (x + 14, y + 17), name, 8, MUTED, True)
    label(draw, (x + 14, y + 45), value, 13, color, True)


def draw_check_row(draw, x, y, left, right, color):
    draw.ellipse((x, y - 5, x + 10, y + 5), fill=color)
    label(draw, (x + 20, y), left, 9, MUTED, True, "lm")
    label(draw, (x + 347, y), right, 9, INK_SOFT, True, "rm")


def draw_footer(draw: ImageDraw.ImageDraw, stage: int):
    captions = [
        "Start with the formal plan",
        "Detect the disruption",
        "Isolate the affected window",
        "Compare the trade-offs",
        "Explain before apply",
        "Protect the experience",
    ]
    label(draw, (WIDTH // 2, 558), captions[stage], 17, INK, True, "ma")
    label(draw, (WIDTH // 2, 583), "Plan  •  Explain  •  Approve", 10, MUTED, True, "ma")
    rail_y = 613
    start_x = 395
    for index in range(STAGES):
        x = start_x + index * 42
        color = TEAL if index <= stage else LINE
        draw.ellipse((x - 5, rail_y - 5, x + 5, rail_y + 5), fill=color)
        if index < STAGES - 1:
            line(draw, [(x + 6, rail_y), (x + 36, rail_y)], color, 2)


def render(stage: int, progress: float) -> Image.Image:
    image = background()
    draw = ImageDraw.Draw(image)
    label(draw, (WIDTH // 2, 26), "TRIPMIND · PROTECT THE EXPERIENCE", 12, TEAL, True, "ma")
    draw_frame(draw)
    draw_timeline(draw, stage, progress)
    draw_summary(draw, stage, progress)
    draw_footer(draw, stage)
    return image


def main():
    frames: list[Image.Image] = []
    for frame_index in range(FRAME_COUNT):
        stage = min(STAGES - 1, frame_index // STAGE_FRAMES)
        progress = (frame_index % STAGE_FRAMES) / (STAGE_FRAMES - 1)
        frame = render(stage, progress).convert("P", palette=Image.Palette.ADAPTIVE, colors=128)
        frames.append(frame)

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    frames[0].save(
        OUTPUT,
        save_all=True,
        append_images=frames[1:],
        duration=1000 // FPS,
        loop=0,
        optimize=True,
        disposal=2,
    )
    print(f"Created {OUTPUT} ({OUTPUT.stat().st_size:,} bytes, {len(frames)} frames)")


if __name__ == "__main__":
    main()
