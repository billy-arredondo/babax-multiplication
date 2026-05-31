const SIZE      = 32;
const CX        = SIZE / 2;       // 16
const CY        = SIZE / 2;       // 16
const POINTS    = 5;
const INNER_RATIO = 0.42;         // inner/outer radius for a classic 5-point star

// Size bounds: percentage of half-canvas (16 px)
const R_IDLE     = 14.4; // 90 % → outer radius 14.4 px (static state)
const R_ANIM_MIN = 8;    // 50 % → outer radius 8 px   (animation valley)
const R_PEAK     = 14.4; // 90 % → outer radius 14.4 px (animation peak)

const YELLOW     = '#FFD600';
const ORANGE_RED = '#FF4500';

// Animation config
const CYCLES     = 3;
const CYCLE_MS   = 900;          // ms per full rotation + pulse
const INTERVAL_MS = 15_000;      // ms between animation bursts

// Module-level handles so we can cancel in-flight animation on cleanup
let rafId: number | null = null;
let intervalId: ReturnType<typeof setInterval> | null = null;

// ─── Core drawing ─────────────────────────────────────────────────────────────

function applyToLink(dataUrl: string): void {
  let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
  }
  link.type = 'image/png';
  link.href = dataUrl;
}

function drawStar(rotation: number, outerR: number, fill: string): void {
  const canvas = document.createElement('canvas');
  canvas.width  = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext('2d')!;
  const innerR = outerR * INNER_RATIO;

  ctx.beginPath();
  for (let i = 0; i < POINTS * 2; i++) {
    const angle = (Math.PI / POINTS) * i - Math.PI / 2 + rotation;
    const r = i % 2 === 0 ? outerR : innerR;
    ctx.lineTo(CX + Math.cos(angle) * r, CY + Math.sin(angle) * r);
  }
  ctx.closePath();

  ctx.fillStyle = fill;
  ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.25)';
  ctx.lineWidth = 1;
  ctx.stroke();

  applyToLink(canvas.toDataURL('image/png'));
}

// ─── Animation burst (3 cycles × CYCLE_MS) ───────────────────────────────────

function runBurst(fill: string): void {
  if (rafId !== null) cancelAnimationFrame(rafId);

  const totalMs = CYCLES * CYCLE_MS;
  let start: number | null = null;

  function frame(now: number): void {
    if (start === null) start = now;
    const elapsed = now - start;

    if (elapsed >= totalMs) {
      // Animation done — settle at idle size, no rotation
      drawStar(0, R_IDLE, fill);
      rafId = null;
      return;
    }

    // How far through all cycles (0 → CYCLES)
    const t        = elapsed / CYCLE_MS;
    // Position within the current cycle (0 → 1)
    const cycleT   = t % 1;

    // Full 360° rotation over one cycle
    const rotation = cycleT * Math.PI * 2;

    // Smooth size pulse: 50 % → 90 % → 50 % using a sine arch
    const pulse    = Math.sin(cycleT * Math.PI); // 0 → 1 → 0
    const outerR   = R_ANIM_MIN + (R_PEAK - R_ANIM_MIN) * pulse;

    drawStar(rotation, outerR, fill);
    rafId = requestAnimationFrame(frame);
  }

  rafId = requestAnimationFrame(frame);
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Updates the favicon colour immediately (static star, no animation).
 * Called whenever the app view changes.
 */
export function updateFavicon(competitionMode: boolean): void {
  drawStar(0, R_IDLE, competitionMode ? ORANGE_RED : YELLOW);
}

/**
 * Starts the 15-second repeating animation cycle.
 * `getCompetitionMode` is read at burst-time so the colour is always current.
 * Returns a cleanup function (call on component unmount).
 */
export function initFaviconCycle(getCompetitionMode: () => boolean): () => void {
  // Draw initial static favicon right away
  drawStar(0, R_IDLE, getCompetitionMode() ? ORANGE_RED : YELLOW);

  intervalId = setInterval(() => {
    runBurst(getCompetitionMode() ? ORANGE_RED : YELLOW);
  }, INTERVAL_MS);

  return () => {
    if (intervalId !== null) { clearInterval(intervalId); intervalId = null; }
    if (rafId    !== null) { cancelAnimationFrame(rafId);  rafId    = null; }
  };
}
