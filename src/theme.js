// theme.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1D8567",
      white: "#FAFAFA",
    },
    secondary: {
      main: "#1D8567",
    },
    background: {
      default: "#FAFAFA",
    },
    // button: {
    //     main: '#1D8567',
    //     light: '#2D9E76',
    //     contrastText: '#FFFFFF',
    // },
    button: {
      main: "#1D8567",
      light: "#1D8567",
      contrastText: "#FFFFFF",
    },
    text: {
      primary: "#09090B",
      secondary: "#71717A",
    },
  },
  typography: {
    fontFamily:
      'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
    h1: {
      color: "#09090B",
    },
    h2: {
      color: "#09090B",
    },
    h3: {
      color: "#09090B",
    },
    body1: {
      color: "#71717A",
    },
    body2: {
      color: "#71717A",
    },
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          ".MuiOutlinedInput-notchedOutline": {
            borderColor: "#E0E0E0",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: "16px",
          ".MuiOutlinedInput-notchedOutline": {
            borderColor: "#E0E0E0",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "16px",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
        },
      },
    },
  },
});

export default theme;
