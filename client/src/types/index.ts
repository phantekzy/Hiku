export interface User {
  id: string;
  email: string;
  username: string;
  createdAt: string;
  updatedAt: string;
}

export interface Document {
  id: string;
  title: string;
  content: Record<string, unknown>;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Canvas {
  id: string;
  title: string;
  data: Record<string, unknown>;
  thumbnail?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Diagram {
  id: string;
  title: string;
  data: { nodes: DiagramNode[]; edges: DiagramEdge[] };
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface DiagramNode {
  id: string;
  type: "process" | "decision" | "terminal";
  position: { x: number; y: number };
  data: { label: string };
}

export interface DiagramEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export type WorkspaceItem =
  | { type: "document"; item: Document }
  | { type: "canvas"; item: Canvas }
  | { type: "diagram"; item: Diagram };
