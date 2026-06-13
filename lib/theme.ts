export type ThemeColors = {
  background: string;
  foreground: string;
  accent: string;
  surface: string;
  border: string;
  muted: string;
  heroBackground: string;
  gradient: string;
};

export const DEFAULT_THEME: ThemeColors = {
  background: "#fafaf9",
  foreground: "#1c1917",
  accent: "#d97706",
  surface: "#ffffff",
  border: "#e7e5e4",
  muted: "#78716c",
  heroBackground: "#1c1917",
  gradient: "#d97706",
};

export const THEME_STORAGE_KEY = "bnm-theme";

export const THEME_FIELDS: {
  key: keyof ThemeColors;
  label: string;
  description: string;
}[] = [
  { key: "background", label: "Background", description: "Page background" },
  { key: "foreground", label: "Text", description: "Primary text color" },
  { key: "accent", label: "Main color", description: "Buttons, links, accents" },
  { key: "surface", label: "Surfaces", description: "Cards, header, footer" },
  { key: "border", label: "Borders", description: "Dividers and outlines" },
  { key: "muted", label: "Muted text", description: "Secondary text" },
  { key: "heroBackground", label: "Hero banner", description: "Top banner background" },
  { key: "gradient", label: "Gradient", description: "Hero glow and highlights" },
];

function clamp(value: number) {
  return Math.min(255, Math.max(0, value));
}

function adjustHex(hex: string, amount: number) {
  const normalized = hex.replace("#", "");
  if (normalized.length !== 6) return hex;

  const num = parseInt(normalized, 16);
  const r = clamp((num >> 16) + amount);
  const g = clamp(((num >> 8) & 0xff) + amount);
  const b = clamp((num & 0xff) + amount);

  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

export function applyTheme(colors: ThemeColors) {
  const root = document.documentElement;

  root.style.setProperty("--theme-background", colors.background);
  root.style.setProperty("--theme-foreground", colors.foreground);
  root.style.setProperty("--theme-accent", colors.accent);
  root.style.setProperty("--theme-accent-hover", adjustHex(colors.accent, -20));
  root.style.setProperty("--theme-accent-light", adjustHex(colors.accent, 40));
  root.style.setProperty("--theme-surface", colors.surface);
  root.style.setProperty("--theme-border", colors.border);
  root.style.setProperty("--theme-muted", colors.muted);
  root.style.setProperty("--theme-hero-bg", colors.heroBackground);
  root.style.setProperty("--theme-gradient", colors.gradient);
}

export function loadTheme(): ThemeColors {
  if (typeof window === "undefined") return DEFAULT_THEME;

  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (!stored) return DEFAULT_THEME;
    return { ...DEFAULT_THEME, ...JSON.parse(stored) };
  } catch {
    return DEFAULT_THEME;
  }
}

export function saveTheme(colors: ThemeColors) {
  localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(colors));
}

export function themeInitScript() {
  return `(function(){try{var k="bnm-theme",s=localStorage.getItem(k);if(!s)return;var t=JSON.parse(s),r=document.documentElement,d=function(h,a){var n=parseInt(h.replace("#",""),16),v=function(x){return Math.min(255,Math.max(0,x))};return"#"+((v((n>>16)+a)<<16|v(((n>>8)&255)+a)<<8|v((n&255)+a)).toString(16).padStart(6,"0"))};r.style.setProperty("--theme-background",t.background||"#fafaf9");r.style.setProperty("--theme-foreground",t.foreground||"#1c1917");r.style.setProperty("--theme-accent",t.accent||"#d97706");r.style.setProperty("--theme-accent-hover",d(t.accent||"#d97706",-20));r.style.setProperty("--theme-accent-light",d(t.accent||"#d97706",40));r.style.setProperty("--theme-surface",t.surface||"#ffffff");r.style.setProperty("--theme-border",t.border||"#e7e5e4");r.style.setProperty("--theme-muted",t.muted||"#78716c");r.style.setProperty("--theme-hero-bg",t.heroBackground||"#1c1917");r.style.setProperty("--theme-gradient",t.gradient||"#d97706");}catch(e){}})();`;
}
