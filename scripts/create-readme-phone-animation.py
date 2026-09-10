from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public" / "tripmind-product-flow.gif"
WIDTH, HEIGHT = 1000, 640
FPS = 10
FRAME_COUNT = 60
STAGE_FRAMES = FRAME_COUNT // 6

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


def pill(draw: ImageDraw.ImageDraw, xy, label, fill, text_fill, size=12, padding_x=9, padding_y=5, bold=True):
    x, y = xy
    f = font(size, bold)
    left, top, right, bottom = draw.textbbox((0, 0), label, font=f)
    w = right - left + padding_x * 2
    h = bottom - top + padding_y * 2
    rounded(draw, (x, y, x + w, y + h), h // 2, fill)
    draw.text((x + padding_x, y + padding_y - 1), label, font=f, fill=text_fill)
    return w, h


def label(draw: ImageDraw.ImageDraw, xy, value, size=12, fill=MUTED, bold=False, anchor="la"):
    draw.text(xy, value, font=font(size, bold), fill=fill, anchor=anchor)


def line(draw: ImageDraw.ImageDraw, points, fill=LINE, width=1):
    draw.line(points, fill=fill, width=width, joint="curve")


def compass(draw: ImageDraw.ImageDraw, x, y, scale=1.0):
    r = int(15 * scale)
    draw.ellipse((x - r, y - r, x + r, y + r), fill=TEAL)
    draw.ellipse((x - r + 5, y - r + 5, x + r - 5, y + r - 5), outline=(255, 255, 255), width=max(1, int(1.5 * scale)))
    draw.polygon([(x - 3 * scale, y + 5 * scale), (x + 5 * scale, y - 5 * scale), (x + 3 * scale, y + 3 * scale)], fill=(255, 255, 255))


def background() -> Image.Image:
    image = Image.new("RGB", (WIDTH, HEIGHT), BG)
    draw = ImageDraw.Draw(image)
    for y in range(HEIGHT):
        blend = y / HEIGHT
        color = tuple(int(BG[i] * (1 - blend) + (255, 255, 255)[i] * blend) for i in range(3))
        draw.line((0, y, WIDTH, y), fill=color)
    # Soft brand glows that echo the existing browser page gradients.
    glow = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow)
    glow_draw.ellipse((30, -110, 440, 260), fill=(*TEAL_100, 110))
    glow_draw.ellipse((650, 380, 1120, 820), fill=(*AMBER_100, 90))
    glow = glow.filter(ImageFilter.GaussianBlur(55))
    image = Image.alpha_composite(image.convert("RGBA"), glow).convert("RGB")
    return image


def draw_phone_shell(draw: ImageDraw.ImageDraw):
    px, py, pw, ph = 360, 30, 280, 560
    rounded(draw, (px, py, px + pw, py + ph), 42, (18, 27, 28))
    rounded(draw, (px + 8, py + 8, px + pw - 8, py + ph - 8), 35, (226, 232, 228))
    rounded(draw, (px + 15, py + 18, px + pw - 15, py + ph - 18), 27, SURFACE)
    rounded(draw, (px + 112, py + 12, px + pw - 112, py + 27), 8, (18, 27, 28))
    return px + 15, py + 18, pw - 30, ph - 36


def draw_mobile_topbar(draw: ImageDraw.ImageDraw, sx, sy, title="TripMind"):
    compass(draw, sx + 23, sy + 25, 0.72)
    label(draw, (sx + 45, sy + 25), title, 15, INK, True, "lm")
    draw.ellipse((sx + 230, sy + 21, sx + 234, sy + 25), fill=TEAL)
    line(draw, [(sx + 15, sy + 48), (sx + 235, sy + 48)], LINE, 1)


def draw_mobile_bottom(draw: ImageDraw.ImageDraw, sx, sy, active="Itinerary"):
    by = sy + 433
    line(draw, [(sx + 15, by), (sx + 235, by)], LINE, 1)
    items = [("Itinerary", sx + 30), ("Harmony", sx + 90), ("Budget", sx + 150), ("Replan", sx + 210)]
    for item, x in items:
        is_active = item == active
        if is_active:
            rounded(draw, (x - 24, by + 8, x + 24, by + 31), 11, TEAL_100)
        color = TEAL if is_active else MUTED
        draw.ellipse((x - 4, by + 14, x + 4, by + 22), outline=color, width=2)
        label(draw, (x, by + 35), item, 8, color, is_active, "ma")


