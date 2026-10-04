import { ARCHITECTURE_COMPONENTS } from "./catalog";

import type { ArchitectureTemplate } from "./catalog";

export const TEXT_DIAGRAM_EXAMPLE =
  "Web client [react] -> API [nodejs] -> Database [postgresql]\nAPI -> Cache [redis]";

/** A deliberately small, offline format: chains of labels, with optional [technology] hints. */
export const parseTextDiagram = (
  text: string,
  direction: "right" | "down" = "right",
): ArchitectureTemplate => {
  if (text.length > 10000) {
    throw new Error("Keep the description under 10,000 characters.");
  }
  const nodes = new Map<
    string,
    { id: string; label: string; component: string; explicit: boolean }
  >();
  const edges = new Map<string, ArchitectureTemplate["edges"][number]>();
  const inferComponent = (label: string) => {
    const normalized = label.toLowerCase();
    const exact = ARCHITECTURE_COMPONENTS.find(
      (item) =>
        item.name.toLowerCase() === normalized || item.id === normalized,
    );
    if (exact) {
      return exact.id;
    }
    if (/client|browser|frontend|website/.test(normalized)) {
      return "browser";
    }
    if (/database|\bdb\b/.test(normalized)) {
      return "database";
    }
    if (/queue|event|broker/.test(normalized)) {
      return "queue";
    }
    if (/bucket|storage|files/.test(normalized)) {
      return "storage";
    }
    if (/user|customer/.test(normalized)) {
      return "user";
    }
    return "service";
  };

  text.split(/\r?\n/).forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      return;
    }
    const chain = trimmed.split(/->|→/).map((token) => {
      const match = token
        .trim()
        .match(/^([^[\]]+?)(?:\s*\[([a-zA-Z0-9_-]+)\])?$/);
      if (!match) {
        throw new Error(
          `Line ${index + 1}: use Label [technology] -> Other label.`,
        );
      }
      const label = match[1].trim().replace(/\s+/g, " ");
      if (!label || label.length > 80) {
        throw new Error(
          `Line ${index + 1}: labels must contain 1–80 characters.`,
        );
      }
      const hint = match[2]?.toLowerCase();
      if (hint && !ARCHITECTURE_COMPONENTS.some((item) => item.id === hint)) {
        throw new Error(
          `Line ${
            index + 1
          }: unknown technology "${hint}". Try react, nodejs, postgresql, redis or a component name from the toolkit.`,
        );
      }
      const key = label.toLowerCase();
      const existing = nodes.get(key);
      if (existing) {
        if (hint && existing.explicit && hint !== existing.component) {
          throw new Error(
            `Line ${index + 1}: "${label}" has conflicting technology hints.`,
          );
        }
        if (hint) {
          existing.component = hint;
          existing.explicit = true;
        }
        return existing.id;
      }
      const node = {
        id: `text-node-${nodes.size}`,
        label,
        component: hint ?? inferComponent(label),
        explicit: !!hint,
      };
      nodes.set(key, node);
      if (nodes.size > 50) {
        throw new Error("Use at most 50 components per diagram.");
      }
      return node.id;
    });
    for (let i = 1; i < chain.length; i++) {
      const from = chain[i - 1];
      const to = chain[i];
      if (from === to) {
        throw new Error(
          `Line ${
            index + 1
          }: a connection needs two different component labels.`,
        );
      }
      edges.set(`${from}:${to}`, { from, to, label: "" });
      if (edges.size > 100) {
        throw new Error("Use at most 100 connections per diagram.");
      }
    }
  });
  if (!nodes.size) {
    throw new Error(
      "Add a component or a connection, for example Client -> API -> Database.",
    );
  }

  const entries = Array.from(nodes.values());
  const incoming = new Map(entries.map((node) => [node.id, 0]));
  const outgoing = new Map(entries.map((node) => [node.id, [] as string[]]));
  for (const edge of edges.values()) {
    incoming.set(edge.to, incoming.get(edge.to)! + 1);
    outgoing.get(edge.from)!.push(edge.to);
  }
  const queue = entries
    .filter((node) => incoming.get(node.id) === 0)
    .map((node) => node.id);
  const levels = new Map(entries.map((node) => [node.id, 0]));
  const visited = new Set<string>();
  while (queue.length) {
    const id = queue.shift()!;
    visited.add(id);
    for (const next of outgoing.get(id)!) {
      levels.set(next, Math.max(levels.get(next)!, levels.get(id)! + 1));
      incoming.set(next, incoming.get(next)! - 1);
      if (incoming.get(next) === 0) {
        queue.push(next);
      }
    }
  }
  // Cycles are laid out in input order, with return arrows still bound to their cards.
  let cycleLevel =
    Math.max(
      -1,
      ...entries
        .filter((node) => visited.has(node.id))
        .map((node) => levels.get(node.id)!),
    ) + 1;
  for (const node of entries) {
    if (!visited.has(node.id)) {
      levels.set(node.id, cycleLevel++);
    }
  }
  const rows = new Map<number, number>();
  return {
    id: "text-diagram",
    name: "Diagram from text",
    description: "",
    nodes: entries.map((node) => {
      const level = levels.get(node.id)!;
      const row = rows.get(level) ?? 0;
      rows.set(level, row + 1);
      return {
        id: node.id,
        label: node.label,
        component: node.component,
        x: direction === "right" ? level * 300 : row * 300,
        y: direction === "right" ? row * 220 : level * 220,
      };
    }),
    edges: Array.from(edges.values()),
  };
};
