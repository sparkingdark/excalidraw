import { APP_NAME } from "@excalidraw/common";
import { getCommonBounds, isArrowElement } from "@excalidraw/element";
import { Excalidraw } from "@excalidraw/excalidraw";
import { t } from "@excalidraw/excalidraw/i18n";
import { Keyboard } from "@excalidraw/excalidraw/tests/helpers/ui";
import {
  act,
  fireEvent,
  render,
  screen,
  within,
} from "@excalidraw/excalidraw/tests/test-utils";

import { AppMainMenu } from "../components/AppMainMenu";
import { AppSidebar } from "../components/AppSidebar";
import { AppWelcomeScreen } from "../components/AppWelcomeScreen";
import { ArchitectureTrigger } from "../components/architecture/ArchitectureIcon";
import { buildArchitectureScene } from "../components/architecture/scene";
import {
  parseTextDiagram,
  TEXT_DIAGRAM_EXAMPLE,
} from "../components/architecture/textDiagram";
import { getDiagramObjects } from "../components/diagram/objects";

const { h } = window;

describe("NeoDraw text diagrams", () => {
  it("deduplicates shared components and lays out connected chains", () => {
    const diagram = parseTextDiagram(TEXT_DIAGRAM_EXAMPLE);
    expect(diagram.nodes).toHaveLength(4);
    expect(diagram.edges).toHaveLength(3);
    expect(diagram.nodes.map((node) => node.component)).toEqual([
      "react",
      "nodejs",
      "postgresql",
      "redis",
    ]);
    expect(diagram.nodes[0].x).toBeLessThan(diagram.nodes[1].x);
    expect(diagram.nodes[1].x).toBeLessThan(diagram.nodes[2].x);
    expect(diagram.nodes[2].y).not.toBe(diagram.nodes[3].y);
    expect(parseTextDiagram("A -> B\nA -> B").edges).toHaveLength(1);
  });

  it("supports vertical layouts, disconnected objects, explicit hints and cycles", () => {
    const vertical = parseTextDiagram(
      "Client -> API -> Database\nUser",
      "down",
    );
    expect(vertical.nodes[0].y).toBeLessThan(vertical.nodes[1].y);
    expect(vertical.nodes[1].y).toBeLessThan(vertical.nodes[2].y);
    const diagram = parseTextDiagram("A -> B -> C\nC -> A\nA [react]");
    expect(diagram.nodes[0].component).toBe("react");
    const scene = buildArchitectureScene(diagram, {
      mode: "card",
      color: null,
      clean: true,
    });
    for (const arrow of scene.elements.filter(isArrowElement)) {
      expect(arrow.startBinding).not.toBeNull();
      expect(arrow.endBinding).not.toBeNull();
      expect(Number.isFinite(arrow.x) && Number.isFinite(arrow.y)).toBe(true);
    }
    expect(
      new Set(diagram.nodes.map((node) => `${node.x},${node.y}`)).size,
    ).toBe(3);
  });

  it.each(["", "A ->", "A -> A", "A [unknown] -> B", "A [react]\nA [nodejs]"])(
    "rejects invalid input: %s",
    (text) => {
      expect(() => parseTextDiagram(text)).toThrow();
    },
  );

  it("bounds diagram size and accepts comments", () => {
    expect(parseTextDiagram("# description\nA → B").nodes).toHaveLength(2);
    expect(() =>
      parseTextDiagram(
        Array.from({ length: 51 }, (_, index) => `Node ${index}`).join("\n"),
      ),
    ).toThrow(/50 components/);
  });
});

