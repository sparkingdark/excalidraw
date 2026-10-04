import { useMemo, useState } from "react";

import {
  getCommonBounds,
  selectGroupsFromGivenElements,
  getNonDeletedElements,
} from "@excalidraw/element";
import { CaptureUpdateAction, useExcalidrawAPI } from "@excalidraw/excalidraw";
import {
  actionToggleElementLock,
  actionUnlockAllElements,
} from "@excalidraw/excalidraw/actions/actionElementLock";
import {
  useExcalidrawActionManager,
  useExcalidrawElements,
} from "@excalidraw/excalidraw/components/App";
import {
  LockedIcon,
  UnlockedIcon,
} from "@excalidraw/excalidraw/components/icons";
import { useUIAppState } from "@excalidraw/excalidraw/context/ui-appState";

import { getDiagramObjects } from "./objects";

import "./DiagramPanels.scss";

import type { DiagramObject } from "./objects";

export const objectsIcon = (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    aria-hidden="true"
  >
    <path d="m12 3 10 5-10 5L2 8l10-5Zm-9 10 9 5 9-5M3 18l9 5 9-5" />
  </svg>
);

export const ObjectsPanel = () => {
  const api = useExcalidrawAPI();
  const elements = useExcalidrawElements();
  const state = useUIAppState();
  const manager = useExcalidrawActionManager();
  const [query, setQuery] = useState("");
  const objects = useMemo(() => getDiagramObjects(elements), [elements]);
  const filtered = objects.filter((object) =>
    `${object.name} ${object.type}`
      .toLowerCase()
      .includes(query.trim().toLowerCase()),
  );
  const selectionFor = (object: DiagramObject) => ({
    selectedElementIds: Object.fromEntries(
      object.elements.map((element) => [element.id, true as const]),
    ),
    selectedGroupIds: api
      ? selectGroupsFromGivenElements(
          getNonDeletedElements(object.elements),
          api.getAppState(),
        )
      : {},
    editingGroupId: null,
  });
  return (
    <div className="neodraw-panel">
      <span className="neodraw-panel__eyebrow">CANVAS NAVIGATOR</span>
      <h2>Objects</h2>
      <p>Find a component, jump to it, or protect it from accidental edits.</p>
      <label className="neodraw-panel__field">
        Search objects
        <input
          type="search"
          value={query}
          placeholder="Search labels or shape types…"
          onChange={(event) => setQuery(event.target.value)}
        />
      </label>
      <div className="neodraw-panel__tools">
        <button
          type="button"
          disabled={!api || !objects.length}
          onClick={() =>
            api?.setViewport({
              target: api.getSceneElements(),
              fit: "scale-down",
              offsets: { ui: true },
            })
          }
        >
          Fit all
        </button>
        <button
          type="button"
          disabled={
            !api ||
            state.viewModeEnabled ||
            !objects.some((object) => object.locked)
          }
          onClick={() => manager.executeAction(actionUnlockAllElements, "ui")}
        >
          Unlock all
        </button>
      </div>
      <p role="status">
        {objects.length} objects · {filtered.length} shown
      </p>
      <div className="neodraw-panel__objects">
        {filtered.map((object) => (
          <div
            className="neodraw-panel__object"
            key={object.id}
            data-selected={object.elements.some(
              (element) => state.selectedElementIds[element.id],
            )}
          >
            <button
              type="button"
              className="neodraw-panel__object-name"
              aria-label={`Select ${object.name}`}
              onClick={(event) => {
                if (!api) {
                  return;
                }
                if (!state.viewModeEnabled) {
                  const selection = selectionFor(object);
                  api.setActiveTool({ type: "selection" });
                  api.updateScene({
                    appState: object.locked
                      ? {
                          selectedElementIds: {},
                          selectedGroupIds: {},
                          editingGroupId: null,
                          activeLockedId: object.id,
                        }
                      : {
                          ...selection,
                          activeLockedId: null,
                          selectedElementIds: event.shiftKey
                            ? {
                                ...api.getAppState().selectedElementIds,
                                ...selection.selectedElementIds,
                              }
                            : selection.selectedElementIds,
                          selectedGroupIds: event.shiftKey
                            ? {
                                ...api.getAppState().selectedGroupIds,
                                ...selection.selectedGroupIds,
                              }
                            : selection.selectedGroupIds,
                        },
                    captureUpdate: CaptureUpdateAction.EVENTUALLY,
                  });
                }
                api.setViewport({
                  target: getCommonBounds(object.elements),
                  fit: "none",
                  offsets: { ui: true },
                });
              }}
            >
              <strong>{object.name}</strong>
              <small>
                {object.type} · {object.elements.length} element
                {object.elements.length === 1 ? "" : "s"}
              </small>
            </button>
            <button
              type="button"
              className="neodraw-panel__object-lock"
              disabled={!api || state.viewModeEnabled}
              aria-label={`${object.locked ? "Unlock" : "Lock"} ${object.name}`}
              title={object.locked ? "Unlock" : "Lock"}
              onClick={() => {
                if (!api) {
                  return;
                }
                const selection = selectionFor(object);
                // Reuse the editor's lock action, including grouped labels, frames and undo history.
                manager.executeAction(
                  {
                    ...actionToggleElementLock,
                    perform: (all, appState, value, app) =>
                      actionToggleElementLock.perform(
                        all,
                        { ...appState, ...selection },
                        value,
                        app,
                      ),
                  },
                  "ui",
                );
              }}
            >
              {object.locked ? LockedIcon : UnlockedIcon}
            </button>
          </div>
        ))}
      </div>
      {!filtered.length && (
        <p role="status">
          {objects.length
            ? "No matching objects."
            : "Your canvas is empty. Add a shape or an architecture template to begin."}
        </p>
      )}
      <p className="neodraw-panel__hint">
        Shift-click objects to build a selection. Locking and unlocking support
        undo.
      </p>
    </div>
  );
};
