const THEME_STORAGE_KEY = "optkor-theme"

/**
 * Blocking script rendered as the first thing in <head>, before hydration.
 * Sets `data-theme` on <html> directly via the DOM (not through JSX props),
 * so React's hydration diff — which only reconciles attributes it itself
 * declared — never sees or flags it. This is what avoids both the
 * flash-of-wrong-theme and the hydration mismatch in one move.
 */
export function ThemeScript() {
  const script = `
    (function () {
      try {
        var stored = localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});
        var theme = stored === "light" || stored === "dark"
          ? stored
          : (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
        document.documentElement.setAttribute("data-theme", theme);
      } catch (e) {}
    })();
  `
  return <script dangerouslySetInnerHTML={{ __html: script }} />
}

export { THEME_STORAGE_KEY }
