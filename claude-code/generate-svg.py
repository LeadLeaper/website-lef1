#!/usr/bin/env python3
"""Generates linkedin-email-finder-from-search-results.svg with fake contacts."""

import os

BASE = "C:/aagreg/Development/aaaaClaude/projects/website-lef1/claude-code"
B64D = BASE + "/contacts-base64"
OUT  = BASE + "/linkedin-email-finder-from-search-results.svg"

contacts = [
    {"name": "Sarah Clark",       "title": "Chief Product Officer",   "company": "RPA Robotics", "city": "Seattle, Washington",       "img": "sarah-clark"},
    {"name": "James Walton",      "title": "VP, Operations",          "company": "Staples",      "city": "Chicago, Illinois",         "img": "james-walton"},
    {"name": "Maria Bonya",       "title": "Sales Manager",           "company": "Skechers",     "city": "Los Angeles, California",   "img": "maria-bonya"},
    {"name": "Tony Carlson",      "title": "SVP, Technology",         "company": "Trellix",      "city": "Austin, Texas",             "img": "tony-carlson"},
    {"name": "Simona Wilson",     "title": "Director, Marketing",     "company": "Lyft",         "city": "New York, New York",        "img": "simona-wilson"},
    {"name": "Kathryn Chen",      "title": "Chief Financial Officer", "company": "RPA Robotics", "city": "San Francisco, California", "img": "kathryn-chen"},
    {"name": "Jonathan Richards", "title": "Vice President, Sales",   "company": "Dropbox",      "city": "Boston, Massachusetts",     "img": "jonathan-richards"},
    {"name": "Cara Johnson",      "title": "Product Manager",         "company": "Stripe",       "city": "Denver, Colorado",          "img": "cara-johnson"},
    {"name": "Jason Dao",         "title": "Chief Scientist",         "company": "Cisco",        "city": "Atlanta, Georgia",          "img": "jason-dao"},
    {"name": "Ravi Rasheed",      "title": "CTO",                     "company": "Talkdesk",     "city": "Miami, Florida",            "img": "ravi-rasheed"},
]

# Load base64 photo data
for c in contacts:
    path = f"{B64D}/{c['img']}.txt"
    with open(path, "r") as f:
        c["b64"] = f.read().strip()
    print(f"  Loaded {c['img']}.txt ({len(c['b64'])//1024} KB)")

def x(s):
    """XML-escape a string."""
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")

# ── Layout constants ──────────────────────────────────────────────────────────
W     = 1270   # total SVG width
TOP   = 50     # top bar height
LW    = 820    # left (LinkedIn) panel width
RW    = 450    # right (sidebar) width
LRH   = 110    # left row height
RRH   = 78     # sidebar row height
SHH   = 55     # sidebar header height
SNH   = 45     # sidebar nav height
SFH   = 35     # sidebar footer height
SX    = LW     # sidebar x-origin
SBY   = TOP + SHH + SNH   # sidebar contacts start y  (= 150)
H     = TOP + len(contacts) * LRH  # total SVG height  (= 1150)

# ── Build SVG ─────────────────────────────────────────────────────────────────
L = []

L.append('<?xml version="1.0" encoding="UTF-8"?>')
L.append(f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" '
         f'width="{W}" height="{H}" viewBox="0 0 {W} {H}">')
L.append('<defs>')
L.append('  <style>text { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif; }</style>')

# Circular clip paths (defined at actual SVG coordinates, no transforms needed)
for i, c in enumerate(contacts):
    lcx = 100
    lcy = TOP + i * LRH + LRH // 2
    rcx = SX + 44
    rcy = SBY + i * RRH + RRH // 2
    L.append(f'  <clipPath id="cl{i}"><circle cx="{lcx}" cy="{lcy}" r="28"/></clipPath>')
    L.append(f'  <clipPath id="cr{i}"><circle cx="{rcx}" cy="{rcy}" r="24"/></clipPath>')

L.append('</defs>')

# ── Top bar ───────────────────────────────────────────────────────────────────
L.append(f'<rect x="0" y="0" width="{W}" height="{TOP}" fill="#ffffff"/>')
L.append(f'<line x1="0" y1="{TOP}" x2="{W}" y2="{TOP}" stroke="#e0e0e0" stroke-width="1"/>')
# LinkedIn "in" logo
L.append(f'<rect x="16" y="11" width="28" height="28" rx="4" fill="#0a66c2"/>')
L.append(f'<text x="30" y="30" font-size="18" font-weight="bold" fill="white" '
         f'text-anchor="middle" font-family="Georgia,serif">in</text>')
