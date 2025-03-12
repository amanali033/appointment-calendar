import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Toaster } from "react-hot-toast";
import { BrowserRouter } from "react-router-dom"; // ✅ Use BrowserRouter
import theme from "./theme"; // ✅ Import missing theme

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Toaster position="top-right" />
      <BrowserRouter>
        {" "}
        {/* ✅ Use BrowserRouter */}
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);
