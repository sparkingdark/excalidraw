import { useState } from "react";

import { CaptureUpdateAction } from "@excalidraw/excalidraw";

import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";

import {
  ARCHITECTURE_COMPONENTS,
  ARCHITECTURE_TEMPLATES,
  COMPONENT_CATEGORIES,
  DIAGRAM_COLORS,
  svgDataUrl,
} from "./catalog";
import {
  buildArchitectureScene,
  colorArchitectureSelection,
  insertArchitectureScene,
} from "./scene";
import { TextDiagramPanel } from "./TextDiagramPanel";

import "./ArchitecturePanel.scss";

import type { ArchitectureOptions } from "./scene";

const CANVAS_COLORS = [
  { name: "White", color: "#ffffff" },
  { name: "Cloud", color: "#f8fafc" },
  { name: "Ice", color: "#eff6ff" },
  { name: "Mint", color: "#f0fdf4" },
  { name: "Lavender", color: "#faf5ff" },
  { name: "Sand", color: "#fffbeb" },
];

export const ArchitecturePanel = ({
  api,
  viewModeEnabled,
  gridModeEnabled,
}: {
  api: ExcalidrawImperativeAPI | null;
  viewModeEnabled: boolean;
  gridModeEnabled: boolean;
}) => {
  const [section, setSection] = useState("Components");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [options, setOptions] = useState<ArchitectureOptions>({
    mode: "card",
    clean: true,
    color: null,
  });
  const [customStroke, setCustomStroke] = useState("#1971c2");
  const [customFill, setCustomFill] = useState("#e7f5ff");
  const disabled = !api || viewModeEnabled;
  const components = ARCHITECTURE_COMPONENTS.filter(
    (component) =>
      (category === "All" || component.category === category) &&
      `${component.name} ${component.keywords}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );

  return (
    <div className="architecture-panel">
      <header className="architecture-panel__heading">
        <span className="architecture-panel__eyebrow">DESIGN SYSTEMS</span>
        <h2>Architecture toolkit</h2>
        <p>From a first idea to a connected system.</p>
      </header>
      <div
        className="architecture-panel__sections"
        role="group"
        aria-label="Architecture toolkit sections"
      >
        {["Components", "Templates", "Colors", "From text"].map((name) => (
          <button
            type="button"
            key={name}
            aria-pressed={section === name}
            onClick={() => setSection(name)}
          >
            {name}
          </button>
        ))}
      </div>
      {viewModeEnabled && (
        <p role="status">
          Switch off view mode to add components or change colors.
        </p>
      )}
      {section === "From text" && (
        <TextDiagramPanel api={api} disabled={disabled} options={options} />
      )}

      {section === "Components" && (
        <>
          <label className="architecture-panel__search">
            <span className="architecture-panel__label">Find a component</span>
            <input
              type="search"
              placeholder="Search React, database, cloud…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          <div
            className="architecture-panel__categories"
            role="group"
            aria-label="Component categories"
          >
            {COMPONENT_CATEGORIES.map((name) => (
              <button
                type="button"
                key={name}
                aria-pressed={category === name}
                onClick={() => setCategory(name)}
              >
                {name}
              </button>
            ))}
          </div>
          <div className="architecture-panel__options">
            <label>
              <span>Insert as</span>
              <select
                value={options.mode}
                onChange={(event) =>
                  setOptions({
                    ...options,
                    mode: event.target.value === "icon" ? "icon" : "card",
                  })
                }
              >
                <option value="card">Service card</option>
                <option value="icon">Icon + label</option>
              </select>
            </label>
            <label className="architecture-panel__checkbox">
              <input
                type="checkbox"
                checked={options.clean}
                onChange={(event) =>
                  setOptions({ ...options, clean: event.target.checked })
                }
              />
              Clean lines
            </label>
          </div>
          <div className="architecture-panel__component-grid">
            {components.map((component) => (
              <button
                type="button"
                key={component.id}
                disabled={disabled}
                aria-label={`Add ${component.name}`}
                title={`Add ${component.name} to canvas`}
                onClick={() =>
                  api &&
                  insertArchitectureScene(
                    api,
                    buildArchitectureScene(
                      {
                        id: component.id,
                        name: component.name,
                        description: "",
                        nodes: [
                          {
                            id: component.id,
                            component: component.id,
                            label: component.name,
                            x: 0,
                            y: 0,
                          },
                        ],
                        edges: [],
                      },
                      options,
                    ),
                  )
                }
              >
                <div className="architecture-panel__icon">
                  <img src={svgDataUrl(component.svg)} alt="" />
                </div>
                <span>{component.name}</span>
                <small>{component.category}</small>
              </button>
            ))}
          </div>
          {!components.length && (
            <p className="architecture-panel__empty" role="status">
              No components found. Try another search or category.
            </p>
          )}
          <p className="architecture-panel__hint">
            Click to add. Cards are grouped with their icons; double-click a
            label to rename it.
          </p>
        </>
      )}

      {section === "Templates" && (
        <>
          <p className="architecture-panel__hint">
            Start with editable cards and attached arrows. Templates are added
            beside your existing drawing.
          </p>
          <label className="architecture-panel__checkbox">
            <input
              type="checkbox"
              checked={options.clean}
              onChange={(event) =>
                setOptions({ ...options, clean: event.target.checked })
              }
            />
            Clean lines
          </label>
          <div className="architecture-panel__templates">
            {ARCHITECTURE_TEMPLATES.map((template) => (
              <button
                type="button"
                key={template.id}
                disabled={disabled}
                aria-label={`Insert ${template.name}`}
                onClick={() =>
                  api &&
                  insertArchitectureScene(
                    api,
                    buildArchitectureScene(template, {
                      ...options,
                      mode: "card",
                    }),
                  )
                }
              >
                <div
                  className="architecture-panel__template-preview"
                  aria-hidden="true"
                >
                  {template.nodes.slice(0, 3).map((node, index) => (
                    <span key={node.id}>
                      {index > 0 && (
                        <span className="architecture-panel__preview-arrow">
                          →
                        </span>
                      )}
                      <img
                        src={svgDataUrl(
                          ARCHITECTURE_COMPONENTS.find(
                            (item) => item.id === node.component,
                          )!.svg,
                        )}
                        alt=""
                      />
                    </span>
                  ))}
                </div>
                <strong>{template.name}</strong>
                <span>{template.description}</span>
                <small>
                  {template.nodes.length} components · {template.edges.length}{" "}
                  connections <span aria-hidden="true">↗</span>
                </small>
              </button>
            ))}
          </div>
          <p className="architecture-panel__hint">
            Move a card and its connectors follow. Use the arrow tool to add
            connections and the frame tool to define system boundaries.
          </p>
        </>
      )}

      {section === "Colors" && (
        <>
          <h3>Diagram palette</h3>
          <p className="architecture-panel__hint">
            Apply matching outlines and fills to selected shapes and future
            cards. Technology logos keep their original colors.
          </p>
          <div className="architecture-panel__palette-grid">
            {DIAGRAM_COLORS.map((color) => (
              <button
                type="button"
                key={color.name}
                disabled={disabled}
                aria-pressed={options.color?.stroke === color.stroke}
                onClick={() => {
                  setOptions({ ...options, color });
                  if (api) {
                    colorArchitectureSelection(api, color);
                  }
                }}
              >
                <span
                  className="architecture-panel__swatch"
                  style={{
                    backgroundColor: color.fill,
                    borderColor: color.stroke,
                  }}
                  aria-hidden="true"
                >
                  <span style={{ backgroundColor: color.stroke }} />
                </span>
                {color.name}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="architecture-panel__reset"
            disabled={disabled}
            onClick={() => setOptions({ ...options, color: null })}
          >
            Use technology colors for new cards
          </button>
          <h3>Custom colors</h3>
          <div className="architecture-panel__custom-colors">
            <label>
              Outline
              <input
                type="color"
                value={customStroke}
                onChange={(event) => setCustomStroke(event.target.value)}
                disabled={disabled}
              />
            </label>
            <label>
              Fill
              <input
                type="color"
                value={customFill}
                onChange={(event) => setCustomFill(event.target.value)}
                disabled={disabled}
              />
            </label>
            <button
              type="button"
              disabled={disabled}
              onClick={() => {
                const color = {
                  name: "Custom",
                  stroke: customStroke,
                  fill: customFill,
                };
                setOptions({ ...options, color });
                if (api) {
                  colorArchitectureSelection(api, color);
                }
              }}
            >
              Apply
            </button>
          </div>
          <h3>Canvas background</h3>
          <div className="architecture-panel__canvas-colors">
            {CANVAS_COLORS.map(({ name, color }) => (
              <button
                type="button"
                key={name}
                disabled={disabled}
                title={name}
                aria-label={`${name} canvas background`}
                style={{ backgroundColor: color }}
                onClick={() =>
                  api?.updateScene({
                    appState: { viewBackgroundColor: color },
                    captureUpdate: CaptureUpdateAction.IMMEDIATELY,
                  })
                }
              />
            ))}
          </div>
        </>
      )}

      <div className="architecture-panel__footer">
        <button
          type="button"
          disabled={disabled}
          aria-pressed={gridModeEnabled}
          onClick={() =>
            api?.updateScene({
              appState: { gridModeEnabled: !api.getAppState().gridModeEnabled },
              captureUpdate: CaptureUpdateAction.IMMEDIATELY,
            })
          }
        >
          <span aria-hidden="true">▦</span> Snap to grid{" "}
          <span>{gridModeEnabled ? "On" : "Off"}</span>
        </button>
        <p>Icons are bundled locally and saved with your drawing.</p>
      </div>
    </div>
  );
};
