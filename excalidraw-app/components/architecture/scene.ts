import {
  FONT_FAMILY,
  ROUNDNESS,
  isColorDark,
  randomId,
} from "@excalidraw/common";
import {
  convertToExcalidrawElements,
  getCommonBounds,
  getSelectedElements,
  newElementWith,
} from "@excalidraw/element";
import { CaptureUpdateAction } from "@excalidraw/excalidraw";

import type { ExcalidrawElementSkeleton } from "@excalidraw/element";
import type { ExcalidrawElement, FileId } from "@excalidraw/element/types";
import type {
  BinaryFileData,
  ExcalidrawImperativeAPI,
} from "@excalidraw/excalidraw/types";

import { ARCHITECTURE_COMPONENTS, svgDataUrl } from "./catalog";

import type { ArchitectureTemplate, DiagramColor } from "./catalog";

export type ArchitectureOptions = {
  mode: "card" | "icon";
  clean: boolean;
  color: DiagramColor | null;
};

const CARD_WIDTH = 184;
const CARD_HEIGHT = 116;

export const buildArchitectureScene = (
  template: ArchitectureTemplate,
  options: ArchitectureOptions,
) => {
  const skeletons: ExcalidrawElementSkeleton[] = [];
  const files = new Map<FileId, BinaryFileData>();
  // Every insertion gets its own groups; repeated templates remain independent.
  const nodeIds = new Map(template.nodes.map((node) => [node.id, randomId()]));

  for (const node of template.nodes) {
    const component = ARCHITECTURE_COMPONENTS.find(
      (item) => item.id === node.component,
    );
    if (!component) {
      throw new Error(`Unknown architecture component: ${node.component}`);
    }
    const groupIds = [randomId()];
    const backgroundColor = options.color?.fill ?? component.fill;
    const fileId = `architecture-${component.id}-v1` as FileId;
    files.set(fileId, {
      id: fileId,
      mimeType: "image/svg+xml",
      dataURL: svgDataUrl(component.svg),
      created: Date.now(),
    });

    if (options.mode === "card") {
      skeletons.push({
        id: nodeIds.get(node.id),
        type: "rectangle",
        x: node.x,
        y: node.y,
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        strokeColor: options.color?.stroke ?? component.stroke,
        backgroundColor,
        fillStyle: "solid",
        strokeWidth: 1.5,
        roughness: options.clean ? 0 : 1,
        roundness: { type: ROUNDNESS.ADAPTIVE_RADIUS },
        groupIds,
        label: {
          text: node.label,
          fontFamily: FONT_FAMILY.Helvetica,
          fontSize: 16,
          strokeColor: isColorDark(backgroundColor) ? "#ffffff" : "#1e1e1e",
          verticalAlign: "bottom",
          groupIds,
        },
      });
    } else {
      skeletons.push({
        type: "text",
        text: node.label,
        x: node.x,
        y: node.y + 74,
        width: CARD_WIDTH,
        autoResize: false,
        textAlign: "center",
        fontFamily: FONT_FAMILY.Helvetica,
        fontSize: 16,
        strokeColor: "#1e1e1e",
        groupIds,
      });
    }
    skeletons.push({
      type: "image",
      x: node.x + (CARD_WIDTH - 48) / 2,
      y: node.y + 16,
      width: 48,
      height: 48,
      fileId,
      status: "saved",
      groupIds,
    });
  }

  // Templates always use cards, so arrows can stay attached as cards move.
  if (options.mode === "card") {
    for (const edge of template.edges) {
      const from = template.nodes.find((node) => node.id === edge.from);
      const to = template.nodes.find((node) => node.id === edge.to);
      if (!from || !to) {
        throw new Error("Architecture connector has an unknown endpoint");
      }
      const vertical = from.x === to.x;
      const forward = vertical ? to.y > from.y : to.x > from.x;
      const x =
        from.x + (vertical ? CARD_WIDTH / 2 : forward ? CARD_WIDTH + 8 : -8);
      const y =
        from.y +
        (vertical ? (forward ? CARD_HEIGHT + 8 : -8) : CARD_HEIGHT / 2);
      const endX =
        to.x + (vertical ? CARD_WIDTH / 2 : forward ? -8 : CARD_WIDTH + 8);
      const endY =
        to.y + (vertical ? (forward ? -8 : CARD_HEIGHT + 8) : CARD_HEIGHT / 2);
      skeletons.push({
        type: "arrow",
        x,
        y,
        width: endX - x,
        height: endY - y,
        start: { id: nodeIds.get(from.id)! },
        end: { id: nodeIds.get(to.id)! },
        strokeColor: "#64748b",
        strokeWidth: 1.5,
        roughness: options.clean ? 0 : 1,
        label: {
          text: edge.label,
          fontSize: 14,
          fontFamily: FONT_FAMILY.Helvetica,
          strokeColor: "#475569",
        },
      });
    }
  }

  return {
    elements: convertToExcalidrawElements(skeletons),
    files: Array.from(files.values()),
  };
};

