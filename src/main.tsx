import { SpotifyProvider } from "@/contexts/SpotifyProvider";
import { createRoot } from "react-dom/client";
import { RecoilRoot } from "recoil";
import App from "./App";
import { WebPlayback } from "./components/WebPlayback";
import "./index.css";

// Force dark mode for the app
document.documentElement.classList.add("dark");

createRoot(document.getElementById("root")!).render(
  <RecoilRoot>
    <SpotifyProvider>
      <WebPlayback>
        <App />
      </WebPlayback>
    </SpotifyProvider>
  </RecoilRoot>
);
