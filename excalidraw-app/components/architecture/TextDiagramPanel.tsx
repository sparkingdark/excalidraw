import { useMemo, useState } from "react";

import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";

import { buildArchitectureScene, insertArchitectureScene } from "./scene";
import { parseTextDiagram, TEXT_DIAGRAM_EXAMPLE } from "./textDiagram";

import type { ArchitectureOptions } from "./scene";

export const TextDiagramPanel = ({
  api,
  disabled,
  options,
}: {
  api: ExcalidrawImperativeAPI | null;
  disabled: boolean;
  options: ArchitectureOptions;
}) => {
  const [text, setText] = useState(TEXT_DIAGRAM_EXAMPLE);
  const [direction, setDirection] = useState<"right" | "down">("right");
  const parsed = useMemo(() => {
    try {
      return { diagram: parseTextDiagram(text, direction), error: null };
    } catch (error) {
      return { diagram: null, error: (error as Error).message };
    }
  }, [text, direction]);
  return (
    <section className="architecture-panel__text-diagram">
      <h3>Turn connections into a diagram</h3>
      <p className="architecture-panel__hint">
        Write one connection or chain per line. Repeated labels share a card.
        Add [react], [nodejs], [postgresql] or another technology ID to choose
        an icon.
      </p>
      <label
        className="architecture-panel__label"
        htmlFor={`${api?.id ?? "neodraw"}-diagram-text`}
      >
        Diagram description
      </label>
      <textarea
        id={`${api?.id ?? "neodraw"}-diagram-text`}
        value={text}
        onChange={(event) => setText(event.target.value)}
        rows={9}
        spellCheck={false}
        aria-invalid={!!parsed.error}
        aria-describedby={`${api?.id ?? "neodraw"}-diagram-status`}
      />
      <label className="architecture-panel__direction">
        Direction
        <select
          value={direction}
          onChange={(event) =>
            setDirection(event.target.value === "down" ? "down" : "right")
          }
        >
          <option value="right">Left to right</option>
          <option value="down">Top to bottom</option>
        </select>
      </label>
      <p
        id={`${api?.id ?? "neodraw"}-diagram-status`}
        role="status"
        className="architecture-panel__hint"
      >
        {parsed.error ??
          `${parsed.diagram!.nodes.length} components · ${
            parsed.diagram!.edges.length
          } connections`}
      </p>
      <button
        type="button"
        className="architecture-panel__primary"
        disabled={disabled || !parsed.diagram}
        onClick={() =>
          api &&
          parsed.diagram &&
          insertArchitectureScene(
            api,
            buildArchitectureScene(parsed.diagram, {
              ...options,
              mode: "card",
            }),
          )
        }
      >
        Generate diagram
      </button>
      <p className="architecture-panel__hint">
        Generated locally, with editable labels and attached connectors. Your
        existing drawing stays on the canvas.
      </p>
    </section>
  );
};
