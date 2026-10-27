// 핀치 손 그림: 메뉴 커서(SVG)와 온보딩 NEXT 원(캔버스)이 같은 모양을 씀
// 좌표는 가운데가 (0, 0)인 64×64 칸 기준. k = 0 벌림 → 1 엄지·검지 끝이 맞닿음
const INK = "#2a1a33", SKIN = "#fff6fb", OK = "#7ee8b0";
const lerp = (a, b, k) => +(a + (b - a) * k).toFixed(2);

// 손을 이루는 조각들 (그리는 순서대로) — 🤏처럼 왼쪽을 향한 옆모습: 위가 검지, 아래가 엄지
function parts(k) {
  const L = (a, b) => lerp(a, b, k);
  return [
    { type: "fill", d: "M-6 -9 Q4 -12 12 -6 L25 9 Q28 15 22 19 L14 23 Q6 25 1 18 L-6 6 Q-9 -3 -6 -9 Z" },   // 손등 → 손목 (오른쪽 아래)
    ...[[2, 13], [7, 17.5], [12.5, 21]].map(([x, y]) => ({ type: "finger", w: 5, d: `M${x + 4} ${y - 2} L${x - 1} ${y}` })),   // 말아 쥔 세 손가락
    { type: "finger", d: `M-1 5 C-8 7 ${L(-15, -14)} ${L(8, 2)} ${L(-23, -21)} ${L(6, 0.5)}` },          // 엄지
    { type: "finger", d: `M-2 -7 C-9 -9 ${L(-15, -14)} ${L(-11, -6)} ${L(-24, -22)} ${L(-9, -1.5)}` },   // 검지
  ];
}
const TOUCH = [-22.5, -0.5], SQUEEZE = "M-31 -12 l3 3 M-31 9 l3 -3";

// SVG 조각 문자열 (커서용)
export function pinchSVG(k) {
  const svg = parts(k).map(p => p.type === "finger"
    ? `<path d="${p.d}" fill="none" stroke="${INK}" stroke-width="${(p.w || 7) + 3.5}" stroke-linecap="round"/><path d="${p.d}" fill="none" stroke="${SKIN}" stroke-width="${p.w || 7}" stroke-linecap="round"/>`
    : `<path d="${p.d}" fill="${SKIN}" stroke="${INK}" stroke-width="${p.w || 3}" stroke-linejoin="round"/>`).join("");
  return svg + (k > 0.9
    ? `<circle cx="${TOUCH[0]}" cy="${TOUCH[1]}" r="3.4" fill="${OK}"/>`                                   // 맞닿은 곳
    : `<path d="${SQUEEZE}" stroke="${OK}" stroke-width="2.5" stroke-linecap="round" opacity="${1 - k}"/>`);   // "모으세요" 표시
}

// 캔버스에 그리기 (온보딩 NEXT 원용). s = 크기 배율
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
