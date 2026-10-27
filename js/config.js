// Caterpillar Cruise — game balance numbers
// To change speed, size, MP or stage difficulty, edit only this file.
// (MAX_TURN · TURN_EASE · WHEEL_MAX change with the sensitivity setting, so they stay in index.html)

// ---------- Screen · world ----------
export const VIEW = 680;             // Short side of the screen = 680 logical units (real pixels scale with the screen resolution)
export const WORLD = 8000;           // Size of the world you drive in (edges wrap to the other side) – made wide for longer stages
export const DENSITY = (WORLD / 2400) ** 2;   // Keep the density of scenery, food and cones as the world gets bigger
export const CELL = 400, GRID_N = WORLD / CELL;                       // Grid cell size for finding props

// ---------- Default settings ----------
export const DEFAULTS = { volume: 0.6, bpmSpeed: true, fx: 1, sens: 5, speed: 1, obstacles: 1, syncMs: null };   // syncMs: null = auto (device latency)

// ---------- Caterpillar ----------
export const BODY_W = 16;            // Body thickness (px)
export const HEAD_R = BODY_W / 2;
export const START_LEN = 110;        // Starting body length (px)
export const GROW = 22;              // Length gained per point of food (px)
export const SEG = 11;               // Spacing between body segments (px)

// ---------- Speed ----------
export const START_SPEED = 110;      // px/s (starting speed without music)
export const MAX_SPEED = 190;
export const SPEED_STEP = 2;         // Speed gained per fruit (only without music)
// Music mode speed: the BPM difference is scaled by 1.6 so slow and fast songs clearly feel different
// Speed (px/s) = 80 + (BPM − 60) × 1.6 → 72 BPM ≈ 99 · 90 ≈ 128 · 124 ≈ 182 · 145 ≈ 216 · 174 ≈ 262
export const SPEED_BASE = 80, SPEED_PER_BPM = 1.6;
export const MUSIC_MIN_SPEED = 80, MUSIC_MAX_SPEED = 280;

// ---------- Stage difficulty ----------
// Stage difficulty curve: 1–3 are practice (slower beat, slower caterpillar, closer tent), from 4 it really speeds up
//   Stage       1     2     3    | 4     5     6 …
//   Beat ×    0.85  0.90  0.95  | 1.00  1.08  1.16 … (+8% each)
//   Speed ×   0.70  0.78  0.86  | 1.00  1.12  1.24 … (+12% each, multiplied with the beat increase)
//   Drive time 12s   14s   16s   | 20s   22.5s 25s … (distance to the tent = speed × this time)
export const tempoFor = n => n <= 3 ? 0.8 + n * 0.05 : 1 + (n - 4) * 0.08;
export const stageSpeedMul = n => n <= 3 ? 0.62 + n * 0.08 : 1 + (n - 4) * 0.12;
export const driveSecs = n => n <= 3 ? 10 + n * 2 : 20 + (n - 4) * 2.5;
export const CONES_STEP = 10;        // +10 cones per stage
export const TENT_R = 58;            // Tent size (big so it is easy to see from far away)

// ---------- MP · collisions ----------
// MP: goes down when you hit an obstacle, game over at 0
export const MP_MAX = 100, HIT_DAMAGE = 25, JELLY_HEAL = 10, CLEAR_HEAL = 30;
// Scenery you can crash into (type: collision radius ratio)
export const SOLID = { tree: 0.75, cactus: 0.85, rock: 0.8, block: 0.62 };

// ---------- Items ----------
export const FRUIT_R = 23;           // Size of food items (big and easy to spot)
export const FRUIT_COUNT = Math.round(24 * DENSITY);  // Food items in the world at once (usually 2–3 visible on screen)
// Item types: sneaker (speed up) 6% · gold star 9% · the rest are fruit and jelly beans
export const SHOE_CHANCE = 0.06, GOLD_CHANCE = 0.09;
// Sneaker: 1.5× faster for 5 seconds after eating it
export const BOOST_TIME = 5, BOOST_MUL = 1.5;
export const FRUIT_TYPES = ["cherry", "lemon", "grape", "orange", "berry", "jelly", "jelly", "jelly"];
export const JELLY_COLORS = ["#ff5fa2", "#7ee081", "#ffb347", "#8f7bff", "#4fd2ff", "#ff6b6b"];

// ---------- Controls ----------
export const WHEEL_DEAD = 0.035;     // Within ±2° counts as straight (ignores hand jitter)
export const GRACE_MS = 350;         // If the hands are lost for a moment, keep the last wheel value for this long
export const KEY_SIDE = { ArrowLeft: "left", a: "left", ArrowRight: "right", d: "right" };
export const PAUSE_HOLD = 0.6;       // Hold the arms-out-wide pose this long (seconds) to pause
export const PALM_SCREENS =["theme", "over", "clear", "mission", "pause"];   // Screens that use the palm cursor
// Where to grab the "NEXT" circle (raw camera coordinates; mirrored on screen, so it shows top right)
export const GRAB = { x: 0.22, y: 0.22, r: 0.085, hold: 1.0 };   // Top right on screen
