export const THEME_KEY = "theme";

let listeners: Array<() => void> = [];

export function subscribeToTheme(listener: () => void): () => void {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

export function notifyThemeListeners(): void {
  for (const listener of listeners) {
    listener();
  }
}

export function getThemeSnapshot(): boolean {
  return document.documentElement.classList.contains("dark");
}

export function getServerThemeSnapshot(): boolean {
  return false;
}

export function getStoredTheme(): "dark" | "light" | null {
  try {
    const value = localStorage.getItem(THEME_KEY);
    if (value === "dark" || value === "light") return value;
    return null;
  } catch {
    return null;
  }
}

export function setStoredTheme(theme: "dark" | "light"): void {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // ignore environments where localStorage is unavailable
  }
}

export function applyTheme(isDark: boolean): void {
  if (isDark) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

export function isDarkMode(): boolean {
  return document.documentElement.classList.contains("dark");
}
