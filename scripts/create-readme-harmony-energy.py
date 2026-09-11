from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw

from readme_animation_common import (
    AMBER,
    AMBER_100,
    BLUE,
    BLUE_100,
    CORAL,
    CORAL_100,
    INK,
    INK_SOFT,
    LINE,
    LOCKED,
    LOCKED_100,
    MUTED,
    SURFACE,
    TEAL,
    TEAL_100,
    TEAL_50,
    WIDTH,
    background,
    centered_label,
    draw_footer,
    draw_shell,
    ease,
    font,
    label,
    line,
    mix,
    rounded,
)


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public" / "tripmind-harmony-energy.gif"
FPS = 10
FRAME_COUNT = 60
STAGES = 5
STAGE_FRAMES = FRAME_COUNT // STAGES


def draw_metric_card(draw, box, title, value, detail, fill, color):
    left, top, right, bottom = box
    rounded(draw, box, 14, fill)
    centered_label(draw, (left, top + 10, right, top + 29), title, 8, MUTED, True)
    centered_label(draw, (left, top + 26, right, top + 57), value, 19, color, True)
    centered_label(draw, (left, top + 53, right, bottom - 7), detail, 8, INK_SOFT)


def draw_harmony(draw, stage, progress):
    x1, y1, x2, y2 = 75, 154, 505, 488
    rounded(draw, (x1, y1, x2, y2), 20, SURFACE, LINE, 1)
    centered_label(draw, (x1 + 18, y1 + 20, x2 - 18, y1 + 39), "GROUP HARMONY", 8, BLUE, True)
    centered_label(draw, (x1 + 18, y1 + 39, x2 - 18, y1 + 70), "Protect the least-satisfied traveler", 15, INK, True)
    centered_label(draw, (x1 + 18, y1 + 68, x2 - 18, y1 + 88), "A better average is not enough.", 9, INK_SOFT)

    harmony_amount = 0.0
    if stage == 1:
        harmony_amount = ease(progress)
    elif stage >= 2:
        harmony_amount = 1.0
    harmony = 72 + int(19 * harmony_amount)
    score_box = (x1 + 24, y1 + 101, x2 - 24, y1 + 178)
    rounded(draw, score_box, 15, BLUE_100 if stage == 0 else TEAL_50)
    centered_label(draw, (score_box[0], score_box[1] + 8, score_box[2], score_box[1] + 24), "OVERALL HARMONY", 8, MUTED, True)
    centered_label(draw, (score_box[0], score_box[1] + 22, score_box[2], score_box[1] + 57), f"{harmony}%", 26, TEAL if stage >= 1 else BLUE, True)
    rounded(draw, (score_box[0] + 28, score_box[3] - 17, score_box[2] - 28, score_box[3] - 10), 4, (222, 232, 236))
    rounded(draw, (score_box[0] + 28, score_box[3] - 17, score_box[0] + 28 + int((score_box[2] - score_box[0] - 56) * harmony / 100), score_box[3] - 10), 4, TEAL if stage >= 1 else BLUE)

    label(draw, (x1 + 24, y1 + 198), "MEMBER SATISFACTION", 8, MUTED, True)
    members = [("Alex", 92, TEAL), ("Jamie", 84, BLUE), ("Sam", 64, AMBER), ("Taylor", 78, (126, 104, 170))]
    for index, (name, baseline, color) in enumerate(members):
        target = {"Alex": 96, "Jamie": 90, "Sam": 82, "Taylor": 88}[name]
        amount = harmony_amount
        score = baseline + int((target - baseline) * amount)
        row_y = y1 + 221 + index * 25
        label(draw, (x1 + 24, row_y), name, 9, INK_SOFT, True, "lm")
        rounded(draw, (x1 + 91, row_y - 4, x2 - 61, row_y + 4), 4, (236, 241, 238))
        rounded(draw, (x1 + 91, row_y - 4, x1 + 91 + int((x2 - x1 - 152) * score / 100), row_y + 4), 4, color)
        label(draw, (x2 - 24, row_y), str(score), 9, color if amount > 0 else MUTED, True, "ra")

    note_fill = TEAL_100 if stage >= 1 else BLUE_100
    note_color = TEAL if stage >= 1 else BLUE
    rounded(draw, (x1 + 24, y2 - 25, x2 - 24, y2 - 7), 9, note_fill)
    centered_label(draw, (x1 + 24, y2 - 24, x2 - 24, y2 - 8), "Minimum satisfaction protected", 8, note_color, True)


