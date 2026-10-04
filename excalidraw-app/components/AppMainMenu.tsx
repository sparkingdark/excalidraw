import { ExcalidrawLogo } from "@excalidraw/excalidraw/components/ExcalidrawLogo";
import { eyeIcon } from "@excalidraw/excalidraw/components/icons";
import { MainMenu, useExcalidrawAPI } from "@excalidraw/excalidraw/index";
import React from "react";

import { isDevEnv } from "@excalidraw/common";

import type { Theme } from "@excalidraw/element/types";

import { LanguageList } from "../app-language/LanguageList";

import { saveDebugState } from "./DebugCanvas";
import { architectureIcon } from "./architecture/ArchitectureIcon";
import { objectsIcon } from "./diagram/ObjectsPanel";
import { arrangeIcon } from "./diagram/ArrangePanel";

export const AppMainMenu: React.FC<{
  onCollabDialogOpen: () => any;
  isCollaborating: boolean;
  isCollabEnabled: boolean;
  theme: Theme | "system";
  refresh: () => void;
}> = React.memo((props) => {
  const api = useExcalidrawAPI();
  return (
    <MainMenu>
      <MainMenu.ItemCustom>
        <ExcalidrawLogo size="mobile" withText />
      </MainMenu.ItemCustom>
      <MainMenu.DefaultItems.LoadScene />
      <MainMenu.DefaultItems.SaveToActiveFile />
      <MainMenu.DefaultItems.Export />
      <MainMenu.DefaultItems.SaveAsImage />
      {props.isCollabEnabled && (
        <MainMenu.DefaultItems.LiveCollaborationTrigger
          isCollaborating={props.isCollaborating}
          onSelect={() => props.onCollabDialogOpen()}
        />
      )}
      <MainMenu.DefaultItems.CommandPalette className="highlighted" />
      <MainMenu.DefaultItems.SearchMenu />
      <MainMenu.Item
        icon={architectureIcon}
        onSelect={() =>
          api?.toggleSidebar({
            name: "default",
            tab: "architecture",
            force: true,
          })
        }
      >
        Architecture toolkit
      </MainMenu.Item>
      <MainMenu.DefaultItems.Help />
      <MainMenu.Item
        icon={objectsIcon}
        onSelect={() =>
          api?.toggleSidebar({ name: "default", tab: "objects", force: true })
        }
      >
        Objects
      </MainMenu.Item>
      <MainMenu.Item
        icon={arrangeIcon}
        onSelect={() =>
          api?.toggleSidebar({ name: "default", tab: "arrange", force: true })
        }
      >
        Arrange
      </MainMenu.Item>
      <MainMenu.DefaultItems.ClearCanvas />
      <MainMenu.Separator />
      {isDevEnv() && (
        <MainMenu.Item
          icon={eyeIcon}
          onSelect={() => {
            if (window.visualDebug) {
              delete window.visualDebug;
              saveDebugState({ enabled: false });
            } else {
              window.visualDebug = { data: [] };
              saveDebugState({ enabled: true });
            }
            props?.refresh();
          }}
        >
          Visual Debug
        </MainMenu.Item>
      )}
      <MainMenu.Separator />
      <MainMenu.DefaultItems.Preferences />
      <MainMenu.DefaultItems.ToggleTheme allowSystemTheme theme={props.theme} />
      <MainMenu.ItemCustom>
        <LanguageList style={{ width: "100%" }} />
      </MainMenu.ItemCustom>
      <MainMenu.DefaultItems.ChangeCanvasBackground />
    </MainMenu>
  );
});