export const insertArchitectureScene = (
  api: ExcalidrawImperativeAPI,
  scene: ReturnType<typeof buildArchitectureScene>,
) => {
  if (api.getAppState().viewModeEnabled) {
    return;
  }
  const existing = api.getSceneElements();
  const state = api.getAppState();
  const [minX, minY, maxX, maxY] = getCommonBounds(scene.elements);
  const x = existing.length
    ? getCommonBounds(existing)[2] + 96 - minX
    : state.width / state.zoom.value / 2 - state.scrollX - (maxX + minX) / 2;
  const y = existing.length
    ? getCommonBounds(existing)[1] - minY
    : state.height / state.zoom.value / 2 - state.scrollY - (maxY + minY) / 2;
  const elements = scene.elements.map((element) =>
    newElementWith(element, { x: element.x + x, y: element.y + y }),
  );

  api.addFiles(scene.files);
  api.setActiveTool({ type: "selection" });
  api.updateScene({
    elements: [...api.getSceneElementsIncludingDeleted(), ...elements],
    appState: {
      selectedElementIds: Object.fromEntries(
        elements
          .filter((element) => element.type !== "text" || !element.containerId)
          .map((element) => [element.id, true]),
      ),
      selectedGroupIds: Object.fromEntries(
        elements.flatMap((element) => element.groupIds.map((id) => [id, true])),
      ),
      editingGroupId: null,
    },
    captureUpdate: CaptureUpdateAction.IMMEDIATELY,
  });
  api.setViewport({
    target: getCommonBounds(elements),
    fit: "scale-down",
    offsets: { ui: true },
  });
  api.setToast({
    message: "Added to canvas. Drag to move; double-click a label to edit.",
  });
};

export const colorArchitectureSelection = (
  api: ExcalidrawImperativeAPI,
  color: DiagramColor,
) => {
  if (api.getAppState().viewModeEnabled) {
    return;
  }
  const selected = new Set(
    getSelectedElements(api.getSceneElements(), api.getAppState(), {
      includeBoundTextElement: true,
    }).map((element) => element.id),
  );
  const elementsMap = api.getSceneElementsMapIncludingDeleted();
  const elements = api
    .getSceneElementsIncludingDeleted()
    .map((element): ExcalidrawElement => {
      if (
        !selected.has(element.id) ||
        element.type === "image" ||
        element.type === "frame" ||
        element.type === "magicframe"
      ) {
        return element;
      }
      if (element.type === "text") {
        const container = element.containerId
          ? elementsMap.get(element.containerId)
          : null;
        const textBackground =
          container && selected.has(container.id)
            ? color.fill
            : container?.backgroundColor ?? "transparent";
        return newElementWith(element, {
          strokeColor: element.containerId
            ? container?.type !== "arrow" && isColorDark(textBackground)
              ? "#ffffff"
              : "#1e1e1e"
            : color.stroke,
        });
      }
      if (
        element.type === "arrow" ||
        element.type === "line" ||
        element.type === "freedraw"
      ) {
        return newElementWith(element, { strokeColor: color.stroke });
      }
      return newElementWith(element, {
        strokeColor: color.stroke,
        backgroundColor: color.fill,
        fillStyle: "solid",
      });
    });
  api.updateScene({
    elements,
    appState: {
      currentItemStrokeColor: color.stroke,
      currentItemBackgroundColor: color.fill,
      currentItemFillStyle: "solid",
    },
    captureUpdate: CaptureUpdateAction.IMMEDIATELY,
  });
  api.setToast({
    message: `${color.name} colors applied${
      selected.size ? " to selection" : " to new shapes"
    }.`,
  });
};
