import { useStore } from "zustand";
import { useNavigate } from "react-router-dom";

export function useAuth() {
  const { user, token, setAuth, clearAuth, isAuthenticated } = useStore();
  const navigate = useNavigate();
}