# Search bar
L.append(f'<rect x="52" y="10" width="250" height="30" rx="4" fill="#eef3f8" stroke="#c8d8e8" stroke-width="1"/>')
L.append(f'<text x="70" y="30" font-size="13" fill="#888888">Search</text>')

# ── Left panel background ─────────────────────────────────────────────────────
L.append(f'<rect x="0" y="{TOP}" width="{LW}" height="{H - TOP}" fill="#f3f2ef"/>')

# ── Left panel contact rows ───────────────────────────────────────────────────
for i, c in enumerate(contacts):
    ry  = TOP + i * LRH
    cx  = 100
    cy  = ry + LRH // 2
    tx  = 142

    # Row card + divider
    L.append(f'<rect x="0" y="{ry}" width="{LW}" height="{LRH}" fill="#ffffff"/>')
    L.append(f'<line x1="0" y1="{ry + LRH}" x2="{LW}" y2="{ry + LRH}" stroke="#e0e0e0" stroke-width="1"/>')

    # Checkbox
    L.append(f'<rect x="18" y="{cy - 9}" width="18" height="18" rx="2" '
             f'fill="none" stroke="#666666" stroke-width="1.5"/>')

    # Photo circle + clipped image
    L.append(f'<circle cx="{cx}" cy="{cy}" r="30" fill="#e0e0e0"/>')
    L.append(f'<image href="data:image/png;base64,{c["b64"]}" '
             f'x="{cx - 28}" y="{cy - 28}" width="56" height="56" clip-path="url(#cl{i})"/>')

    # Name
    L.append(f'<text x="{tx}" y="{ry + 32}" font-size="15" font-weight="600" '
             f'fill="#0a66c2">{x(c["name"])}</text>')
    # Title · Company
    L.append(f'<text x="{tx}" y="{ry + 52}" font-size="13" fill="#1d2226">'
             f'{x(c["title"])} \u00b7 {x(c["company"])}</text>')
    # City
    L.append(f'<text x="{tx}" y="{ry + 70}" font-size="12" fill="#666666">{x(c["city"])}</text>')

# ── Sidebar background + border ───────────────────────────────────────────────
L.append(f'<rect x="{SX}" y="{TOP}" width="{RW}" height="{H - TOP}" fill="#ffffff"/>')
L.append(f'<line x1="{SX}" y1="{TOP}" x2="{SX}" y2="{H}" stroke="#e0e0e0" stroke-width="1"/>')

# ── Sidebar header ────────────────────────────────────────────────────────────
L.append(f'<line x1="{SX}" y1="{TOP + SHH}" x2="{SX + RW}" y2="{TOP + SHH}" '
         f'stroke="#e0e0e0" stroke-width="1"/>')
# Hamburger icon
for dy in (0, 5, 10):
    L.append(f'<line x1="{SX+18}" y1="{TOP+18+dy}" x2="{SX+30}" y2="{TOP+18+dy}" '
             f'stroke="#0a66c2" stroke-width="2"/>')
# Title + external-link glyph
L.append(f'<text x="{SX+38}" y="{TOP+32}" font-size="15" font-weight="600" '
         f'fill="#0a66c2">Business Development</text>')
L.append(f'<text x="{SX+232}" y="{TOP+30}" font-size="13" fill="#0a66c2">&#x2197;</text>')
# Three-dot menu button (right of header)
mx, my = SX + RW - 25, TOP + 27
L.append(f'<circle cx="{mx}" cy="{my}" r="15" fill="none" stroke="#cccccc" stroke-width="1.5"/>')
for dx in (-5, 0, 5):
    L.append(f'<circle cx="{mx+dx}" cy="{my}" r="2" fill="#666666"/>')

# ── Sidebar nav bar ───────────────────────────────────────────────────────────
L.append(f'<line x1="{SX}" y1="{TOP+SHH+SNH}" x2="{SX+RW}" y2="{TOP+SHH+SNH}" '
         f'stroke="#e0e0e0" stroke-width="1"/>')