def draw_energy(draw, stage, progress):
    x1, y1, x2, y2 = 528, 154, 925, 488
    rounded(draw, (x1, y1, x2, y2), 20, SURFACE, LINE, 1)
    centered_label(draw, (x1 + 18, y1 + 20, x2 - 18, y1 + 39), "TRAVEL ENERGY", 8, TEAL, True)
    centered_label(draw, (x1 + 18, y1 + 39, x2 - 18, y1 + 70), "Leave room for energy", 18, INK, True)
    centered_label(draw, (x1 + 18, y1 + 68, x2 - 18, y1 + 88), "Make the load visible before approval.", 9, INK_SOFT)

    energy_amount = 0.0
    if stage == 2:
        energy_amount = ease(progress)
    elif stage >= 3:
        energy_amount = 1.0
    walking = 8.4 - 3.8 * energy_amount
    rest_blocks = int(energy_amount + 0.5)
    transfers = 5 - int(2 * energy_amount)
    fatigue = "Medium" if energy_amount > 0.55 else "High"
    energy_box = (x1 + 24, y1 + 101, x2 - 24, y1 + 178)
    rounded(draw, energy_box, 15, TEAL_50 if stage >= 2 else AMBER_100)
    centered_label(draw, (energy_box[0], energy_box[1] + 8, energy_box[2], energy_box[1] + 25), "DAILY WALKING", 8, MUTED, True)
    centered_label(draw, (energy_box[0], energy_box[1] + 24, energy_box[2], energy_box[1] + 57), f"{walking:.1f} km", 26, TEAL if stage >= 2 else AMBER, True)
    centered_label(draw, (energy_box[0], energy_box[3] - 13, energy_box[2], energy_box[3] - 2), "Comfort target ≤ 5.0 km", 8, TEAL if energy_amount > 0.4 else AMBER, True)

    label(draw, (x1 + 24, y1 + 198), "LOAD COMPARISON", 8, MUTED, True)
    rows = [
        ("Rest blocks", "0", str(rest_blocks), TEAL),
        ("Fatigue risk", "High", fatigue, AMBER),
        ("Transfers", "5", str(transfers), BLUE),
    ]
    for index, (name, before, after, color) in enumerate(rows):
        row_y = y1 + 226 + index * 27
        label(draw, (x1 + 24, row_y), name, 9, MUTED, True, "lm")
        label(draw, (x1 + 204, row_y), before, 9, MUTED, False, "rm")
        label(draw, (x1 + 226, row_y), "→", 10, color, True, "mm")
        label(draw, (x2 - 24, row_y), after, 9, INK_SOFT if energy_amount > 0 else MUTED, True, "ra")
        if index < len(rows) - 1:
            line(draw, [(x1 + 24, row_y + 16), (x2 - 24, row_y + 16)], LINE, 1)

    if stage >= 3:
        rounded(draw, (x1 + 24, y2 - 25, x2 - 24, y2 - 7), 9, TEAL_100)
        centered_label(draw, (x1 + 24, y2 - 24, x2 - 24, y2 - 8), "Balanced candidate ready", 8, TEAL, True)
    else:
        rounded(draw, (x1 + 24, y2 - 25, x2 - 24, y2 - 7), 9, AMBER_100)
        centered_label(draw, (x1 + 24, y2 - 24, x2 - 24, y2 - 8), "Estimate · Not medical advice", 8, AMBER, True)


def draw_center_badge(draw, stage, progress):
    if stage < 3:
        return
    amount = ease(progress)
    fill = mix(TEAL_100, TEAL, amount)
    text_color = SURFACE if amount > 0.45 else TEAL
    rounded(draw, (383, 122, 617, 151), 14, fill)
    centered_label(draw, (383, 122, 617, 151), "BALANCED PLAN · APPROVED" if stage == 4 else "CANDIDATE ESTIMATE", 9, text_color, True)


def render(stage, progress):
    image = background()
    draw = ImageDraw.Draw(image)
    draw_shell(draw, "TRIPMIND · GROUP HARMONY + TRAVEL ENERGY", "TripMind", "Penang Food & Culture Escape", "Harmony + Energy")
    draw_center_badge(draw, stage, progress)
    draw_harmony(draw, stage, progress)
    draw_energy(draw, stage, progress)
    captions = [
        "See the baseline",
        "Protect the group",
        "Reduce the load",
        "Compare the candidate",
        "Approve a balanced plan",
    ]
    draw_footer(draw, captions[stage], stage, STAGES, "Harmony  •  Energy  •  Minimum protection")
    return image


def main():
    frames: list[Image.Image] = []
    for frame_index in range(FRAME_COUNT):
        stage = min(STAGES - 1, frame_index // STAGE_FRAMES)
        progress = (frame_index % STAGE_FRAMES) / (STAGE_FRAMES - 1)
        frames.append(render(stage, progress).convert("P", palette=Image.Palette.ADAPTIVE, colors=128))

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
