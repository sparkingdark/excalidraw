import { ExcalidrawLogo } from "@excalidraw/excalidraw/components/ExcalidrawLogo";
import { Footer } from "@excalidraw/excalidraw/index";
import React from "react";

import { DebugFooter, isVisualDebuggerEnabled } from "./DebugCanvas";

export const AppFooter = React.memo(
  ({ onChange }: { onChange: () => void }) => {
    return (
      <Footer>
        <div
          style={{
            display: "flex",
            gap: ".5rem",
            alignItems: "center",
          }}
        >
          {isVisualDebuggerEnabled() && <DebugFooter onChange={onChange} />}
          <span
            className="neodraw-footer-brand"
            title="NeoDraw · Local-first canvas"
          >
            <ExcalidrawLogo size="mobile" withText />
          </span>
        </div>
      </Footer>
    );
  },
);
