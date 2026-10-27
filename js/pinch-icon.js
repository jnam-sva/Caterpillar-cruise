// Pinch hand drawing: the menu cursor (SVG) and the onboarding NEXT circle (canvas) share the same shape
// Coordinates use a 64×64 box centered on (0, 0). k = 0 open → 1 thumb and index tips touch
const INK = "#2a1a33", SKIN = "#fff6fb", OK = "#7ee8b0";
const lerp = (a, b, k) => +(a + (b - a) * k).toFixed(2);

// Parts of the hand (in drawing order) — side view facing left like 🤏: index finger on top, thumb below
function parts(k) {
  const L = (a, b) => lerp(a, b, k);
  return [
    { type: "fill", d: "M-6 -9 Q4 -12 12 -6 L25 9 Q28 15 22 19 L14 23 Q6 25 1 18 L-6 6 Q-9 -3 -6 -9 Z" },   // Back of the hand → wrist (bottom right)
    ...[[2, 13], [7, 17.5], [12.5, 21]].map(([x, y]) => ({ type: "finger", w: 5, d: `M${x + 4} ${y - 2} L${x - 1} ${y}` })),   // Three curled fingers
    { type: "finger", d: `M-1 5 C-8 7 ${L(-15, -14)} ${L(8, 2)} ${L(-23, -21)} ${L(6, 0.5)}` },          // Thumb
    { type: "finger", d: `M-2 -7 C-9 -9 ${L(-15, -14)} ${L(-11, -6)} ${L(-24, -22)} ${L(-9, -1.5)}` },   // Index finger
  ];
}
const TOUCH = [-22.5, -0.5], SQUEEZE = "M-31 -12 l3 3 M-31 9 l3 -3";

// SVG markup (for the cursor)
export function pinchSVG(k) {
  const svg = parts(k).map(p => p.type === "finger"
    ? `<path d="${p.d}" fill="none" stroke="${INK}" stroke-width="${(p.w || 7) + 3.5}" stroke-linecap="round"/><path d="${p.d}" fill="none" stroke="${SKIN}" stroke-width="${p.w || 7}" stroke-linecap="round"/>`
    : `<path d="${p.d}" fill="${SKIN}" stroke="${INK}" stroke-width="${p.w || 3}" stroke-linejoin="round"/>`).join("");
  return svg + (k > 0.9
    ? `<circle cx="${TOUCH[0]}" cy="${TOUCH[1]}" r="3.4" fill="${OK}"/>`                                   // Where the tips touch
    : `<path d="${SQUEEZE}" stroke="${OK}" stroke-width="2.5" stroke-linecap="round" opacity="${1 - k}"/>`);   // "Squeeze" marks
}

// Draw on a canvas (for the onboarding NEXT circle). s = scale
export function drawPinchHand(c, k, s) {
  c.save(); c.scale(s, s); c.lineCap = "round"; c.lineJoin = "round";
  for (const p of parts(k)) {
    const path = new Path2D(p.d);
    if (p.type === "finger") {
      c.strokeStyle = INK; c.lineWidth = (p.w || 7) + 3.5; c.stroke(path);
      c.strokeStyle = SKIN; c.lineWidth = p.w || 7; c.stroke(path);
    } else {
      c.fillStyle = SKIN; c.fill(path);
      c.strokeStyle = INK; c.lineWidth = p.w || 3; c.stroke(path);
    }
  }
  c.shadowBlur = 0;
  if (k > 0.9) { c.fillStyle = OK; c.beginPath(); c.arc(TOUCH[0], TOUCH[1], 3.4, 0, Math.PI * 2); c.fill(); }
  else {
    c.globalAlpha = 1 - k; c.strokeStyle = OK; c.lineWidth = 2.5;
    c.stroke(new Path2D(SQUEEZE));
  }
  c.restore();
}
