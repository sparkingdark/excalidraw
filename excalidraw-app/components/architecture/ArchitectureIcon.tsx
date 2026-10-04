import { useExcalidrawAPI } from "@excalidraw/excalidraw";
import { useUIAppState } from "@excalidraw/excalidraw/context/ui-appState";

import "./ArchitecturePanel.scss";

export const architectureIcon = (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="8" y="2" width="8" height="6" rx="1.5" />
    <rect x="1" y="16" width="7" height="6" rx="1.5" />
    <rect x="16" y="16" width="7" height="6" rx="1.5" />
    <path d="M12 8v4M4.5 16v-4h15v4" />
  </svg>
);

export const ArchitectureTrigger = () => {
  const api = useExcalidrawAPI();
  const { openSidebar } = useUIAppState();
  return (
    <button
      type="button"
      className="architecture-trigger"
      aria-label="Architecture toolkit"
      aria-expanded={
        openSidebar?.name === "default" && openSidebar.tab === "architecture"
      }
      onClick={() =>
        api?.toggleSidebar({ name: "default", tab: "architecture" })
      }
    >
      {architectureIcon}
      <span>Architecture</span>
    </button>
  );
};
