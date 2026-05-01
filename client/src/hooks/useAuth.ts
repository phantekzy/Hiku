import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore";
import { api } from "../lib/api";
import type { AuthResponse } from "../types";

export function useAuth() {
  const { user, token, setAuth, clearAuth, isAuthenticated } = useStore();
  const navigate = useNavigate();

  const login = useCallback(
    async (email: string, password: string) => {
      const data = await api.post<AuthResponse>("/auth/login", {
        email,
        password,
      });
      setAuth(data.user, data.token);
      navigate("/dashboard");
    },
    [setAuth, navigate],
  );

  const register = useCallback(
    async (email: string, username: string, password: string) => {
      const data = await api.post<AuthResponse>("/auth/register", {
        email,
        username,
        password,
      });
      setAuth(data.user, data.token);
      navigate("/dashboard");
    },
    [setAuth, navigate],
  );

  const logout = useCallback(() => {
    clearAuth();
    navigate("/login");
  }, [clearAuth, navigate]);

  return { user, token, isAuthenticated, login, register, logout };
}
