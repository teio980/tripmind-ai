from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw

from readme_animation_common import (
    AMBER,
    AMBER_100,
    BLUE,
    BLUE_100,
    INK,
    INK_SOFT,
    LINE,
    LOCKED,
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
    label,
    line,
    rounded,
)


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public" / "tripmind-data-flow.gif"
FPS = 10
FRAME_COUNT = 60
STAGES = 6
STAGE_FRAMES = FRAME_COUNT // STAGES

NODE_CENTERS = [115, 267, 419, 571, 723, 875]
NODE_WIDTH = 112
NODE_TOP = 185
NODE_BOTTOM = 376
FLOW_Y = 282


def draw_arrow(draw, start_x, end_x, color):
    line(draw, [(start_x, FLOW_Y), (end_x, FLOW_Y)], color, 2)
    draw.polygon([(end_x, FLOW_Y), (end_x - 8, FLOW_Y - 5), (end_x - 8, FLOW_Y + 5)], fill=color)


def draw_node(draw, index, title, subtitle_lines, category, color, stage, progress):
    center = NODE_CENTERS[index]
    left, right = center - NODE_WIDTH // 2, center + NODE_WIDTH // 2
    is_active = index == stage
    is_done = index < stage
    fill = TEAL_50 if is_active else TEAL_100 if is_done else SURFACE
    outline = TEAL if is_active else TEAL_100 if is_done else LINE
    rounded(draw, (left, NODE_TOP, right, NODE_BOTTOM), 18, fill, outline, 2 if is_active else 1)

    dot_color = color if not is_done else TEAL
    dot_radius = 13 + int(2 * ease(progress)) if is_active else 11
    draw.ellipse((center - dot_radius, NODE_TOP + 41 - dot_radius, center + dot_radius, NODE_TOP + 41 + dot_radius), fill=dot_color)
    centered_label(draw, (left + 8, NODE_TOP + 8, right - 8, NODE_TOP + 23), category, 7, SURFACE if is_active or is_done else color, True)
    centered_label(draw, (left + 7, NODE_TOP + 60, right - 7, NODE_TOP + 85), title, 11, INK, True)
    for line_index, value in enumerate(subtitle_lines):
        centered_label(draw, (left + 7, NODE_TOP + 103 + line_index * 18, right - 7, NODE_TOP + 119 + line_index * 18), value, 8, INK_SOFT if is_active or is_done else MUTED, line_index == 0)

    status = "Active" if is_active else "Ready" if is_done else "Waiting"
    centered_label(draw, (left + 8, NODE_BOTTOM - 27, right - 8, NODE_BOTTOM - 10), status, 8, TEAL if is_active or is_done else MUTED, True)


def draw_flow(draw, stage, progress):
    nodes = [
        ("User message", ["Rough travel", "idea"], "INPUT", AMBER),
        ("Chat UI", ["Known fields", "and intent"], "INTERFACE", BLUE),
        ("TripProvider", ["State + Demo", "Fixture"], "STATE", TEAL),
        ("Deterministic", ["Harmony · Energy", "Budget · Replan"], "RULES", BLUE),
        ("Pending draft", ["Approval", "gate"], "VERSION", AMBER),
        ("localStorage", ["Refresh-safe", "browser state"], "PERSISTENCE", TEAL),
    ]

    for index in range(len(NODE_CENTERS) - 1):
        start_x = NODE_CENTERS[index] + NODE_WIDTH // 2
        end_x = NODE_CENTERS[index + 1] - NODE_WIDTH // 2
        color = TEAL if index < stage else LINE
        draw_arrow(draw, start_x + 4, end_x - 4, color)

    if stage < len(NODE_CENTERS) - 1:
        start_x = NODE_CENTERS[stage] + NODE_WIDTH // 2 + 5
        end_x = NODE_CENTERS[stage + 1] - NODE_WIDTH // 2 - 5
        dot_x = start_x + (end_x - start_x) * ease(progress)
    else:
        dot_x = NODE_CENTERS[-1]
    draw.ellipse((dot_x - 7, FLOW_Y - 7, dot_x + 7, FLOW_Y + 7), fill=AMBER, outline=SURFACE, width=2)

    for index, (title, subtitle_lines, category, color) in enumerate(nodes):
        draw_node(draw, index, title, subtitle_lines, category, color, stage, progress)


def render(stage, progress):
    image = background()
    draw = ImageDraw.Draw(image)
    draw_shell(draw, "TRIPMIND · CURRENT PROTOTYPE DATA FLOW", "TripMind", "Browser-local deterministic prototype", "Data flow")
    draw_flow(draw, stage, progress)
    rounded(draw, (101, 409, 899, 465), 16, (250, 252, 251), LINE, 1)
    centered_label(draw, (118, 421, 882, 443), "Fixed Fixture  ·  Browser-local state  ·  No live model call", 10, INK_SOFT, True)
    centered_label(draw, (118, 443, 882, 458), "The flow is repeatable without API keys, accounts, or network data.", 8, MUTED)

    captions = [
        "Capture the user's intent",
        "Keep the entry point simple",
        "Hold the trip state",
        "Apply deterministic rules",
        "Gate changes with approval",
        "Persist the demo state",
    ]
    draw_footer(draw, captions[stage], stage, STAGES, "Input  •  State  •  Rules  •  Approval  •  Persistence")
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
