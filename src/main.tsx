import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

// Dismiss the splash screen
function hideSplash() {
  const splash = document.getElementById("splash");
  if (!splash) return;
  splash.classList.add("out");
  setTimeout(() => { try { splash.remove(); } catch { /* already removed */ } }, 350);
}

// Safety net: force-dismiss after 4s no matter what
setTimeout(hideSplash, 4000);

// Expose globally so App.tsx useEffect can call it after React mounts
(window as unknown as { __hideSplash?: () => void }).__hideSplash = hideSplash;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