def draw_home(draw: ImageDraw.ImageDraw, sx, sy, progress):
    draw_mobile_topbar(draw, sx, sy)
    rounded(draw, (sx + 15, sy + 60, sx + 235, sy + 178), 20, (239, 250, 246))
    label(draw, (sx + 30, sy + 78), "TRIPMIND AI TRAVEL PLANNER", 7, TEAL, True)
    label(draw, (sx + 30, sy + 100), "Tell me where", 20, INK, True)
    label(draw, (sx + 30, sy + 123), "you want to go.", 20, TEAL, True)
    # A small route line uses the same visual language as the browser hero.
    points = [(sx + 35, sy + 158), (sx + 74, sy + 145), (sx + 119, sy + 160), (sx + 164, sy + 139), (sx + 220, sy + 151)]
    line(draw, points, TEAL, 2)
    dot = int((progress * (len(points) - 1)) % (len(points) - 1))
    x, y = points[dot]
    draw.ellipse((x - 5, y - 5, x + 5, y + 5), fill=AMBER, outline=SURFACE, width=2)
    rounded(draw, (sx + 15, sy + 193, sx + 235, sy + 335), 18, SURFACE, LINE, 1)
    label(draw, (sx + 30, sy + 212), "START HERE", 7, MUTED, True)
    label(draw, (sx + 30, sy + 232), "Tell TripMind what you're thinking", 12, INK, True)
    rounded(draw, (sx + 28, sy + 253, sx + 232, sy + 295), 10, (250, 252, 251), TEAL, 1)
    label(draw, (sx + 39, sy + 274), "I want to travel...", 10, INK_SOFT, False, "lm")
    # Keep the send control visually inside the input, with the same breathing
    # room used by the browser Demo's Chatbox.
    rounded(draw, (sx + 208, sy + 262, sx + 227, sy + 286), 7, TEAL)
    label(draw, (sx + 217, sy + 274), "↑", 11, SURFACE, True, "mm")
    pill(draw, (sx + 29, sy + 307), "Agent ready", TEAL_100, TEAL, 8, 7, 4)
    label(draw, (sx + 30, sy + 356), "No Plan required first", 8, INK_SOFT, True)
    label(draw, (sx + 30, sy + 372), "Fixed arrangements stay protected", 8, INK_SOFT, True)
    draw_mobile_bottom(draw, sx, sy, "Itinerary")


def draw_itinerary(draw: ImageDraw.ImageDraw, sx, sy, progress):
    draw_mobile_topbar(draw, sx, sy)
    rounded(draw, (sx + 15, sy + 60, sx + 235, sy + 123), 17, (242, 250, 247), LINE, 1)
    label(draw, (sx + 29, sy + 76), "TRP-PEN-2403", 7, MUTED, True)
    label(draw, (sx + 29, sy + 95), "Penang Food & Culture", 13, INK, True)
    pill(draw, (sx + 187, sy + 75), "Saved", TEAL_100, TEAL, 8, 6, 4)
    rounded(draw, (sx + 15, sy + 137, sx + 235, sy + 179), 12, SURFACE, LINE, 1)
    pill(draw, (sx + 23, sy + 145), "Itinerary", TEAL_100, TEAL, 8, 6, 4)
    label(draw, (sx + 96, sy + 158), "Harmony 72%", 8, MUTED, True, "lm")
    label(draw, (sx + 179, sy + 158), "Energy", 8, MUTED, True, "lm")
    label(draw, (sx + 29, sy + 204), "CURRENT FORMAL VERSION", 7, MUTED, True)
    label(draw, (sx + 29, sy + 222), "Version 1", 16, INK, True)
    pill(draw, (sx + 141, sy + 207), "Hard constraints passed", TEAL_100, TEAL, 6, 5, 3)
    rounded(draw, (sx + 15, sy + 242, sx + 235, sy + 402), 17, SURFACE, LINE, 1)
    label(draw, (sx + 29, sy + 260), "01  Day 1", 11, INK, True)
    label(draw, (sx + 29, sy + 278), "Arrival & George Town culture", 8, MUTED, False)
    activities = [("10:00", "Arrive at Penang Airport", TEAL), ("12:00", "George Town old-town lunch", TEAL), ("14:00", "Mural & neighborhood walk", BLUE), ("18:30", "Rest block", AMBER)]
    for index, (time, title, color) in enumerate(activities):
        y = sy + 305 + index * 22
        label(draw, (sx + 30, y), time, 8, MUTED, True)
        draw.ellipse((sx + 69, y - 3, sx + 77, y + 5), fill=color)
        line(draw, [(sx + 73, y + 5), (sx + 73, y + 20)], LINE, 1)
        label(draw, (sx + 86, y), title, 8, INK_SOFT, index == int(progress * 4) % 4)
    rounded(draw, (sx + 15, sy + 410, sx + 235, sy + 423), 7, TEAL_100)
    draw_mobile_bottom(draw, sx, sy, "Itinerary")


