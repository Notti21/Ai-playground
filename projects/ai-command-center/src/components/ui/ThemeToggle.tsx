"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";

function readCurrentTheme(): Theme {
  const stored = document.documentElement.getAttribute("data-theme");
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  // The server can't know the visitor's stored preference, so the first
  // render always assumes "light". This effect corrects it right after
  // mount — a one-time icon update, not the page-wide flash the plan's
  // inline script (in layout.tsx) already prevents. Reading a browser-only
  // external system (the DOM attribute set by that script) on mount is the
  // documented exception to "don't setState in an effect" — doing this in
  // the state initializer instead would read `document` during server
  // rendering and crash, or mismatch the server-rendered markup.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(readCurrentTheme());

    // Keep the toggle in sync if the OS theme changes while the tab stays
    // open — but only when the visitor hasn't made an explicit choice yet.
    // `data-theme` is present whenever an explicit choice exists, whether
    // set moments ago by a click or earlier by the pre-paint script reading
    // localStorage — so its absence is the single signal for "still
    // following system." This is the standard "subscribe to an external
    // system, setState in the callback" pattern, not the synchronous-in-effect
    // pattern the lint rule above warns about.
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    function handleSystemChange(event: MediaQueryListEvent) {
      const hasExplicitChoice = document.documentElement.hasAttribute("data-theme");
      if (!hasExplicitChoice) {
        setTheme(event.matches ? "dark" : "light");
      }
    }
    media.addEventListener("change", handleSystemChange);
    return () => media.removeEventListener("change", handleSystemChange);
  }, []);

  function toggleTheme() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    setTheme(next);
  }

  const label = theme === "dark" ? "Switch to light mode" : "Switch to dark mode";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className="rounded-full border border-border p-2 text-muted transition-colors hover:border-accent/50 hover:text-accent"
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4" strokeWidth={1.75} />
      ) : (
        <Moon className="h-4 w-4" strokeWidth={1.75} />
      )}
    </button>
  );
}
