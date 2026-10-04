import { getCommonBounds, isArrowElement } from "@excalidraw/element";
import { Excalidraw } from "@excalidraw/excalidraw";
import { dataURLToFile } from "@excalidraw/excalidraw/data/blob";
import { Keyboard } from "@excalidraw/excalidraw/tests/helpers/ui";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@excalidraw/excalidraw/tests/test-utils";

import { AppSidebar } from "../components/AppSidebar";
import { AppWelcomeScreen } from "../components/AppWelcomeScreen";
import { ArchitectureTrigger } from "../components/architecture/ArchitectureIcon";
import {
  ARCHITECTURE_COMPONENTS,
  ARCHITECTURE_TEMPLATES,
} from "../components/architecture/catalog";
import { buildArchitectureScene } from "../components/architecture/scene";

const { h } = window;

describe("Architecture toolkit", () => {
  it.each(ARCHITECTURE_TEMPLATES)(
    "builds $name with valid bound connectors and embedded icons",
    (template) => {
      const scene = buildArchitectureScene(template, {
        mode: "card",
        clean: true,
        color: null,
      });
      const arrows = scene.elements.filter(isArrowElement);
      expect(arrows).toHaveLength(template.edges.length);
      const ids = new Set(scene.elements.map((element) => element.id));
      for (const arrow of arrows) {
        expect(ids.has(arrow.startBinding!.elementId)).toBe(true);
        expect(ids.has(arrow.endBinding!.elementId)).toBe(true);
        for (const binding of [arrow.startBinding!, arrow.endBinding!]) {
          const container = scene.elements.find(
            (element) => element.id === binding.elementId,
          )!;
          expect(container.boundElements).toContainEqual({
            id: arrow.id,
            type: "arrow",
          });
        }
      }
      for (const image of scene.elements.filter(
        (element) => element.type === "image",
      )) {
        const file = scene.files.find((item) => item.id === image.fileId)!;
        // Exercise the same base64 decoding used when exporting saved images.
        expect(dataURLToFile(file.dataURL).type).toBe("image/svg+xml");
        expect(dataURLToFile(file.dataURL).size).toBeGreaterThan(100);
        expect(image.groupIds).toHaveLength(1);
        expect(
          scene.elements.some(
            (element) =>
              element.type === "rectangle" &&
              element.groupIds[0] === image.groupIds[0],
          ),
        ).toBe(true);
      }
      const another = buildArchitectureScene(template, {
        mode: "card",
        clean: true,
        color: null,
      });
      expect(another.elements.some((element) => ids.has(element.id))).toBe(
        false,
      );
      const groups = new Set(
        scene.elements.flatMap((element) => element.groupIds),
      );
      expect(
        another.elements.some((element) =>
          element.groupIds.some((id) => groups.has(id)),
        ),
      ).toBe(false);
    },
  );

  it("bundles every technology and infrastructure icon as a valid SVG image", () => {
    for (const component of ARCHITECTURE_COMPONENTS) {
      const scene = buildArchitectureScene(
        {
          id: component.id,
          name: component.name,
          description: "",
          nodes: [
            {
              id: "node",
              component: component.id,
              label: component.name,
              x: 0,
              y: 0,
            },
          ],
          edges: [],
        },
        { mode: "icon", clean: true, color: null },
      );
      expect(
        scene.elements.filter((element) => element.type === "rectangle"),
      ).toHaveLength(0);
      expect(
        scene.elements.filter((element) => element.type === "text"),
      ).toHaveLength(1);
      expect(scene.files[0].dataURL).toMatch(/^data:image\/svg\+xml;base64,/);
      expect(dataURLToFile(scene.files[0].dataURL).size).toBeGreaterThan(100);
    }
  });

  const renderToolkit = async (viewModeEnabled = false) => {
    await render(
      <Excalidraw
        handleKeyboardGlobally={true}
        initialData={{ appState: { viewModeEnabled } }}
        renderTopRightUI={() => <ArchitectureTrigger />}
      >
        <AppSidebar />
      </Excalidraw>,
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Architecture toolkit" }),
    );
    await waitFor(() =>
      expect(
        screen.getByText("From a first idea to a connected system."),
      ).toBeInTheDocument(),
    );
  };

  it("opens the toolkit, searches aliases and inserts a grouped technology card", async () => {
    await renderToolkit();
    fireEvent.change(screen.getByRole("searchbox"), {
      target: { value: "k8s" },
    });
    expect(
      screen.queryByRole("button", { name: "Add React" }),
    ).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Add Kubernetes" }));
    await waitFor(() =>
      expect(h.elements.filter((element) => !element.isDeleted)).toHaveLength(
        3,
      ),
    );
    const image = h.elements.find((element) => element.type === "image")!;
    expect(h.app.files[image.fileId!].dataURL).toMatch(
      /^data:image\/svg\+xml;base64,/,
    );
    expect(
      h.elements.every((element) => element.groupIds[0] === image.groupIds[0]),
    ).toBe(true);
  });

  it("adds repeated templates without overlapping existing content and supports undo/redo", async () => {
    await renderToolkit();
    fireEvent.click(screen.getByRole("button", { name: "Templates" }));
    fireEvent.click(
      screen.getByRole("button", { name: "Insert Web application" }),
    );
    const original = [...h.elements];
    const originalIds = new Set(original.map((element) => element.id));
    expect(original.filter((element) => element.type === "arrow")).toHaveLength(
      3,
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Insert Web application" }),
    );
    const added = h.elements.filter((element) => !originalIds.has(element.id));
    expect(getCommonBounds(added)[0]).toBeGreaterThan(
      getCommonBounds(original)[2],
    );
    expect(original.every((element) => h.elements.includes(element))).toBe(
      true,
    );
    Keyboard.undo();
    expect(
      h.elements
        .filter((element) => !element.isDeleted)
        .map((element) => element.id),
    ).toEqual(original.map((element) => element.id));
    Keyboard.redo();
    expect(h.elements.filter((element) => !element.isDeleted)).toHaveLength(
      original.length + added.length,
    );
  });

  it("applies colors to the selection without recoloring logos, with undo", async () => {
    await renderToolkit();
    fireEvent.click(screen.getByRole("button", { name: "Add React" }));
    const originalCard = h.elements.find(
      (element) => element.type === "rectangle",
    )!;
    const originalImage = h.elements.find(
      (element) => element.type === "image",
    )!;
    fireEvent.click(screen.getByRole("button", { name: "Colors" }));
    fireEvent.click(screen.getByRole("button", { name: "Rose" }));
    expect(
      h.elements.find((element) => element.id === originalCard.id),
    ).toMatchObject({ strokeColor: "#c2255c", backgroundColor: "#fff0f6" });
    expect(h.elements.find((element) => element.id === originalImage.id)).toBe(
      originalImage,
    );
    expect(
      h.elements.find((element) => element.type === "text")?.strokeColor,
    ).toBe("#1e1e1e");
    Keyboard.undo();
    expect(
      h.elements.find((element) => element.id === originalCard.id),
    ).toMatchObject({
      strokeColor: originalCard.strokeColor,
      backgroundColor: originalCard.backgroundColor,
    });
  });

  it("changes the canvas background and grid, and prevents edits in view mode", async () => {
    await renderToolkit();
    fireEvent.click(screen.getByRole("button", { name: "Snap to grid Off" }));
    expect(h.state.gridModeEnabled).toBe(true);
    fireEvent.click(screen.getByRole("button", { name: "Colors" }));
    fireEvent.click(
      screen.getByRole("button", { name: "Mint canvas background" }),
    );
    expect(h.state.viewBackgroundColor).toBe("#f0fdf4");
    act(() => h.setState({ viewModeEnabled: true }));
    expect(screen.getByRole("button", { name: "Rose" })).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Snap to grid On" }),
    ).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: "Components" }));
    expect(screen.getByRole("button", { name: "Add React" })).toBeDisabled();
  });
  it("opens from the welcome screen and can insert an icon without a service card", async () => {
    await render(
      <Excalidraw>
        <AppSidebar />
        <AppWelcomeScreen
          onCollabDialogOpen={() => {}}
          isCollabEnabled={false}
        />
      </Excalidraw>,
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Design an architecture" }),
    );
    fireEvent.change(screen.getByRole("combobox", { name: "Insert as" }), {
      target: { value: "icon" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Add Docker" }));
    expect(h.elements.map((element) => element.type).sort()).toEqual([
      "image",
      "text",
    ]);
  });

  it("keeps labels readable with a dark custom fill and uses it for future cards", async () => {
    await renderToolkit();
    fireEvent.click(screen.getByRole("button", { name: "Add React" }));
    fireEvent.click(screen.getByRole("button", { name: "Colors" }));
    fireEvent.change(screen.getByLabelText("Fill"), {
      target: { value: "#172554" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Apply" }));
    expect(
      h.elements.find((element) => element.type === "text")?.strokeColor,
    ).toBe("#ffffff");
    const previousIds = new Set(h.elements.map((element) => element.id));
    fireEvent.click(screen.getByRole("button", { name: "Components" }));
    fireEvent.click(screen.getByRole("button", { name: "Add Node.js" }));
    const added = h.elements.filter((element) => !previousIds.has(element.id));
    expect(
      added.find((element) => element.type === "rectangle")?.backgroundColor,
    ).toBe("#172554");
    expect(added.find((element) => element.type === "text")?.strokeColor).toBe(
      "#ffffff",
    );
  });
});