def draw_harmony(draw: ImageDraw.ImageDraw, sx, sy, progress):
    draw_mobile_topbar(draw, sx, sy)
    rounded(draw, (sx + 15, sy + 60, sx + 235, sy + 180), 20, (239, 248, 250))
    label(draw, (sx + 30, sy + 79), "GROUP HARMONY", 7, BLUE, True)
    label(draw, (sx + 30, sy + 102), "A rhythm everyone", 17, INK, True)
    label(draw, (sx + 30, sy + 123), "can accept.", 17, TEAL, True)
    label(draw, (sx + 30, sy + 149), "Protect the least-satisfied traveler.", 8, INK_SOFT)
    rounded(draw, (sx + 15, sy + 195, sx + 235, sy + 300), 17, SURFACE, LINE, 1)
    label(draw, (sx + 29, sy + 214), "OVERALL HARMONY", 7, MUTED, True)
    label(draw, (sx + 30, sy + 238), "72%", 27, INK, True)
    label(draw, (sx + 92, sy + 238), "→", 18, TEAL, True)
    next_score = 72 + int(19 * progress)
    label(draw, (sx + 119, sy + 238), f"{next_score}%", 27, TEAL, True)
    label(draw, (sx + 235, sy + 218), "Candidate estimate", 7, BLUE, True, "ra")
    rounded(draw, (sx + 15, sy + 315, sx + 235, sy + 402), 17, SURFACE, LINE, 1)
    label(draw, (sx + 29, sy + 334), "MEMBER SATISFACTION", 7, MUTED, True)
    members = [("Alex", 92, TEAL), ("Jamie", 84, BLUE), ("Sam", 64, AMBER), ("Taylor", 78, (126, 104, 170))]
    for index, (name, score, color) in enumerate(members):
        y = sy + 351 + index * 12
        label(draw, (sx + 29, y), name, 7, INK_SOFT, True)
        rounded(draw, (sx + 72, y - 3, sx + 205, y + 3), 3, (236, 241, 238))
        rounded(draw, (sx + 72, y - 3, sx + 72 + int(133 * score / 100), y + 3), 3, color)
        label(draw, (sx + 216, y), str(score), 7, INK_SOFT, True)
    draw_mobile_bottom(draw, sx, sy, "Harmony")


def draw_energy(draw: ImageDraw.ImageDraw, sx, sy, progress):
    draw_mobile_topbar(draw, sx, sy)
    rounded(draw, (sx + 15, sy + 60, sx + 235, sy + 153), 20, (242, 247, 252))
    label(draw, (sx + 30, sy + 79), "TRAVEL ENERGY · DAY 2", 7, BLUE, True)
    label(draw, (sx + 30, sy + 100), "Leave room", 17, INK, True)
    label(draw, (sx + 30, sy + 120), "for energy.", 17, BLUE, True)
    rounded(draw, (sx + 15, sy + 169, sx + 235, sy + 280), 17, SURFACE, LINE, 1)
    label(draw, (sx + 29, sy + 188), "WALKING", 7, MUTED, True)
    walking = 8.4 - 3.8 * progress
    label(draw, (sx + 29, sy + 214), f"{walking:.1f} km", 27, INK, True)
    label(draw, (sx + 150, sy + 214), "→", 17, TEAL, True)
    label(draw, (sx + 178, sy + 214), "4.6", 23, TEAL, True)
    label(draw, (sx + 220, sy + 214), "km", 8, TEAL, True, "lm")
    label(draw, (sx + 235, sy + 188), "Comfort target ≤5.0 km", 7, TEAL, True, "ra")
    metrics = [("Rest blocks", "0", "1", TEAL), ("Fatigue risk", "High", "Medium", AMBER), ("Transfers", "5", "3", BLUE)]
    for index, (name, before, after, color) in enumerate(metrics):
        y = sy + 304 + index * 33
        label(draw, (sx + 29, y), name, 8, MUTED, True)
        label(draw, (sx + 143, y), before, 8, MUTED, False)
        label(draw, (sx + 170, y), "→", 9, color, True)
        label(draw, (sx + 197, y), after, 8, INK_SOFT, True)
        line(draw, [(sx + 29, y + 15), (sx + 230, y + 15)], LINE, 1)
    draw_mobile_bottom(draw, sx, sy, "Energy")


