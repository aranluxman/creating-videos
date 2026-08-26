/**
 * Locked brand identity for Intelligent Automations.
 * Do not vary these per video.
 */
export const THEME = {
  navy: "#0A1628",
  navyDeep: "#060F1C",
  navyCard: "#122238",
  cyan: "#1FB6FF",
  cyanDim: "#12617F",
  white: "#FFFFFF",
  muted: "#93A6BF",
  display: '"Archivo Black", system-ui, sans-serif',
  body: '"Inter", system-ui, sans-serif',
} as const;

export const VIDEO = {
  width: 1080,
  height: 1920,
  fps: 30,
} as const;

/** Safe area: TikTok and Instagram overlay UI on the outer edges. */
export const SAFE = {
  top: 260,
  bottom: 300,
  side: 90,
} as const;
