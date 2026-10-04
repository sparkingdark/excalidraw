import { isFrameLikeElement } from "@excalidraw/element";

import type { ExcalidrawElement } from "@excalidraw/element/types";

export type DiagramObject = {
  id: string;
  name: string;
  type: string;
  elements: ExcalidrawElement[];
  locked: boolean;
};

/** Grouped cards and bound labels are one navigable object, not separate rows. */
export const getDiagramObjects = (
  elements: readonly ExcalidrawElement[],
): DiagramObject[] => {
  const visible = elements.filter((element) => !element.isDeleted);
  const byId = new Map(visible.map((element) => [element.id, element]));
  const keyFor = (element: ExcalidrawElement) =>
    element.groupIds.at(-1) ?? element.id;
  const objects = new Map<string, DiagramObject>();
  for (const element of visible) {
    const container =
      element.type === "text" && element.containerId
        ? byId.get(element.containerId)
        : null;
    const id = keyFor(container ?? element);
    const object = objects.get(id) ?? {
      id,
      name: "",
      type: "",
      elements: [],
      locked: false,
    };
    object.elements.push(element);
    object.locked ||= element.locked;
    objects.set(id, object);
  }
  for (const object of objects.values()) {
    const primary =
      object.elements.find((element) => element.type !== "text") ??
      object.elements[0];
    const label = object.elements.find((element) => element.type === "text");
    object.name =
      (isFrameLikeElement(primary) ? primary.name : null) ||
      (label?.type === "text"
        ? label.text.replace(/\s+/g, " ").slice(0, 100)
        : null) ||
      primary.type.replace("stickynote", "Sticky note");
    object.type = primary.groupIds.length ? "Group" : primary.type;
  }
  return Array.from(objects.values()).reverse();
};
