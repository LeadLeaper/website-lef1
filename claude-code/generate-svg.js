#!/usr/bin/env node
/**
 * Generates linkedin-email-finder-from-search-results.svg with fake contacts.
 */

const fs   = require("fs");
const path = require("path");

const BASE = path.resolve(__dirname);
const B64D = path.join(BASE, "contacts-base64");
const OUT  = path.join(BASE, "linkedin-email-finder-from-search-results.svg");

const contacts = [
  { name: "Sarah Clark",       title: "Chief Product Officer",   company: "RPA Robotics", city: "Seattle, Washington",       img: "sarah-clark"       },
  { name: "James Walton",      title: "VP, Operations",          company: "Staples",      city: "Chicago, Illinois",         img: "james-walton"      },
  { name: "Maria Bonya",       title: "Sales Manager",           company: "Skechers",     city: "Los Angeles, California",   img: "maria-bonya"       },
  { name: "Tony Carlson",      title: "SVP, Technology",         company: "Trellix",      city: "Austin, Texas",             img: "tony-carlson"      },
  { name: "Simona Wilson",     title: "Director, Marketing",     company: "Lyft",         city: "New York, New York",        img: "simona-wilson"     },
  { name: "Kathryn Chen",      title: "Chief Financial Officer", company: "RPA Robotics", city: "San Francisco, California", img: "kathryn-chen"      },
  { name: "Jonathan Richards", title: "Vice President, Sales",   company: "Dropbox",      city: "Boston, Massachusetts",     img: "jonathan-richards" },
  { name: "Cara Johnson",      title: "Product Manager",         company: "Stripe",       city: "Denver, Colorado",          img: "cara-johnson"      },
  { name: "Jason Dao",         title: "Chief Scientist",         company: "Cisco",        city: "Atlanta, Georgia",          img: "jason-dao"         },
  { name: "Ravi Rasheed",      title: "CTO",                     company: "Talkdesk",     city: "Miami, Florida",            img: "ravi-rasheed"      },
];

// Load base64 photo data
contacts.forEach(c => {
  const p = path.join(B64D, `${c.img}.txt`);
  c.b64 = fs.readFileSync(p, "utf8").trim();
  console.log(`  Loaded ${c.img}.txt  (${Math.round(c.b64.length / 1024)} KB)`);
});

// XML escape
const x = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// ── Layout constants ──────────────────────────────────────────────────────────
const W   = 1128;   // total SVG width (extra 8px for right-shadow bleed)
const TOP = 0;      // top bar removed
const LW  = 820;    // left (LinkedIn) panel width
const RW  = 450;    // right sidebar width
const LRH = 110;    // left row height
const RRH = 78;     // sidebar row height
const SHH = 55;     // sidebar header height
const SNH = 45;     // sidebar nav height
const SFH = 35;     // sidebar footer height
const SX  = LW - 150; // sidebar x-origin (popover overlaps left panel by 150px)
const SBY = TOP + SHH + SNH;               // sidebar contacts start y  (= 100)
const H   = TOP + contacts.length * LRH;   // total SVG height          (= 1100)
const POPOVER_H = SHH + SNH + Math.floor(6.5 * RRH) + SFH; // popover height (= 642)

const L = [];  // SVG lines accumulator

// ── Header ────────────────────────────────────────────────────────────────────
L.push(`<?xml version="1.0" encoding="UTF-8"?>`);
L.push(`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`);
L.push(`<defs>`);
L.push(`  <style>text { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif; }</style>`);

// Circular clip paths (in absolute SVG coordinates — no transforms needed)
contacts.forEach((c, i) => {
  const lcx = 100,          lcy = TOP + i * LRH + Math.floor(LRH / 2);
  const rcx = SX + 44,      rcy = SBY + i * RRH + Math.floor(RRH / 2);
  L.push(`  <clipPath id="cl${i}"><circle cx="${lcx}" cy="${lcy}" r="28"/></clipPath>`);
  L.push(`  <clipPath id="cr${i}"><circle cx="${rcx}" cy="${rcy}" r="24"/></clipPath>`);
});

L.push(`  <filter id="popoverShadow" x="-10%" y="-4%" width="125%" height="115%">`);
L.push(`    <feGaussianBlur in="SourceAlpha" stdDeviation="5" result="blur"/>`);
L.push(`    <feOffset in="blur" dx="-3" dy="3" result="lOff"/>`);
L.push(`    <feFlood flood-color="rgba(0,0,0,0.15)" result="clr"/>`);
L.push(`    <feComposite in="clr" in2="lOff" operator="in" result="s1"/>`);
L.push(`    <feOffset in="blur" dx="4" dy="1" result="rOff"/>`);
L.push(`    <feComposite in="clr" in2="rOff" operator="in" result="s2"/>`);
L.push(`    <feMerge><feMergeNode in="s1"/><feMergeNode in="s2"/><feMergeNode in="SourceGraphic"/></feMerge>`);
L.push(`  </filter>`);
L.push(`  <clipPath id="sidebarClip"><rect x="${SX}" y="${TOP}" width="${RW}" height="${POPOVER_H}"/></clipPath>`);
L.push(`</defs>`);

