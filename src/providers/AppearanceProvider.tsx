"use client";

import {
  createContext,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  createTheme,
  CssBaseline,
  ThemeProvider as MuiThemeProvider,
  useMediaQuery,
  type Theme,
} from "@mui/material";

export type Appearance = "light" | "dark" | "system";
export type ThemeMode = "light" | "dark";

interface AppearanceContextValue {
  appearance: Appearance;
  themeMode: ThemeMode;
  setAppearance: (next: Appearance) => void;
}

const AppearanceContext = createContext<AppearanceContextValue | undefined>(
  undefined
);

const STORAGE_KEY = "appearance";

const ssrMatchMedia = (query: string): MediaQueryList =>
  ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }) as MediaQueryList;

const getAppearanceFromStorage = (): Appearance => {
  if (typeof window === "undefined") {
    return "system";
  }

  const storedAppearance = localStorage.getItem(STORAGE_KEY) as
    | Appearance
    | null;

  return storedAppearance ?? "system";
};

const subscribeToAppearanceStorage = (callback: () => void) => {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      callback();
    }
  };

  const handleCustomEvent = () => {
    callback();
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener("appearance-change", handleCustomEvent);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener("appearance-change", handleCustomEvent);
  };
};

const dispatchAppearanceChangeEvent = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event("appearance-change"));
};

export const AppearanceProvider = ({ children }: { children: ReactNode }) => {
  const appearance = useSyncExternalStore(
    subscribeToAppearanceStorage,
    getAppearanceFromStorage,
    () => "system"
  );

  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)", {
    ssrMatchMedia,
  });

  const themeMode: ThemeMode =
    appearance === "system"
      ? prefersDarkMode
        ? "dark"
        : "light"
      : appearance === "dark"
      ? "dark"
      : "light";

  const theme = useMemo<Theme>(
    () =>
      createTheme({
        palette: { mode: themeMode },
        components: {
          MuiUseMediaQuery: {
            defaultProps: { noSsr: true },
          },
        },
      }),
    [themeMode]
  );

  const setAppearance = (next: Appearance) => {
    if (typeof window === "undefined") {
      return;
    }

    localStorage.setItem(STORAGE_KEY, next);
    dispatchAppearanceChangeEvent();
  };

  return (
    <AppearanceContext.Provider
      value={{ appearance, themeMode, setAppearance }}
    >
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </AppearanceContext.Provider>
  );
};

export const useAppearance = () => {
  const context = useContext(AppearanceContext);
  if (!context) {
    throw new Error(
      "useAppearance must be used within an AppearanceProvider"
    );
  }

  return context;
};
