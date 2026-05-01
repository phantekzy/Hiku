import { User } from "../types";
import { create } from "zustand";
import { presist } from "zustand/middleware";

interface StoreState {
  // Auth
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  isAuthenticated: () => boolean;

  // UI
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (v: boolean) => void;
}

export const useStore = create<StoreState>()(
  presist((set, get) => ({
    user: null,
    token: null,

    setAuth: (user, token) => {
      localStorage.setItem("hiku_token", token);
      set({ user, token });
    },
  })),
);
