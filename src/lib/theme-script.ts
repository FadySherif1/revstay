export const THEME_STORAGE_KEY = "revstay-theme";

/**
 * Stringified so it can run as a blocking inline <script> in <head>,
 * before hydration, and set data-theme on <html> before first paint.
 * Keep this self-contained — it runs outside the React tree.
 */
export const themeInitScript = `(function(){try{
  var stored = localStorage.getItem("${THEME_STORAGE_KEY}");
  var theme = stored === "dark" || stored === "light"
    ? stored
    : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  document.documentElement.setAttribute("data-theme", theme);
}catch(e){}})();`;