// ── Left panel background ─────────────────────────────────────────────────────
L.push(`<rect x="0" y="${TOP}" width="${LW}" height="${H - TOP}" fill="#f3f2ef"/>`);

// ── Left panel contact rows ───────────────────────────────────────────────────
contacts.forEach((c, i) => {
  const ry = TOP + i * LRH;
  const cx = 100,  cy = ry + Math.floor(LRH / 2);
  const tx = 142;

  L.push(`<!-- Left row ${i+1}: ${c.name} -->`);
  L.push(`<rect x="0" y="${ry}" width="${LW}" height="${LRH}" fill="#ffffff"/>`);
  L.push(`<line x1="0" y1="${ry + LRH}" x2="${LW}" y2="${ry + LRH}" stroke="#e0e0e0" stroke-width="1"/>`);
  // Checkbox
  L.push(`<rect x="18" y="${cy - 9}" width="18" height="18" rx="2" fill="none" stroke="#666666" stroke-width="1.5"/>`);
  // Photo
  L.push(`<circle cx="${cx}" cy="${cy}" r="30" fill="#e0e0e0"/>`);
  L.push(`<image href="data:image/png;base64,${c.b64}" x="${cx-28}" y="${cy-28}" width="56" height="56" clip-path="url(#cl${i})"/>`);
  // Text
  L.push(`<text x="${tx}" y="${ry+42}" font-size="15" font-weight="600" fill="#0a66c2">${x(c.name)}</text>`);
  L.push(`<text x="${tx}" y="${ry+62}" font-size="13" fill="#1d2226">${x(c.title)} \u00b7 ${x(c.company)}</text>`);
  L.push(`<text x="${tx}" y="${ry+80}" font-size="12" fill="#666666">${x(c.city)}</text>`);
});

// ── Sidebar popover ───────────────────────────────────────────────────────────
L.push(`<rect x="${SX}" y="${TOP}" width="${RW}" height="${POPOVER_H}" rx="2" fill="#ffffff" filter="url(#popoverShadow)"/>`);
L.push(`<g clip-path="url(#sidebarClip)">`);
L.push(`<rect x="${SX}" y="${TOP}" width="${RW}" height="${POPOVER_H}" fill="#ffffff"/>`);
L.push(`<line x1="${SX}" y1="${TOP}" x2="${SX}" y2="${TOP+POPOVER_H}" stroke="#e0e0e0" stroke-width="1"/>`);

// ── Sidebar header ────────────────────────────────────────────────────────────
L.push(`<line x1="${SX}" y1="${TOP+SHH}" x2="${SX+RW}" y2="${TOP+SHH}" stroke="#e0e0e0" stroke-width="1"/>`);
// Hamburger icon — enlarged, gray, centered with heading text (visual center ~y=26)
[0, 6, 12].forEach(dy =>
  L.push(`<line x1="${SX+14}" y1="${TOP+20+dy}" x2="${SX+34}" y2="${TOP+20+dy}" stroke="#666666" stroke-width="2.5"/>`)
);
// Title
L.push(`<text x="${SX+44}" y="${TOP+32}" font-size="15" font-weight="600" fill="#0a66c2">Business Development</text>`);
// Three-dot menu
const mx = SX + RW - 25, my = TOP + 27;
L.push(`<circle cx="${mx}" cy="${my}" r="15" fill="none" stroke="#cccccc" stroke-width="1.5"/>`);
[-5, 0, 5].forEach(dx =>
  L.push(`<circle cx="${mx+dx}" cy="${my}" r="2" fill="#666666"/>`)
);

// ── Sidebar nav bar ───────────────────────────────────────────────────────────
// Pill constants declared here so prev/next can reference them
const btnW = 184, btnH = 26;
const px = SX + Math.floor((RW - btnW) / 2);
const py = TOP + SHH + Math.floor((SNH - btnH) / 2);
const navTextY = py + Math.floor(btnH / 2) + 5;  // text baseline aligned with pill center