def draw_replan(draw: ImageDraw.ImageDraw, sx, sy, progress):
    draw_mobile_topbar(draw, sx, sy)
    rounded(draw, (sx + 15, sy + 60, sx + 235, sy + 151), 20, (255, 245, 241))
    label(draw, (sx + 30, sy + 78), "DISRUPTION REPLANNER", 7, CORAL, True)
    label(draw, (sx + 30, sy + 101), "Heavy rain affected", 15, INK, True)
    label(draw, (sx + 30, sy + 122), "Day 2 afternoon.", 15, CORAL, True)
    label(draw, (sx + 30, sy + 141), "14:00–17:00 · Dinner stays locked", 7, INK_SOFT)
    label(draw, (sx + 29, sy + 176), "CHOOSE YOUR TRADE-OFF", 7, MUTED, True)
    options = [("Least walking", "+RM 40", TEAL, True), ("Keep more interests", "+RM 80", BLUE, False), ("Lower budget", "−RM 60", AMBER, False)]
    active = min(2, int(progress * 3))
    for index, (name, cost, color, recommended) in enumerate(options):
        y = sy + 194 + index * 55
        fill = TEAL_50 if index == active else SURFACE
        rounded(draw, (sx + 15, y, sx + 235, y + 45), 13, fill, color if index == active else LINE, 1)
        draw.ellipse((sx + 28, y + 16, sx + 37, y + 25), outline=color, width=2)
        if index == active:
            draw.ellipse((sx + 31, y + 19, sx + 34, y + 22), fill=color)
        label(draw, (sx + 48, y + 17), name, 9, INK_SOFT, True, "lm")
        label(draw, (sx + 207, y + 17), cost, 8, color, True, "rm")
        if recommended:
            pill(draw, (sx + 48, y + 27), "Recommended", TEAL_100, TEAL, 6, 5, 3)
    rounded(draw, (sx + 15, sy + 373, sx + 235, sy + 407), 12, LOCKED_100)
    label(draw, (sx + 29, sy + 390), "✓  Locked dinner: no impact", 8, LOCKED, True, "lm")
    draw_mobile_bottom(draw, sx, sy, "Replan")