describe("NeoDraw editor tools", () => {
  const renderNeoDraw = async () => {
    return render(
      <Excalidraw
        handleKeyboardGlobally
        renderTopRightUI={() => <ArchitectureTrigger />}
      >
        <AppMainMenu
          onCollabDialogOpen={() => {}}
          isCollaborating={false}
          isCollabEnabled={false}
          theme="light"
          refresh={() => {}}
        />
        <AppWelcomeScreen
          onCollabDialogOpen={() => {}}
          isCollabEnabled={false}
        />
        <AppSidebar />
      </Excalidraw>,
    );
  };
  const openToolkit = () =>
    fireEvent.click(
      screen.getByRole("button", { name: "Architecture toolkit" }),
    );
  const selectTab = (name: string) =>
    fireEvent.mouseDown(screen.getByRole("tab", { name }), {
      button: 0,
      ctrlKey: false,
    });

  it("shows NeoDraw branding and removes paid-service promotions", async () => {
    const { container } = await renderNeoDraw();
    expect(APP_NAME).toBe("NeoDraw");
    expect(screen.getByText("NeoDraw")).toBeInTheDocument();
    expect(t("labels.installPWA")).toContain("NeoDraw");
    expect(t("labels.madeWithExcalidraw")).toBe("Made with NeoDraw");
    expect(t("errors.fileTooBig", { maxSize: "Excalidraw sample" })).toContain(
      "Excalidraw sample",
    );
    fireEvent.click(container.querySelector(".dropdown-menu-button")!);
    expect(
      screen.getByRole("menuitem", { name: "Objects" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("menuitem", { name: "Arrange" }),
    ).toBeInTheDocument();
    expect(screen.queryByText("Excalidraw+")).not.toBeInTheDocument();
    expect(
      Array.from(container.querySelectorAll("a")).some(
        (link) =>
          link.href.includes("plus.excalidraw.com") ||
          link.href.includes("app.excalidraw.com"),
      ),
    ).toBe(false);
  });

  it("generates an editable diagram from text, validates input and supports undo", async () => {
    await renderNeoDraw();
    openToolkit();
    fireEvent.click(screen.getByRole("button", { name: "From text" }));
    const input = screen.getByRole("textbox", { name: "Diagram description" });
    fireEvent.change(input, { target: { value: "Client ->" } });
    expect(
      screen.getByRole("button", { name: "Generate diagram" }),
    ).toBeDisabled();
    fireEvent.change(input, { target: { value: TEXT_DIAGRAM_EXAMPLE } });
    fireEvent.click(screen.getByRole("button", { name: "Generate diagram" }));
    expect(
      h.elements.filter((element) => element.type === "rectangle"),
    ).toHaveLength(4);
    expect(h.elements.filter(isArrowElement)).toHaveLength(3);
    Keyboard.undo();
    expect(h.elements.filter((element) => !element.isDeleted)).toHaveLength(0);
    Keyboard.redo();
    expect(
      h.elements.filter(
        (element) => element.type === "rectangle" && !element.isDeleted,
      ),
    ).toHaveLength(4);
  });

  it("navigates and locks a whole card with its icon and label, with undo", async () => {
    const { container } = await renderNeoDraw();
    openToolkit();
    fireEvent.click(screen.getByRole("button", { name: "Add React" }));
    expect(getDiagramObjects(h.elements)).toHaveLength(1);
    selectTab("Objects");
    fireEvent.change(
      screen.getByRole("searchbox", { name: "Search objects" }),
      { target: { value: "react" } },
    );
    fireEvent.click(screen.getByRole("button", { name: "Lock React" }));
    expect(h.elements.every((element) => element.locked)).toBe(true);
    expect(Object.keys(h.state.selectedElementIds)).toHaveLength(0);
    Keyboard.undo();
    expect(h.elements.every((element) => !element.locked)).toBe(true);
    fireEvent.click(screen.getByRole("button", { name: "Select React" }));
    expect(
      h.elements.every((element) => h.state.selectedElementIds[element.id]),
    ).toBe(true);
    fireEvent.click(screen.getByRole("button", { name: "Lock React" }));
    fireEvent.click(screen.getByRole("button", { name: "Select React" }));
    expect(h.state.activeLockedId).toBe(getDiagramObjects(h.elements)[0].id);
    fireEvent.click(container.querySelector(".UnlockPopup")!);
    expect(h.elements.every((element) => !element.locked)).toBe(true);
    fireEvent.click(screen.getByRole("button", { name: "Lock React" }));
    fireEvent.click(screen.getByRole("button", { name: "Unlock React" }));
    expect(h.elements.every((element) => !element.locked)).toBe(true);
  });

  it("duplicates grouped cards and restores the scene with undo", async () => {
    await renderNeoDraw();
    openToolkit();
    fireEvent.click(screen.getByRole("button", { name: "Add React" }));
    selectTab("Arrange");
    fireEvent.click(
      within(screen.getByRole("tabpanel")).getByRole("button", {
        name: "Duplicate",
      }),
    );
    const objects = getDiagramObjects(h.elements);
    expect(objects).toHaveLength(2);
    expect(objects.every((object) => object.elements.length === 3)).toBe(true);
    const cards = h.elements.filter((element) => element.type === "rectangle");
    expect(new Set(cards.map((element) => element.groupIds[0])).size).toBe(2);
    for (const card of cards) {
      const text = h.elements.find(
        (element) => element.type === "text" && element.containerId === card.id,
      );
      expect(text).toBeDefined();
      expect(card.boundElements?.some((bound) => bound.id === text!.id)).toBe(
        true,
      );
    }
    Keyboard.undo();
    expect(getDiagramObjects(h.elements)).toHaveLength(1);
  });

  it("aligns selected cards while preserving grouped icon offsets and supports undo", async () => {
    await renderNeoDraw();
    openToolkit();
    fireEvent.click(screen.getByRole("button", { name: "Add React" }));
    fireEvent.click(screen.getByRole("button", { name: "Add Docker" }));
    selectTab("Objects");
    fireEvent.click(screen.getByRole("button", { name: "Select React" }));
    fireEvent.click(screen.getByRole("button", { name: "Select Docker" }), {
      shiftKey: true,
    });
    const originalX = h.elements.map((element) => element.x);
    const imageOffsets = new Map(
      getDiagramObjects(h.elements).map((object) => {
        const image = object.elements.find(
          (element) => element.type === "image",
        )!;
        const card = object.elements.find(
          (element) => element.type === "rectangle",
        )!;
        return [object.id, image.x - card.x];
      }),
    );
    selectTab("Arrange");
    fireEvent.click(screen.getByRole("button", { name: "Left" }));
    const aligned = getDiagramObjects(h.elements);
    expect(getCommonBounds(aligned[0].elements)[0]).toBe(
      getCommonBounds(aligned[1].elements)[0],
    );
    for (const object of aligned) {
      const image = object.elements.find(
        (element) => element.type === "image",
      )!;
      const card = object.elements.find(
        (element) => element.type === "rectangle",
      )!;
      expect(image.x - card.x).toBeCloseTo(imageOffsets.get(object.id)!);
    }
    Keyboard.undo();
    expect(h.elements.map((element) => element.x)).toEqual(originalX);
  });

  it("prevents object locking and arrangement in view mode", async () => {
    await renderNeoDraw();
    openToolkit();
    fireEvent.click(screen.getByRole("button", { name: "Add React" }));
    act(() => h.setState({ viewModeEnabled: true }));
    selectTab("Objects");
    expect(screen.getByRole("button", { name: "Lock React" })).toBeDisabled();
    selectTab("Arrange");
    expect(screen.getByRole("button", { name: "Duplicate" })).toBeDisabled();
  });
});
