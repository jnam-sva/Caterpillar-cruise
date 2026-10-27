// Hand tracking (MediaPipe Hand Landmarker): pinch to select in menus
// The pose model watches the arms (wheel); this model watches the fingers. Both use raw camera coordinates 0–1 (before mirroring).
import { HandLandmarker } from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14";

// Hand landmarks: 0 wrist, 4 thumb tip, 8 index tip, 5·9·13·17 finger bases (MCP)
const MCPS = [5, 9, 13, 17];
const PINCH_ON = 0.32, PINCH_OFF = 0.5;   // Thumb–index distance ÷ hand size: below ON = pinched, above OFF = released (in between keeps the last state → no flicker)

let landmarker = null, lastTs = 0;
let pinched = false;                       // Pinch state (for the cursor hand only)
export const hands = { list: [], at: 0, ready: false };

export async function initHands(vision) {
  landmarker = await HandLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
      delegate: "GPU",
    },
    runningMode: "VIDEO",
    numHands: 2,
    minHandDetectionConfidence: 0.5,
    minHandPresenceConfidence: 0.5,
    minTrackingConfidence: 0.5,
  });
  hands.ready = true;
}

const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

// Palm center = average of the wrist and the four finger bases (the cursor shakes less while the fingers pinch)
function palmCenter(lm) {
  const pts = [lm[0], ...MCPS.map(i => lm[i])];
  return { x: pts.reduce((s, p) => s + p.x, 0) / pts.length, y: pts.reduce((s, p) => s + p.y, 0) / pts.length };
}

// Analyze one frame. The cursor follows the highest hand on screen
export function readHands(video, now) {
  if (!landmarker || now <= lastTs) return hands;
  lastTs = now;
  const res = landmarker.detectForVideo(video, now);
  hands.list = res.landmarks.map(lm => {
    const size = Math.max(1e-3, dist(lm[0], lm[9]));          // Hand size: wrist → middle finger base
    const gap = dist(lm[4], lm[8]) / size;                     // Thumb tip ↔ index tip
    return { lm, palm: palmCenter(lm), gap };
  });
  if (hands.list.length) hands.at = now;
  const lead = cursorHand();
  if (!lead) pinched = false;
  else if (!pinched && lead.gap < PINCH_ON) pinched = true;
  else if (pinched && lead.gap > PINCH_OFF) pinched = false;
  return hands;
}

export function cursorHand() {
  return hands.list.slice().sort((a, b) => a.palm.y - b.palm.y)[0] || null;
}
export const isPinched = () => pinched;
// How closed the pinch is, 0–1 (for filling the cursor ring)
export function pinchAmount() {
  const h = cursorHand();
  return h ? Math.min(1, Math.max(0, (PINCH_OFF + 0.25 - h.gap) / (PINCH_OFF + 0.25 - PINCH_ON))) : 0;
}
