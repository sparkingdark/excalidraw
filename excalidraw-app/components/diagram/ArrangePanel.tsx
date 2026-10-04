import {
  getSelectedElements,
  getSelectedElementsByGroup,
  isFrameLikeElement,
} from "@excalidraw/element";
import { useExcalidrawAPI } from "@excalidraw/excalidraw";
import {
  actionAlignLeft,
  actionAlignRight,
  actionAlignTop,
  actionAlignBottom,
  actionAlignVerticallyCentered,
  actionAlignHorizontallyCentered,
  distributeHorizontally,
  distributeVertically,
  actionBringForward,
  actionBringToFront,
  actionSendBackward,
  actionSendToBack,
  actionGroup,
  actionUngroup,
} from "@excalidraw/excalidraw/actions";
import { actionDuplicateSelection } from "@excalidraw/excalidraw/actions/actionDuplicateSelection";
import { actionToggleElementLock } from "@excalidraw/excalidraw/actions/actionElementLock";
import {
  useExcalidrawActionManager,
  useExcalidrawElements,
} from "@excalidraw/excalidraw/components/App";
import { AlignLeftIcon } from "@excalidraw/excalidraw/components/icons";
import { useUIAppState } from "@excalidraw/excalidraw/context/ui-appState";

import type { Action } from "@excalidraw/excalidraw/actions/types";

import "./DiagramPanels.scss";

const ALIGN_TOOLS = [
  ["Left", actionAlignLeft],
  ["Center horizontally", actionAlignHorizontallyCentered],
  ["Right", actionAlignRight],
  ["Top", actionAlignTop],
  ["Center vertically", actionAlignVerticallyCentered],
  ["Bottom", actionAlignBottom],
] as const;
const ORDER_TOOLS = [
  ["To front", actionBringToFront],
  ["Forward", actionBringForward],
  ["Backward", actionSendBackward],
  ["To back", actionSendToBack],
] as const;

export const arrangeIcon = AlignLeftIcon;

export const ArrangePanel = () => {
  const api = useExcalidrawAPI();
  const elements = useExcalidrawElements();
  const state = useUIAppState();
  const manager = useExcalidrawActionManager();
  const selected = getSelectedElements(elements, state);
  const units = api
    ? getSelectedElementsByGroup(
        selected,
        api.getSceneElementsMapIncludingDeleted(),
        api.getAppState(),
      )
    : [];
  const disabled = !api || state.viewModeEnabled || !selected.length;
  const canAlign =
    !disabled && units.length > 1 && !selected.some(isFrameLikeElement);
  const button = (label: string, action: Action, blocked = disabled) => (
    <button
      type="button"
      key={label}
      disabled={blocked}
      onClick={() => manager.executeAction(action, "ui")}
    >
      {label}
    </button>
  );
  return (
    <div className="neodraw-panel">
      <span className="neodraw-panel__eyebrow">MAKE SPACE FOR CLARITY</span>
      <h2>Arrange</h2>
      <p>
        Select objects on the canvas or Shift-click them in the Objects tab.
      </p>
      <p role="status">
        {units.length} selected object{units.length === 1 ? "" : "s"}
      </p>
      <h3>Align objects</h3>
      <div className="neodraw-panel__tools">
        {ALIGN_TOOLS.map(([label, action]) => button(label, action, !canAlign))}
      </div>
      <h3>Even spacing</h3>
      <div className="neodraw-panel__tools">
        {button(
          "Space horizontally",
          distributeHorizontally,
          !canAlign || units.length < 3,
        )}
        {button(
          "Space vertically",
          distributeVertically,
          !canAlign || units.length < 3,
        )}
      </div>
      <h3>Stacking order</h3>
      <div className="neodraw-panel__tools">
        {ORDER_TOOLS.map(([label, action]) => button(label, action))}
      </div>
      <h3>Selection</h3>
      <div className="neodraw-panel__tools">
        {button("Group", actionGroup, disabled || units.length < 2)}
        {button(
          "Ungroup",
          actionUngroup,
          disabled || !Object.values(state.selectedGroupIds).some(Boolean),
        )}
        {button("Duplicate", actionDuplicateSelection)}
        {button("Lock selection", actionToggleElementLock)}
      </div>
      <p className="neodraw-panel__hint">
        Groups move as one object. These controls use the editor's native
        actions, so labels, connectors and undo history stay in sync.
      </p>
    </div>
  );
};
