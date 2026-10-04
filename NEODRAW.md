# NeoDraw

NeoDraw is a local-first drawing canvas with technology icons and editable architecture diagrams.

## Run locally

Use Node.js 18 or newer and Yarn 1.22.22. From this directory:

```sh
yarn install
yarn start
```

Open http://localhost:3001. The port is configured in `.env.development`.

## Diagram tools

- **Architecture → Components:** search 23 technology and infrastructure icons. Insert an editable service card or an icon with a label. Icons are bundled locally.
- **Architecture → Templates:** start with cloud applications, data pipelines, network gateways, web applications, event-driven services, or container delivery.
- **Architecture → Colors:** apply preset or custom colors to selected shapes, choose a canvas background, and toggle the grid. Technology logos keep their original colors.
- **Architecture → From text:** generate connected, editable diagrams with automatic layout. Choose horizontal or vertical flow. Repeat a label to connect to the same component.
- **Objects:** search labels and shape types, jump to objects, fit the canvas, and lock or unlock objects. Shift-click rows to select several objects.
- **Arrange:** align, distribute, change stacking order, group, ungroup, duplicate, or lock a selection. Alignment requires two objects; even spacing requires three.

For example, paste this into **From text**:

```text
Web client [react] -> API [nodejs] -> Database [postgresql]
API -> Cache [redis]
```

Technology hints use component IDs from the toolkit, such as `docker`, `kubernetes`, `amazonwebservices`, `googlecloud`, `azure`, or `python`. Lines beginning with `#` are comments. The format supports up to 50 components and 100 connections.

Diagram insertion and arrangement support the editor's undo and redo. The side panels scroll independently of the canvas. Objects and Arrange are also accessible from the main menu and command palette.

## Feature research

The text input and arrangement controls were informed by [draw.io's text diagrams](https://www.drawio.com/docs/manual/insert/insert-from-text/) and [alignment tools](https://www.drawio.com/docs/manual/editor/alignment-tools/). Architecture templates and technology icons were informed by [Lucidchart's architecture workflow](https://lucid.co/blog/how-to-build-aws-architecture-diagrams).

## Compatibility and attribution

NeoDraw uses the Excalidraw editor engine and retains its compatible scene and library formats. Upstream copyright and MIT license notices remain in `LICENSE`. Technology icons come from Devicon; their license and source details are in `excalidraw-app/components/architecture/icons/`.

Collaboration, remote sharing, and AI features depend on the existing environment configuration. The architecture toolkit and text generator work locally without an AI service.
