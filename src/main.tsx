import { SpotifyProvider } from "@/contexts/SpotifyProvider";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RecoilRoot } from "recoil";
import App from "./App";
import "./index.css";

// Force dark mode for the app
document.documentElement.classList.add("dark");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RecoilRoot>
      <SpotifyProvider>
        <App />
      </SpotifyProvider>
    </RecoilRoot>
  </StrictMode>
);
