import React, { useState } from "react";
import AppDefault from "./App.default";
import Overlay from "./components/Overlay";

// Dynamically import overrides
const overrides = import.meta.glob("./overrides/**/*.{ts,tsx}", { eager: true });

let BaseApp: React.FC;
if ("./overrides/App.tsx" in overrides) {
  console.log("🟣 Using App override from ./overrides/App.tsx");
  const mod = overrides["./overrides/App.tsx"] as any;
  BaseApp = mod.default;
} else {
  console.log("⚪ Using default App");
  BaseApp = AppDefault;
}

function AppWrapper() {
  const [overlayOpen, setOverlayOpen] = useState(false);

  const handleOverride = async (instructions: string) => {
    await fetch("http://localhost:3001/override", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ instructions }),
    });
  };

  return (
    <div>
      {/* Overlay Toggle */}
      <button
        onClick={() => setOverlayOpen((prev) => !prev)}
        className="fixed top-4 right-4 bg-blue-500 text-white px-3 py-2 rounded shadow z-40"
      >
        {overlayOpen ? "Close GenUI" : "Open GenUI"}
      </button>

      {/* Render whichever app is active */}
      <BaseApp />

      {/* Global Overlay */}
      {overlayOpen && (
        <Overlay
          onSubmit={handleOverride}
          onClose={() => setOverlayOpen(false)}
        />
      )}

    </div>
  );
}

export default AppWrapper;
