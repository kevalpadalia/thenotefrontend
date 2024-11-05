import { createContext, useState, useMemo } from "react";
import { createTheme } from "@mui/material/styles";

// color design tokens export
export const tokens = (mode) => ({
  ...(mode === "dark"
    ? {
      grey: {
        100: "#e0e0e0",
        200: "#c2c2c2",
        300: "#a3a3a3",
        400: "#858585",
        500: "#666666",
        600: "#525252",
        700: "#3d3d3d",
        800: "#292929",
        900: "#141414",
        1000:"#000000"
      },
      primary: {
        500: "#141c1f",
      },
      secondary: {
        500: "#252d30",
      },
      primaryhighlight: {
300: "#6EE7B7",  // light emerald
400: "#34D399",  // medium emerald
500: "#059669"   // dark emerald

      },
      orangeAccent: {
        500: "#e97c5d"
      },
      greenAccent: {
        100: "#dbf5ee",
        200: "#b7ebde",
        300: "#94e2cd",
        400: "#70d8bd",
        500: "#4cceac",
        600: "#3da58a",
        700: "#2e7c67",
        800: "#1e5245",
        900: "#0f2922",
      },
      redAccent: {
        100: "#f8dcdb",
        200: "#f1b9b7",
        300: "#e99592",
        400: "#e2726e",
        500: "#db4f4a",
        600: "#af3f3b",
        700: "#832f2c",
        800: "#58201e",
        900: "#2c100f",
        1000: "#f87060"
      },
      blueAccent: {
        100: "#e1e2fe",
        200: "#c3c6fd",
        300: "#a4a9fc",
        400: "#868dfb",
        500: "#6870fa",
        600: "#535ac8",
        700: "#3e4396",
        800: "#2a2d64",
        900: "#151632",
      },
    }
    : {
      grey: {
        100: "#141414",
        200: "#292929",
        300: "#3d3d3d",
        400: "#525252",
        500: "#666666",
        600: "#858585",
        700: "#a3a3a3",
        800: "#c2c2c2",
        900: "#e0e0e0",
        1000:"#FFFFFF"
      },
      primary: {
        500: "#FFFFFF",
      },
      secondary: {
        500: "#F5F5F5",
        // 500: "#F5F7F8",
      },
      primaryhighlight: {
   300: "#6EE7B7",  // light emerald
  400: "#34D399",  // medium emerald
  500: "#059669"   // dark emerald

      },
      orangeAccent: {
        500: "#e97c5d"
      },
      greenAccent: {
        100: "#0f2922",
        200: "#1e5245",
        300: "#2e7c67",
        400: "#3da58a",
        500: "#4cceac",
        600: "#70d8bd",
        700: "#94e2cd",
        800: "#b7ebde",
        900: "#dbf5ee",
      },
      redAccent: {
        100: "#2c100f",
        200: "#58201e",
        300: "#832f2c",
        400: "#af3f3b",
        500: "#db4f4a",
        600: "#e2726e",
        700: "#e99592",
        800: "#f1b9b7",
        900: "#f8dcdb",
        1000: "#f87060"
      },
      blueAccent: {
        100: "#151632",
        200: "#2a2d64",
        300: "#3e4396",
        400: "#535ac8",
        500: "#6870fa",
        600: "#868dfb",
        700: "#a4a9fc",
        800: "#c3c6fd",
        900: "#e1e2fe",
      },
    }),
});

// mui theme settings
export const themeSettings = (mode) => {
  const colors = tokens(mode);
  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
          primary: {
            main: colors.primary[500],
          },
          accent: {
            main: colors.grey[100],
          },
          secondary: {
            main: colors.blueAccent[500],
          },
          buttonBlueAccent1: {
            main: colors.blueAccent[500],
          },
          buttonBlueAccent2: {
            main: colors.blueAccent[400],
          },
          primaryhighlight: {
            main: colors.primaryhighlight[300],
          },
          primaryhighlight2: {
            main: colors.primaryhighlight[400],
          },
          primaryhighlight3: {
            main: colors.primaryhighlight[500],
          },
          neutral: {
            dark: colors.grey[700],
            main: colors.grey[500],
            light: colors.grey[100],
          },
          background: {
            default: colors.primary[500],
          },
        }
        : {
          // palette values for light mode
          primary: {
            main: colors.primary[500],
          },
          accent: {
            main: colors.grey[300],
          },
          secondary: {
            main: colors.blueAccent[500],
          },
          buttonBlueAccent1: {
            main: colors.blueAccent[700],
          },
          primaryhighlight: {
            main: colors.primaryhighlight[300],
          },
          primaryhighlight2: {
            main: colors.primaryhighlight[400],
          },
          primaryhighlight3: {
            main: colors.primaryhighlight[500],
          },
          buttonBlueAccent2: {
            main: colors.blueAccent[400],
          },
          neutral: {
            dark: colors.grey[700],
            main: colors.grey[500],
            light: colors.grey[100],
          },
          background: {
            default: colors.primary[500],
          },
        }),
    },
    typography: {
      fontFamily: ["Metropolis", "sans-serif"].join(","),
      fontSize: 12,
      h1: {
        fontFamily: ["Metropolis", "sans-serif"].join(","),
        fontSize: 40,
      },
      h2: {
        fontFamily: ["Metropolis", "sans-serif"].join(","),
        fontSize: 32,
      },
      h3: {
        fontFamily: ["Metropolis", "sans-serif"].join(","),
        fontSize: 24,
      },
      h4: {
        fontFamily: ["Metropolis", "sans-serif"].join(","),
        fontSize: 20,
      },
      h5: {
        fontFamily: ["Metropolis", "sans-serif"].join(","),
        fontSize: 16,
      },
      h6: {
        fontFamily: ["Metropolis", "sans-serif"].join(","),
        fontSize: 14,
      },
    },

  };
};

// context for color mode
export const ColorModeContext = createContext({
  toggleColorMode: () => { },
});

export const useMode = () => {
  const [mode, setMode] = useState("light");

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () =>
        setMode((prev) => (prev === "light" ? "dark" : "light")),
    }),
    []
  );

  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  return [theme, colorMode];
};