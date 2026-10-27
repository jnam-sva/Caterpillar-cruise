// 손 인식 (MediaPipe Hand Landmarker): 메뉴에서 핀치로 선택
// 포즈 모델은 팔(핸들)을, 이 모델은 손가락을 봄. 좌표는 둘 다 카메라 원본 기준 0~1 (거울 반전 전).
import { HandLandmarker } from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14";

// 손 랜드마크: 0 손목, 4 엄지 끝, 8 검지 끝, 5·9·13·17 손가락 뿌리(MCP)
const MCPS = [5, 9, 13, 17];
const PINCH_ON = 0.32, PINCH_OFF = 0.5;   // 엄지-검지 거리 ÷ 손 크기: 이보다 작으면 집음, 커지면 놓음 (사이 구간은 이전 상태 유지 → 떨림 방지)

let landmarker = null, lastTs = 0;
let pinched = false;                       // 핀치 상태 (커서 손 하나 기준)
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

// 손바닥 가운데 = 손목 + 네 손가락 뿌리의 평균 (핀치할 때 손가락이 움직여도 커서가 덜 흔들림)
function palmCenter(lm) {
  const pts = [lm[0], ...MCPS.map(i => lm[i])];
  return { x: pts.reduce((s, p) => s + p.x, 0) / pts.length, y: pts.reduce((s, p) => s + p.y, 0) / pts.length };
}

// 한 프레임 분석. 커서는 화면에서 가장 위에 있는 손을 따라감
export function readHands(video, now) {
  if (!landmarker || now <= lastTs) return hands;
  lastTs = now;
  const res = landmarker.detectForVideo(video, now);
  hands.list = res.landmarks.map(lm => {
    const size = Math.max(1e-3, dist(lm[0], lm[9]));          // 손 크기: 손목 → 가운데 손가락 뿌리
    const gap = dist(lm[4], lm[8]) / size;                     // 엄지 끝 ↔ 검지 끝
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
// 핀치가 얼마나 닫혔는지 0~1 (커서 링 채우기용)
export function pinchAmount() {
  const h = cursorHand();
  return h ? Math.min(1, Math.max(0, (PINCH_OFF + 0.25 - h.gap) / (PINCH_OFF + 0.25 - PINCH_ON))) : 0;
}
