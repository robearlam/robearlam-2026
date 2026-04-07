import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { ThemeToggle } from "@/components/theme-toggle";

describe("ThemeToggle", () => {
  beforeEach(() => {
    document.documentElement.classList.remove("dark");
    localStorage.clear();
  });

  it("renders with aria-label indicating switch to dark mode when in light mode", async () => {
    render(<ThemeToggle />);
    // Wait for the external store snapshot to be reflected in the button's aria-label
    const button = await screen.findByRole("button", { name: "Switch to dark mode" });
    expect(button).toBeInTheDocument();
  });

  it("renders with aria-label indicating switch to light mode when in dark mode", async () => {
    document.documentElement.classList.add("dark");
    render(<ThemeToggle />);
    const button = await screen.findByRole("button", { name: "Switch to light mode" });
    expect(button).toBeInTheDocument();
  });

  it("updates aria-label to switch to light mode after activating from light mode", async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);
    const button = await screen.findByRole("button", { name: "Switch to dark mode" });
    await user.click(button);
    expect(screen.getByRole("button", { name: "Switch to light mode" })).toBeInTheDocument();
  });

  it("updates aria-label to switch to dark mode after activating from dark mode", async () => {
    const user = userEvent.setup();
    document.documentElement.classList.add("dark");
    render(<ThemeToggle />);
    const button = await screen.findByRole("button", { name: "Switch to light mode" });
    await user.click(button);
    expect(screen.getByRole("button", { name: "Switch to dark mode" })).toBeInTheDocument();
  });

  it("persists dark preference to localStorage after toggling to dark", async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);
    const button = await screen.findByRole("button", { name: "Switch to dark mode" });
    await user.click(button);
    expect(localStorage.getItem("theme")).toBe("dark");
  });

  it("persists light preference to localStorage after toggling to light", async () => {
    const user = userEvent.setup();
    document.documentElement.classList.add("dark");
    render(<ThemeToggle />);
    const button = await screen.findByRole("button", { name: "Switch to light mode" });
    await user.click(button);
    expect(localStorage.getItem("theme")).toBe("light");
  });
});
