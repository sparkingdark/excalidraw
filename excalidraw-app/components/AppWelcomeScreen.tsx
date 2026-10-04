import { useI18n } from "@excalidraw/excalidraw/i18n";
import { WelcomeScreen, useExcalidrawAPI } from "@excalidraw/excalidraw/index";
import React from "react";

import { architectureIcon } from "./architecture/ArchitectureIcon";

export const AppWelcomeScreen: React.FC<{
  onCollabDialogOpen: () => any;
  isCollabEnabled: boolean;
}> = React.memo((props) => {
  const { t } = useI18n();
  const api = useExcalidrawAPI();
  return (
    <WelcomeScreen>
      <WelcomeScreen.Hints.MenuHint>
        {t("welcomeScreen.app.menuHint")}
      </WelcomeScreen.Hints.MenuHint>
      <WelcomeScreen.Hints.ToolbarHint />
      <WelcomeScreen.Hints.HelpHint />
      <WelcomeScreen.Center>
        <WelcomeScreen.Center.Logo />
        <WelcomeScreen.Center.Heading>
          Sketch ideas. Design systems.
          <br />
          Make the next connection.
        </WelcomeScreen.Center.Heading>
        <WelcomeScreen.Center.Menu>
          <WelcomeScreen.Center.MenuItem
            icon={architectureIcon}
            onSelect={() =>
              api?.toggleSidebar({
                name: "default",
                tab: "architecture",
                force: true,
              })
            }
          >
            Design an architecture
          </WelcomeScreen.Center.MenuItem>
          <WelcomeScreen.Center.MenuItemLoadScene />
          <WelcomeScreen.Center.MenuItemHelp />
          {props.isCollabEnabled && (
            <WelcomeScreen.Center.MenuItemLiveCollaborationTrigger
              onSelect={() => props.onCollabDialogOpen()}
            />
          )}
        </WelcomeScreen.Center.Menu>
      </WelcomeScreen.Center>
    </WelcomeScreen>
  );
});
