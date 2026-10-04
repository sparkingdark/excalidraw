import { getDataURL_sync } from "@excalidraw/excalidraw/data/blob";

import react from "./icons/react.svg?raw";
import nodejs from "./icons/nodejs.svg?raw";
import typescript from "./icons/typescript.svg?raw";
import python from "./icons/python.svg?raw";
import docker from "./icons/docker.svg?raw";
import kubernetes from "./icons/kubernetes.svg?raw";
import postgresql from "./icons/postgresql.svg?raw";
import redis from "./icons/redis.svg?raw";
import mongodb from "./icons/mongodb.svg?raw";
import nginx from "./icons/nginx.svg?raw";
import aws from "./icons/amazonwebservices.svg?raw";
import googlecloud from "./icons/googlecloud.svg?raw";
import azure from "./icons/azure.svg?raw";
import githubactions from "./icons/githubactions.svg?raw";
import kafka from "./icons/apachekafka.svg?raw";

export type ArchitectureComponent = {
  id: string;
  name: string;
  category: string;
  keywords: string;
  svg: string;
  stroke: string;
  fill: string;
};

const infrastructureIcon = (content: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#475569" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${content}</svg>`;

export const ARCHITECTURE_COMPONENTS: ArchitectureComponent[] = [
  {
    id: "react",
    name: "React",
    category: "Frontend",
    keywords: "web ui client javascript",
    svg: react,
    stroke: "#1971c2",
    fill: "#e7f5ff",
  },
  {
    id: "typescript",
    name: "TypeScript",
    category: "Frontend",
    keywords: "javascript language web",
    svg: typescript,
    stroke: "#1971c2",
    fill: "#e7f5ff",
  },
  {
    id: "nodejs",
    name: "Node.js",
    category: "Compute",
    keywords: "api backend javascript server",
    svg: nodejs,
    stroke: "#2f9e44",
    fill: "#ebfbee",
  },
  {
    id: "python",
    name: "Python",
    category: "Compute",
    keywords: "api backend ai machine learning",
    svg: python,
    stroke: "#1971c2",
    fill: "#e7f5ff",
  },
  {
    id: "docker",
    name: "Docker",
    category: "DevOps",
    keywords: "container image deploy",
    svg: docker,
    stroke: "#1971c2",
    fill: "#e7f5ff",
  },
  {
    id: "kubernetes",
    name: "Kubernetes",
    category: "DevOps",
    keywords: "k8s cluster orchestration deploy",
    svg: kubernetes,
    stroke: "#1971c2",
    fill: "#e7f5ff",
  },
  {
    id: "githubactions",
    name: "GitHub Actions",
    category: "DevOps",
    keywords: "ci cd pipeline build deploy",
    svg: githubactions,
    stroke: "#6741d9",
    fill: "#f3f0ff",
  },
  {
    id: "postgresql",
    name: "PostgreSQL",
    category: "Data",
    keywords: "sql database storage",
    svg: postgresql,
    stroke: "#1971c2",
    fill: "#e7f5ff",
  },
  {
    id: "redis",
    name: "Redis",
    category: "Data",
    keywords: "cache memory database",
    svg: redis,
    stroke: "#e03131",
    fill: "#fff5f5",
  },
  {
    id: "mongodb",
    name: "MongoDB",
    category: "Data",
    keywords: "nosql database document",
    svg: mongodb,
    stroke: "#2f9e44",
    fill: "#ebfbee",
  },
  {
    id: "kafka",
    name: "Apache Kafka",
    category: "Data",
    keywords: "events stream queue messaging",
    svg: kafka,
    stroke: "#6741d9",
    fill: "#f3f0ff",
  },
  {
    id: "nginx",
    name: "NGINX",
    category: "Compute",
    keywords: "proxy gateway load balancer web server",
    svg: nginx,
    stroke: "#2f9e44",
    fill: "#ebfbee",
  },
  {
    id: "aws",
    name: "AWS",
    category: "Cloud",
    keywords: "amazon cloud infrastructure",
    svg: aws,
    stroke: "#e8590c",
    fill: "#fff4e6",
  },
  {
    id: "googlecloud",
    name: "Google Cloud",
    category: "Cloud",
    keywords: "gcp cloud infrastructure",
    svg: googlecloud,
    stroke: "#1971c2",
    fill: "#e7f5ff",
  },
  {
    id: "azure",
    name: "Azure",
    category: "Cloud",
    keywords: "microsoft cloud infrastructure",
    svg: azure,
    stroke: "#1971c2",
    fill: "#e7f5ff",
  },
  {
    id: "browser",
    name: "Web client",
    category: "Infrastructure",
    keywords: "browser frontend user",
    svg: infrastructureIcon(
      '<rect x="2" y="3" width="20" height="18" rx="2"/><path d="M2 8h20M6 5.5h.01M9 5.5h.01M8 12l-3 3 3 3m8-6 3 3-3 3"/>',
    ),
    stroke: "#1971c2",
    fill: "#e7f5ff",
  },
  {
    id: "service",
    name: "API service",
    category: "Infrastructure",
    keywords: "backend server microservice compute",
    svg: infrastructureIcon(
      '<rect x="3" y="3" width="18" height="7" rx="2"/><rect x="3" y="14" width="18" height="7" rx="2"/><path d="M7 6.5h.01M7 17.5h.01M12 6.5h5M12 17.5h5M12 10v4"/>',
    ),
    stroke: "#2f9e44",
    fill: "#ebfbee",
  },
  {
    id: "gateway",
    name: "API gateway",
    category: "Infrastructure",
    keywords: "proxy load balancer routing",
    svg: infrastructureIcon(
      '<rect x="8" y="2" width="8" height="6" rx="1"/><rect x="1" y="16" width="6" height="6" rx="1"/><rect x="17" y="16" width="6" height="6" rx="1"/><path d="M12 8v4M4 16v-4h16v4"/>',
    ),
    stroke: "#e8590c",
    fill: "#fff4e6",
  },
  {
    id: "database",
    name: "Database",
    category: "Infrastructure",
    keywords: "sql storage persistence",
    svg: infrastructureIcon(
      '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 4 16 4 16 0V5M4 12c0 4 16 4 16 0"/>',
    ),
    stroke: "#6741d9",
    fill: "#f3f0ff",
  },
  {
    id: "queue",
    name: "Message queue",
    category: "Infrastructure",
    keywords: "event bus broker async messaging",
    svg: infrastructureIcon(
      '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M6 9v6m4-6v6m4-6v6m4-6v6"/>',
    ),
    stroke: "#6741d9",
    fill: "#f3f0ff",
  },
  {
    id: "storage",
    name: "Object storage",
    category: "Infrastructure",
    keywords: "bucket s3 files blobs",
    svg: infrastructureIcon(
      '<path d="M4 6h16l-2 15H6L4 6Z"/><ellipse cx="12" cy="6" rx="8" ry="3"/><path d="M8 12h8"/>',
    ),
    stroke: "#0c8599",
    fill: "#e3fafc",
  },
  {
    id: "user",
    name: "User",
    category: "Infrastructure",
    keywords: "person actor customer",
    svg: infrastructureIcon(
      '<circle cx="12" cy="7" r="4"/><path d="M4 22v-3a8 8 0 0 1 16 0v3"/>',
    ),
    stroke: "#c2255c",
    fill: "#fff0f6",
  },
  {
    id: "cloud",
    name: "Cloud",
    category: "Infrastructure",
    keywords: "internet network infrastructure",
    svg: infrastructureIcon(
      '<path d="M6 19a5 5 0 0 1-1-10 7 7 0 0 1 13-2 6 6 0 0 1 0 12H6Z"/>',
    ),
    stroke: "#0c8599",
    fill: "#e3fafc",
  },
];

export const COMPONENT_CATEGORIES = [
  "All",
  "Cloud",
  "Frontend",
  "Compute",
  "Data",
  "DevOps",
  "Infrastructure",
];

export const DIAGRAM_COLORS = [
  { name: "Ocean", stroke: "#1971c2", fill: "#e7f5ff" },
  { name: "Forest", stroke: "#2f9e44", fill: "#ebfbee" },
  { name: "Violet", stroke: "#6741d9", fill: "#f3f0ff" },
  { name: "Amber", stroke: "#e8590c", fill: "#fff4e6" },
  { name: "Rose", stroke: "#c2255c", fill: "#fff0f6" },
  { name: "Teal", stroke: "#0c8599", fill: "#e3fafc" },
  { name: "Red", stroke: "#e03131", fill: "#fff5f5" },
  { name: "Slate", stroke: "#475569", fill: "#f1f5f9" },
];

export type DiagramColor = typeof DIAGRAM_COLORS[number];

export type ArchitectureTemplate = {
  id: string;
  name: string;
  description: string;
  nodes: {
    id: string;
    component: string;
    label: string;
    x: number;
    y: number;
  }[];
  edges: { from: string; to: string; label: string }[];
};

export const ARCHITECTURE_TEMPLATES: ArchitectureTemplate[] = [
  {
    id: "cloud-app",
    name: "Cloud application",
    description:
      "Client, cloud platform, application service and persistent storage.",
    nodes: [
      { id: "client", component: "browser", label: "Web client", x: 0, y: 0 },
      { id: "cloud", component: "aws", label: "Cloud platform", x: 300, y: 0 },
      {
        id: "api",
        component: "nodejs",
        label: "Application API",
        x: 600,
        y: 0,
      },
      { id: "db", component: "mongodb", label: "Document store", x: 900, y: 0 },
      {
        id: "files",
        component: "storage",
        label: "File storage",
        x: 600,
        y: 240,
      },
    ],
    edges: [
      { from: "client", to: "cloud", label: "HTTPS" },
      { from: "cloud", to: "api", label: "Route" },
      { from: "api", to: "db", label: "Read/write" },
      { from: "api", to: "files", label: "Files" },
    ],
  },
  {
    id: "data-pipeline",
    name: "Data pipeline",
    description:
      "Ingest files, transform data, stream events and serve analytics.",
    nodes: [
      { id: "source", component: "storage", label: "Source files", x: 0, y: 0 },
      { id: "etl", component: "python", label: "Python ETL", x: 300, y: 0 },
      { id: "stream", component: "kafka", label: "Event stream", x: 600, y: 0 },
      {
        id: "db",
        component: "postgresql",
        label: "Analytics store",
        x: 900,
        y: 0,
      },
      {
        id: "dashboard",
        component: "react",
        label: "Dashboard",
        x: 1200,
        y: 0,
      },
    ],
    edges: [
      { from: "source", to: "etl", label: "Ingest" },
      { from: "etl", to: "stream", label: "Publish" },
      { from: "stream", to: "db", label: "Load" },
      { from: "db", to: "dashboard", label: "Query" },
    ],
  },
  {
    id: "network",
    name: "Network & gateway",
    description:
      "External traffic, a reverse proxy, application service and database.",
    nodes: [
      { id: "internet", component: "cloud", label: "Internet", x: 0, y: 0 },
      {
        id: "gateway",
        component: "nginx",
        label: "Reverse proxy",
        x: 300,
        y: 0,
      },
      {
        id: "api",
        component: "service",
        label: "Private service",
        x: 600,
        y: 0,
      },
      {
        id: "db",
        component: "database",
        label: "Private database",
        x: 900,
        y: 0,
      },
      { id: "cache", component: "redis", label: "Cache", x: 600, y: 240 },
    ],
    edges: [
      { from: "internet", to: "gateway", label: "TLS" },
      { from: "gateway", to: "api", label: "Route" },
      { from: "api", to: "db", label: "SQL" },
      { from: "api", to: "cache", label: "Cache" },
    ],
  },
  {
    id: "web-app",
    name: "Web application",
    description: "React client, Node.js API, database and cache.",
    nodes: [
      { id: "client", component: "react", label: "React client", x: 0, y: 0 },
      { id: "api", component: "nodejs", label: "Node.js API", x: 300, y: 0 },
      { id: "db", component: "postgresql", label: "PostgreSQL", x: 600, y: 0 },
      { id: "cache", component: "redis", label: "Redis cache", x: 300, y: 230 },
    ],
    edges: [
      { from: "client", to: "api", label: "HTTPS" },
      { from: "api", to: "db", label: "SQL" },
      { from: "api", to: "cache", label: "Cache" },
    ],
  },
  {
    id: "microservices",
    name: "Event-driven services",
    description: "Gateway, independent services, queue and worker.",
    nodes: [
      {
        id: "gateway",
        component: "gateway",
        label: "API gateway",
        x: 0,
        y: 120,
      },
      {
        id: "orders",
        component: "service",
        label: "Order service",
        x: 300,
        y: 0,
      },
      {
        id: "users",
        component: "service",
        label: "User service",
        x: 300,
        y: 240,
      },
      { id: "events", component: "kafka", label: "Event stream", x: 600, y: 0 },
      {
        id: "worker",
        component: "python",
        label: "Python worker",
        x: 900,
        y: 0,
      },
      {
        id: "db",
        component: "postgresql",
        label: "PostgreSQL",
        x: 900,
        y: 240,
      },
    ],
    edges: [
      { from: "gateway", to: "orders", label: "Route" },
      { from: "gateway", to: "users", label: "Route" },
      { from: "orders", to: "events", label: "Publish" },
      { from: "events", to: "worker", label: "Consume" },
      { from: "worker", to: "db", label: "Write" },
    ],
  },
  {
    id: "delivery",
    name: "Container delivery",
    description: "Build, package and deploy to a Kubernetes cluster.",
    nodes: [
      {
        id: "ci",
        component: "githubactions",
        label: "GitHub Actions",
        x: 0,
        y: 0,
      },
      { id: "image", component: "docker", label: "Docker image", x: 300, y: 0 },
      {
        id: "cluster",
        component: "kubernetes",
        label: "Kubernetes",
        x: 600,
        y: 0,
      },
      {
        id: "ingress",
        component: "nginx",
        label: "NGINX ingress",
        x: 600,
        y: 240,
      },
      {
        id: "api",
        component: "nodejs",
        label: "Application pods",
        x: 900,
        y: 240,
      },
    ],
    edges: [
      { from: "ci", to: "image", label: "Build" },
      { from: "image", to: "cluster", label: "Deploy" },
      { from: "cluster", to: "ingress", label: "Expose" },
      { from: "ingress", to: "api", label: "Route" },
    ],
  },
];

export const svgDataUrl = (svg: string) =>
  getDataURL_sync(svg, "image/svg+xml");
