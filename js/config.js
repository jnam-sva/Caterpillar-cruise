// Caterpillar Cruise — 게임 밸런스 숫자 모음
// 속도·크기·MP·스테이지 난이도를 바꿀 땐 이 파일만 고치면 됨.
// (감도 설정으로 바뀌는 MAX_TURN · TURN_EASE · WHEEL_MAX는 값이 바뀌어서 index.html에 그대로 둠)

// ---------- 화면 · 세계 ----------
export const VIEW = 680;             // 화면의 짧은 변 = 680 논리 단위 (실제 픽셀은 화면 해상도에 맞춰 확대)
export const WORLD = 8000;           // 달리는 세계 크기 (가장자리는 반대편과 이어짐) – 스테이지를 길게 하려고 넓힘
export const DENSITY = (WORLD / 2400) ** 2;   // 세계가 넓어진 만큼 풍경·먹이·콘 개수도 늘려 밀도 유지
export const CELL = 400, GRID_N = WORLD / CELL;                       // 소품 찾기용 격자 칸 크기

// ---------- 설정 기본값 ----------
export const DEFAULTS = { volume: 0.6, bpmSpeed: true, fx: 1, sens: 5, speed: 1, obstacles: 1, syncMs: null };   // syncMs: null = 자동(장치 지연값)

// ---------- 애벌레 ----------
export const BODY_W = 16;            // 뱀 몸 두께(px)
export const HEAD_R = BODY_W / 2;
export const START_LEN = 110;        // 애벌레 시작 몸 길이(px)
export const GROW = 22;              // 먹이 1점당 늘어나는 길이(px)
export const SEG = 11;               // 몸 마디 간격(px)

// ---------- 속도 ----------
export const START_SPEED = 110;      // px/s (음악 없을 때 시작 속도)
export const MAX_SPEED = 190;
export const SPEED_STEP = 2;         // 열매 하나당 속도 증가 (음악이 없을 때만)
// 음악 모드 속도: 느린 곡과 빠른 곡 차이가 확실히 느껴지도록 BPM 차이를 1.6배로 키움
// 속도(px/s) = 80 + (BPM − 60) × 1.6 → 72 BPM ≈ 99 · 90 ≈ 128 · 124 ≈ 182 · 145 ≈ 216 · 174 ≈ 262
export const SPEED_BASE = 80, SPEED_PER_BPM = 1.6;
export const MUSIC_MIN_SPEED = 80, MUSIC_MAX_SPEED = 280;

// ---------- 스테이지 난이도 ----------
// 스테이지 난이도 곡선: 1~3은 연습 구간(느린 비트·느린 애벌레·가까운 텐트), 4부터 본격적으로 빨라짐
//   스테이지    1     2     3    | 4     5     6 …
//   비트 배율  0.85  0.90  0.95  | 1.00  1.08  1.16 … (+8%씩)
//   속도 배율  0.70  0.78  0.86  | 1.00  1.12  1.24 … (+12%씩, 비트 상승과 곱해짐)
//   주행 시간  12s   14s   16s   | 20s   22.5s 25s … (텐트까지 거리 = 속도 × 이 시간)
export const tempoFor = n => n <= 3 ? 0.8 + n * 0.05 : 1 + (n - 4) * 0.08;
export const stageSpeedMul = n => n <= 3 ? 0.62 + n * 0.08 : 1 + (n - 4) * 0.12;
export const driveSecs = n => n <= 3 ? 10 + n * 2 : 20 + (n - 4) * 2.5;
export const CONES_STEP = 10;        // 스테이지마다 콘 +10개
export const TENT_R = 58;            // 텐트 크기 (멀리서도 잘 보이게 크게)

// ---------- MP · 충돌 ----------
// MP: 장애물에 부딪히면 줄어들고, 0이 되면 게임 오버
export const MP_MAX = 100, HIT_DAMAGE = 25, JELLY_HEAL = 10, CLEAR_HEAL = 30;
// 부딪히는 풍경 (종류: 충돌 반지름 비율)
export const SOLID = { tree: 0.75, cactus: 0.85, rock: 0.8, block: 0.62 };

// ---------- 아이템 ----------
export const FRUIT_R = 23;           // 먹는 아이템 크기 (크게, 눈에 잘 띄게)
export const FRUIT_COUNT = Math.round(24 * DENSITY);  // 세계에 동시에 놓이는 먹이 수 (한 화면에 보통 2~3개 보이게)
// 아이템 종류: 운동화(스피드업) 6% · 황금 별 9% · 나머지는 과일·젤리빈
export const SHOE_CHANCE = 0.06, GOLD_CHANCE = 0.09;
// 운동화: 먹으면 5초 동안 1.5배 빨라짐
export const BOOST_TIME = 5, BOOST_MUL = 1.5;
export const FRUIT_TYPES = ["cherry", "lemon", "grape", "orange", "berry", "jelly", "jelly", "jelly"];
export const JELLY_COLORS = ["#ff5fa2", "#7ee081", "#ffb347", "#8f7bff", "#4fd2ff", "#ff6b6b"];

// ---------- 조작 ----------
export const WHEEL_DEAD = 0.035;     // ±2° 안쪽은 직진 (손 떨림 무시)
export const GRACE_MS = 350;         // 손이 잠깐 안 잡혀도 이 시간 동안은 마지막 핸들 값 유지
export const KEY_SIDE = { ArrowLeft: "left", a: "left", ArrowRight: "right", d: "right" };
export const PAUSE_HOLD = 0.6;       // 두 팔을 양옆으로 벌린 자세를 이만큼(초) 유지하면 일시정지
export const PALM_SCREENS =["theme", "over", "clear", "mission", "pause"];   // 손바닥 커서를 쓰는 화면
// "NEXT" 원 잡기 위치 (카메라 원본 좌표, 화면에서는 좌우 반전되어 오른쪽 위)
export const GRAB = { x: 0.22, y: 0.22, r: 0.085, hold: 1.0 };   // 화면 기준 오른쪽 위
