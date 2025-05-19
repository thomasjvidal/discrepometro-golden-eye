
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
  theme?: {
    light?: Record<string, string>;
    dark?: Record<string, string>;
  };
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  theme,
}: ThemeProviderProps) {
  const [currentTheme, setCurrentTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");

    if (currentTheme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(currentTheme);
  }, [currentTheme]);

  useEffect(() => {
    if (!theme) return;
    
    const root = window.document.documentElement;
    const isDark = currentTheme === "dark" || 
      (currentTheme === "system" && 
       window.matchMedia("(prefers-color-scheme: dark)").matches);
    
    const themeToApply = isDark ? theme.dark : theme.light;
    
    if (themeToApply) {
      Object.entries(themeToApply).forEach(([key, value]) => {
        root.style.setProperty(`--${key}`, value);
      });
    }
  }, [theme, currentTheme]);

  const value = {
    theme: currentTheme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setCurrentTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