L.append(f'<text x="{SX+18}" y="{TOP+SHH+29}" font-size="13" fill="#666666">prev</text>')
# Virtual Assistant pill
px, py = SX + 88, TOP + SHH + 10
L.append(f'<rect x="{px}" y="{py}" width="184" height="26" rx="13" '
         f'fill="#ffffff" stroke="#0a66c2" stroke-width="1.5"/>')
# Person icon
L.append(f'<circle cx="{px+18}" cy="{py+10}" r="5" fill="#0a66c2"/>')
L.append(f'<path d="M{px+10},{py+26} Q{px+18},{py+20} {px+26},{py+26}" '
         f'fill="none" stroke="#0a66c2" stroke-width="1.5"/>')
L.append(f'<text x="{px+34}" y="{py+18}" font-size="11" font-weight="700" '
         f'fill="#0a66c2" letter-spacing="0.5">VIRTUAL ASSISTANT</text>')
L.append(f'<text x="{SX+RW-18}" y="{TOP+SHH+29}" font-size="13" fill="#666666" '
         f'text-anchor="end">next</text>')

# Scrollbar (decorative)
sbx = SX + RW - 8
sby = TOP + SHH + SNH
sbh = H - TOP - SHH - SNH - SFH
L.append(f'<rect x="{sbx}" y="{sby}" width="6" height="{sbh}" rx="3" fill="#f0f0f0"/>')
L.append(f'<rect x="{sbx}" y="{sby}" width="6" height="60" rx="3" fill="#b8b8b8"/>')

# ── Sidebar contact rows ──────────────────────────────────────────────────────
for i, c in enumerate(contacts):
    ry  = SBY + i * RRH
    cx  = SX + 44
    cy  = ry + RRH // 2
    tx  = SX + 78
    pbx = SX + RW - 30

    # Row + divider
    L.append(f'<rect x="{SX}" y="{ry}" width="{RW - 8}" height="{RRH}" fill="#ffffff"/>')
    L.append(f'<line x1="{SX+10}" y1="{ry+RRH}" x2="{SX+RW-20}" y2="{ry+RRH}" '
             f'stroke="#e8e8e8" stroke-width="1"/>')

    # Photo
    L.append(f'<circle cx="{cx}" cy="{cy}" r="26" fill="#e0e0e0"/>')
    L.append(f'<image href="data:image/png;base64,{c["b64"]}" '
             f'x="{cx-24}" y="{cy-24}" width="48" height="48" clip-path="url(#cr{i})"/>')

    # Name / Title / Company
    L.append(f'<text x="{tx}" y="{ry+24}" font-size="13" font-weight="600" '
             f'fill="#0a66c2">{x(c["name"])}</text>')
    L.append(f'<text x="{tx}" y="{ry+40}" font-size="12" fill="#444444">{x(c["title"])}</text>')
    L.append(f'<text x="{tx}" y="{ry+57}" font-size="12" fill="#057642" '
             f'text-decoration="underline">{x(c["company"])}</text>')

    # Plus button
    L.append(f'<circle cx="{pbx}" cy="{cy}" r="14" fill="none" '
             f'stroke="#0a66c2" stroke-width="1.5"/>')
    L.append(f'<line x1="{pbx}" y1="{cy-6}" x2="{pbx}" y2="{cy+6}" '
             f'stroke="#0a66c2" stroke-width="2"/>')
    L.append(f'<line x1="{pbx-6}" y1="{cy}" x2="{pbx+6}" y2="{cy}" '
             f'stroke="#0a66c2" stroke-width="2"/>')

# ── Sidebar footer ────────────────────────────────────────────────────────────
L.append(f'<line x1="{SX}" y1="{H-SFH}" x2="{SX+RW}" y2="{H-SFH}" '
         f'stroke="#e0e0e0" stroke-width="1"/>')
L.append(f'<text x="{SX + RW//2}" y="{H-10}" font-size="15" font-weight="600" '
         f'fill="#0ea5e9" text-anchor="middle">LeadLeaper</text>')

L.append('</svg>')

# ── Write output ──────────────────────────────────────────────────────────────
svg = "\n".join(L)
with open(OUT, "w", encoding="utf-8") as f:
    f.write(svg)

sz = os.path.getsize(OUT)
print(f"\nSVG written: {OUT}")
print(f"Size: {sz:,} bytes  ({sz / 1024:.1f} KB)")
