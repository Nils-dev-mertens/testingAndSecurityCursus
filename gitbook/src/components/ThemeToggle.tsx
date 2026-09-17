import { Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";

const STORAGE_KEY = "theme";

/**
 * Reads the theme that the inline script in the document head already applied,
 * so the toggle always acts on what the visitor actually sees.
 */
function isDark(): boolean {
  return document.documentElement.classList.contains("dark");
}

export function ThemeToggle() {
  const toggle = () => {
    const next = !isDark();
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
    } catch {
      /* storage blocked (private mode): the theme just won't persist */
    }
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={toggle}
      aria-label="Toggle color theme"
      title="Toggle color theme"
      className="text-muted-foreground hover:text-foreground"
    >
      {/* Which icon shows is decided by CSS, so it is correct before hydration. */}
      <Sun className="hidden h-5 w-5 dark:block" />
      <Moon className="h-5 w-5 dark:hidden" />
    </Button>
  );
}

export default ThemeToggle;
