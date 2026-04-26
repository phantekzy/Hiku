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
