import {
  DefaultSidebar,
  Sidebar,
  useExcalidrawAPI,
} from "@excalidraw/excalidraw";
import { useUIAppState } from "@excalidraw/excalidraw/context/ui-appState";

import { architectureIcon } from "./architecture/ArchitectureIcon";
import { ArchitecturePanel } from "./architecture/ArchitecturePanel";
import { ObjectsPanel, objectsIcon } from "./diagram/ObjectsPanel";
import { ArrangePanel, arrangeIcon } from "./diagram/ArrangePanel";

export const AppSidebar = () => {
  const { viewModeEnabled, gridModeEnabled } = useUIAppState();
  const api = useExcalidrawAPI();
  return (
    <DefaultSidebar>
      <DefaultSidebar.TabTriggers>
        <Sidebar.TabTrigger
          tab="architecture"
          title="Architecture toolkit"
          aria-label="Architecture toolkit"
        >
          {architectureIcon}
        </Sidebar.TabTrigger>
        <Sidebar.TabTrigger tab="objects" title="Objects" aria-label="Objects">
          {objectsIcon}
        </Sidebar.TabTrigger>
        <Sidebar.TabTrigger tab="arrange" title="Arrange" aria-label="Arrange">
          {arrangeIcon}
        </Sidebar.TabTrigger>
      </DefaultSidebar.TabTriggers>
      <Sidebar.Tab tab="architecture">
        <ArchitecturePanel
          api={api}
          viewModeEnabled={viewModeEnabled}
          gridModeEnabled={gridModeEnabled}
        />
      </Sidebar.Tab>
      <Sidebar.Tab tab="objects">
        <ObjectsPanel />
      </Sidebar.Tab>
      <Sidebar.Tab tab="arrange">
        <ArrangePanel />
      </Sidebar.Tab>
    </DefaultSidebar>
  );
};
