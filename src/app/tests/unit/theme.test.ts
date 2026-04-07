import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  applyTheme,
  getStoredTheme,
  getThemeSnapshot,
  isDarkMode,
  notifyThemeListeners,
  setStoredTheme,
  subscribeToTheme,
  THEME_KEY,
} from "@/lib/theme";

describe("getStoredTheme", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns 'dark' when localStorage contains 'dark'", () => {
    localStorage.setItem(THEME_KEY, "dark");
    expect(getStoredTheme()).toBe("dark");
  });

  it("returns 'light' when localStorage contains 'light'", () => {
    localStorage.setItem(THEME_KEY, "light");
    expect(getStoredTheme()).toBe("light");
  });

  it("returns null when localStorage has no theme key", () => {
    expect(getStoredTheme()).toBeNull();
  });

  it("returns null when localStorage contains an unrecognised value", () => {
    localStorage.setItem(THEME_KEY, "auto");
    expect(getStoredTheme()).toBeNull();
  });
});

describe("setStoredTheme", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("writes 'dark' to localStorage", () => {
    setStoredTheme("dark");
    expect(localStorage.getItem(THEME_KEY)).toBe("dark");
  });

  it("writes 'light' to localStorage", () => {
    setStoredTheme("light");
    expect(localStorage.getItem(THEME_KEY)).toBe("light");
  });
});

describe("applyTheme and isDarkMode", () => {
  beforeEach(() => {
    document.documentElement.classList.remove("dark");
  });

  it("adds the dark class when isDark is true", () => {
    applyTheme(true);
    expect(isDarkMode()).toBe(true);
  });

  it("removes the dark class when isDark is false", () => {
    document.documentElement.classList.add("dark");
    applyTheme(false);
    expect(isDarkMode()).toBe(false);
  });

  it("toggling from light sets dark class and writes to localStorage", () => {
    applyTheme(false);
    expect(isDarkMode()).toBe(false);

    applyTheme(true);
    setStoredTheme("dark");

    expect(isDarkMode()).toBe(true);
    expect(localStorage.getItem(THEME_KEY)).toBe("dark");
  });

  it("toggling from dark removes dark class and writes to localStorage", () => {
    applyTheme(true);
    expect(isDarkMode()).toBe(true);

    applyTheme(false);
    setStoredTheme("light");

    expect(isDarkMode()).toBe(false);
    expect(localStorage.getItem(THEME_KEY)).toBe("light");
  });
});

describe("getThemeSnapshot", () => {
  beforeEach(() => {
    document.documentElement.classList.remove("dark");
  });

  it("returns false when dark class is absent", () => {
    expect(getThemeSnapshot()).toBe(false);
  });

  it("returns true when dark class is present", () => {
    document.documentElement.classList.add("dark");
    expect(getThemeSnapshot()).toBe(true);
  });
});

describe("subscribeToTheme and notifyThemeListeners", () => {
  it("calls the listener when notifyThemeListeners is invoked", () => {
    const listener = vi.fn();
    const unsubscribe = subscribeToTheme(listener);
    notifyThemeListeners();
    expect(listener).toHaveBeenCalledOnce();
    unsubscribe();
  });

  it("does not call the listener after unsubscribing", () => {
    const listener = vi.fn();
    const unsubscribe = subscribeToTheme(listener);
    unsubscribe();
    notifyThemeListeners();
    expect(listener).not.toHaveBeenCalled();
  });
});
