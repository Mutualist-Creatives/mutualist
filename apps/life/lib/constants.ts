// Responsive breakpoints
export const BREAKPOINTS = {
  MOBILE: 768,
  TABLET: 1024,
} as const;

// Canvas Grid Configuration (Desktop)
export const CANVAS_CONFIG = {
  // Grid layout
  COLUMN_COUNT: 7,
  CARD_WIDTH: 240,
  CARD_HEIGHT: 320, // Estimated average height for auto-sized images (reduced for tighter initial layout)
  GAP: 48,
  STAGGER_OFFSET: 96,

  // Viewport buffer for smooth rendering
  VIEWPORT_BUFFER: 200,

  // Computed values
  get FULL_COLUMN_WIDTH() {
    return this.CARD_WIDTH + this.GAP;
  },
  get FULL_CARD_HEIGHT() {
    return this.CARD_HEIGHT + this.GAP;
  },
} as const;

// Responsive Canvas Config
export const getResponsiveCanvasConfig = (width: number) => {
  if (width < BREAKPOINTS.MOBILE) {
    // Mobile
    return {
      COLUMN_COUNT: 7,
      CARD_WIDTH: 140,
      CARD_HEIGHT: 187, // 3:4 ratio
      GAP: 32,
      STAGGER_OFFSET: 64,
      VIEWPORT_BUFFER: 150,
      get FULL_COLUMN_WIDTH() {
        return this.CARD_WIDTH + this.GAP;
      },
      get FULL_CARD_HEIGHT() {
        return this.CARD_HEIGHT + this.GAP;
      },
    };
  } else if (width < BREAKPOINTS.TABLET) {
    // Tablet
    return {
      COLUMN_COUNT: 7,
      CARD_WIDTH: 180,
      CARD_HEIGHT: 240, // 3:4 ratio
      GAP: 40,
      STAGGER_OFFSET: 80,
      VIEWPORT_BUFFER: 175,
      get FULL_COLUMN_WIDTH() {
        return this.CARD_WIDTH + this.GAP;
      },
      get FULL_CARD_HEIGHT() {
        return this.CARD_HEIGHT + this.GAP;
      },
    };
  }
  // Desktop
  return CANVAS_CONFIG;
};

// Color Options
export const COLOR_OPTIONS = [
  "#FFF",
  "#EEEBE2",
  "#F3DA01",
  "#009F6F",
  "#770040",
  "#000",
] as const;

// Default Colors
export const DEFAULT_BG_COLOR = "#EEEBE2";
export const BUTTON_BG_COLOR = "#121212";

// Animation Durations (ms)
export const ANIMATION = {
  COLOR_MENU_OPEN: 300,
  COLOR_MENU_CLOSE: 200,
  SETTINGS_MORPH: 800,
  SETTINGS_REVERSE: 600,
  IMAGE_TRANSITION: 300,
  MODAL_OPEN: 400,
  MODAL_CLOSE: 300,
} as const;

// SWR Refresh Intervals (ms)
export const REFRESH_INTERVALS = {
  PORTFOLIOS: 30000, // 30 seconds
  CATEGORIES: 60000, // 60 seconds
} as const;