def draw_budget(draw: ImageDraw.ImageDraw, sx, sy, progress):
    draw_mobile_topbar(draw, sx, sy)
    label(draw, (sx + 29, sy + 70), "BUDGET & VERSION CONTROL", 7, TEAL, True)
    label(draw, (sx + 29, sy + 91), "Review before", 18, INK, True)
    label(draw, (sx + 29, sy + 112), "you approve.", 18, TEAL, True)
    rounded(draw, (sx + 15, sy + 135, sx + 235, sy + 235), 17, SURFACE, LINE, 1)
    label(draw, (sx + 29, sy + 154), "TOTAL TRIP BUDGET", 7, MUTED, True)
    label(draw, (sx + 29, sy + 189), "RM 4,800", 26, INK, True)
    label(draw, (sx + 170, sy + 184), "Remaining", 7, MUTED, True)
    label(draw, (sx + 170, sy + 202), f"RM {440 - int(40 * progress)}", 13, TEAL, True)
    rounded(draw, (sx + 29, sy + 216, sx + 232, sy + 222), 3, (234, 240, 236))
    rounded(draw, (sx + 29, sy + 216, sx + 29 + int(182 * (0.91 + progress * 0.01)), sy + 222), 3, TEAL)
    categories = [("Stay", "RM 1,800", TEAL), ("Food", "RM 1,040", BLUE), ("Transport", "RM 540", AMBER), ("Activities", "RM 980", CORAL)]
    for index, (name, amount, color) in enumerate(categories):
        x = sx + 15 + (index % 2) * 117
        y = sy + 252 + (index // 2) * 49
        rounded(draw, (x, y, x + 101, y + 39), 11, SURFACE, LINE, 1)
        draw.ellipse((x + 10, y + 11, x + 18, y + 19), fill=color)
        label(draw, (x + 25, y + 12), name, 7, MUTED, True, "lm")
        label(draw, (x + 25, y + 28), amount, 8, INK_SOFT, True, "lm")
    rounded(draw, (sx + 15, sy + 355, sx + 235, sy + 405), 15, TEAL_50, TEAL, 1)
    label(draw, (sx + 29, sy + 373), "Pending draft", 8, TEAL, True)
    label(draw, (sx + 29, sy + 390), "Version 1 → Version 2", 9, INK, True)
    pill(draw, (sx + 182, sy + 367), "Approve", TEAL, SURFACE, 8, 8, 5)
    draw_mobile_bottom(draw, sx, sy, "Budget")


def draw_page(draw: ImageDraw.ImageDraw, stage: int, progress: float):
    sx, sy, _, _ = draw_phone_shell(draw)
    pages = [draw_home, draw_itinerary, draw_harmony, draw_energy, draw_replan, draw_budget]
    pages[stage](draw, sx, sy, progress)


def draw_surroundings(draw: ImageDraw.ImageDraw, stage: int, progress: float):
    names = ["Start with a thought", "See the plan", "Coordinate the group", "Protect energy", "Adapt to change", "Approve with confidence"]
    active = names[stage]
    label(draw, (WIDTH // 2, 26), "TRIPMIND · PROTECT THE EXPERIENCE", 12, TEAL, True, "ma")
    label(draw, (WIDTH // 2, 604), active, 17, INK, True, "ma")
    label(draw, (WIDTH // 2, 626), "Plan  •  Protect  •  Adapt", 10, MUTED, True, "ma")
    # Progress rail above the caption.
    rail_y = 580
    start_x = 405
    for index in range(6):
        x = start_x + index * 38
        color = TEAL if index <= stage else LINE
        draw.ellipse((x - 4, rail_y - 4, x + 4, rail_y + 4), fill=color)
        if index < 5:
            line(draw, [(x + 5, rail_y), (x + 33, rail_y)], color, 2)
    # Floating product principles echo the existing cards without covering the phone.
    left_cards = [("Chatbox-first", "Start without a Plan", TEAL_100, TEAL), ("Harmony", "Everyone counts", BLUE_100, BLUE)]
    right_cards = [("Energy-aware", "Leave room to breathe", AMBER_100, AMBER), ("Locked plans", "Fixed arrangements stay safe", LOCKED_100, LOCKED)]
    for index, (title, subtitle, fill, color) in enumerate(left_cards):
        y = 232 + index * 82
        rounded(draw, (52, y, 283, y + 59), 16, SURFACE, LINE, 1)
        draw.ellipse((68, y + 16, 82, y + 30), fill=fill)
        label(draw, (96, y + 17), title, 11, color, True)
        label(draw, (96, y + 37), subtitle, 9, MUTED)
    for index, (title, subtitle, fill, color) in enumerate(right_cards):
        y = 232 + index * 82
        rounded(draw, (717, y, 948, y + 59), 16, SURFACE, LINE, 1)
        draw.ellipse((733, y + 16, 747, y + 30), fill=fill)
        label(draw, (761, y + 17), title, 11, color, True)
        label(draw, (761, y + 37), subtitle, 9, MUTED)
    # A moving accent line gives the composition a subtle sense of travel.
    t = (stage + progress) / 6
    x = 75 + int(850 * ((math.sin(t * math.pi * 2) + 1) / 2))
    draw.ellipse((x - 3, 183, x + 3, 189), fill=AMBER)


def render(stage: int, progress: float) -> Image.Image:
    image = background()
    draw = ImageDraw.Draw(image)
    draw_surroundings(draw, stage, progress)
    draw_page(draw, stage, progress)
    return image


def main():
    frames: list[Image.Image] = []
    for frame_index in range(FRAME_COUNT):
        stage = min(5, frame_index // STAGE_FRAMES)
        local = (frame_index % STAGE_FRAMES) / (STAGE_FRAMES - 1)
        # Keep the phone frame and surrounding product principles stable. A clean
        # stage cut is more legible than crossfading two different card layouts,
        # which can make text and metrics appear to jump between screens.
        current = render(stage, local)
        frames.append(current.convert("P", palette=Image.Palette.ADAPTIVE, colors=128))
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    frames[0].save(OUTPUT, save_all=True, append_images=frames[1:], duration=1000 // FPS, loop=0, optimize=True, disposal=2)
    print(f"Created {OUTPUT} ({OUTPUT.stat().st_size:,} bytes, {len(frames)} frames)")


if __name__ == "__main__":
    main()