L.push(`<line x1="${SX}" y1="${TOP+SHH+SNH}" x2="${SX+RW}" y2="${TOP+SHH+SNH}" stroke="#e0e0e0" stroke-width="1"/>`);
L.push(`<text x="${SX+33}" y="${navTextY}" font-size="13" fill="#666666">prev</text>`);
L.push(`<rect x="${px}" y="${py}" width="${btnW}" height="${btnH}" rx="13" fill="#ffffff" stroke="#0a66c2" stroke-width="1.5"/>`);
// Person icon — small (r=3), icon+text block centered inside pill
// left margin ≈20px: icon 12px wide, 6px gap, then text
L.push(`<circle cx="${px+26}" cy="${py+9}" r="3" fill="#0a66c2"/>`);
L.push(`<path d="M${px+20},${py+20} Q${px+20},${py+14} ${px+26},${py+14} Q${px+32},${py+14} ${px+32},${py+20} Z" fill="#0a66c2"/>`);
L.push(`<text x="${px+38}" y="${py+17}" font-size="11" font-weight="700" fill="#0a66c2" letter-spacing="0.5">VIRTUAL ASSISTANT</text>`);
L.push(`<text x="${SX+RW-30}" y="${navTextY}" font-size="13" fill="#0a66c2" text-anchor="end">next</text>`);

// Scrollbar (decorative)
const sbx = SX + RW - 8;
const sby = TOP + SHH + SNH;
const sbh = POPOVER_H - SHH - SNH - SFH;  // height of visible contacts area
L.push(`<rect x="${sbx}" y="${sby}" width="6" height="${sbh}" rx="3" fill="#f0f0f0"/>`);
L.push(`<rect x="${sbx}" y="${sby}" width="6" height="60" rx="3" fill="#b8b8b8"/>`);

// ── Sidebar contact rows ──────────────────────────────────────────────────────
contacts.forEach((c, i) => {
  const ry  = SBY + i * RRH;
  const cx  = SX + 44,  cy = ry + Math.floor(RRH / 2);
  const tx  = SX + 78;
  const pbx = SX + RW - 42;  // symmetric indent: photo left-edge is ~20px from sidebar left

  L.push(`<!-- Sidebar row ${i+1}: ${c.name} -->`);
  L.push(`<rect x="${SX}" y="${ry}" width="${RW-8}" height="${RRH}" fill="#ffffff"/>`);
  L.push(`<line x1="${SX+10}" y1="${ry+RRH}" x2="${SX+RW-20}" y2="${ry+RRH}" stroke="#e8e8e8" stroke-width="1"/>`);
  // Photo
  L.push(`<circle cx="${cx}" cy="${cy}" r="26" fill="#e0e0e0"/>`);
  L.push(`<image href="data:image/png;base64,${c.b64}" x="${cx-24}" y="${cy-24}" width="48" height="48" clip-path="url(#cr${i})"/>`);
  // Text
  L.push(`<text x="${tx}" y="${ry+24}" font-size="13" font-weight="600" fill="#0a66c2">${x(c.name)}</text>`);
  L.push(`<text x="${tx}" y="${ry+40}" font-size="12" fill="#444444">${x(c.title)}</text>`);
  L.push(`<text x="${tx}" y="${ry+57}" font-size="12" fill="#057642">${x(c.company)}</text>`);
  // Plus button
  L.push(`<circle cx="${pbx}" cy="${cy}" r="14" fill="none" stroke="#0a66c2" stroke-width="1.5"/>`);
  L.push(`<line x1="${pbx}" y1="${cy-6}" x2="${pbx}" y2="${cy+6}" stroke="#0a66c2" stroke-width="2"/>`);
  L.push(`<line x1="${pbx-6}" y1="${cy}" x2="${pbx+6}" y2="${cy}" stroke="#0a66c2" stroke-width="2"/>`);
});

// ── Sidebar footer ────────────────────────────────────────────────────────────
const fy = TOP + POPOVER_H;
L.push(`<rect x="${SX}" y="${fy-SFH}" width="${RW}" height="${SFH}" fill="#ffffff"/>`);
L.push(`<line x1="${SX}" y1="${fy-SFH}" x2="${SX+RW}" y2="${fy-SFH}" stroke="#e0e0e0" stroke-width="1"/>`);
L.push(`<text x="${SX + Math.floor(RW/2)}" y="${fy-10}" font-size="15" font-weight="600" text-anchor="middle"><tspan fill="#22c55e">Lead</tspan><tspan fill="#0a66c2">Leaper</tspan></text>`);

L.push(`</g>`);
// Right border of popover (drawn outside clip group so it isn't clipped away)
L.push(`<line x1="${SX+RW}" y1="${TOP}" x2="${SX+RW}" y2="${TOP+POPOVER_H}" stroke="#d0d0d0" stroke-width="1"/>`);
L.push(`</svg>`);

// ── Write file ────────────────────────────────────────────────────────────────
const svg = L.join("\n");
fs.writeFileSync(OUT, svg, "utf8");
const sz = fs.statSync(OUT).size;
console.log(`\nSVG written: ${OUT}`);
console.log(`Size: ${sz.toLocaleString()} bytes  (${(sz/1024).toFixed(1)} KB)`);
