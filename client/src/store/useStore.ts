import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../types";

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
  persist(
    (set, get) => ({
      user: null,
      token: null,

      setAuth: (user, token) => {
        localStorage.setItem("hiku_token", token);
        set({ user, token });
      },

      clearAuth: () => {
        localStorage.removeItem("hiku_token");
        set({ user: null, token: null });
      },

      isAuthenticated: () => !!get().token,

      sidebarCollapsed: false,
      toggleSidebar: () =>
        set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),
    }),
    {
      name: "hiku-storage",
      partialize: (s) => ({
        user: s.user,
        token: s.token,
        sidebarCollapsed: s.sidebarCollapsed,
      }),
    },
  ),
);
