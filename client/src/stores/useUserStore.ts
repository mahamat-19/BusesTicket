import create from "zustand";
import { User } from "../types";

export interface UserState {
  user: User | null;
  token: string | null;
  setUser: (user: User | null, token?: string | null) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  token: null,
  setUser: (user, token) => {
    if (token) {
      localStorage.setItem("token", token);
    }
    set({ user, token: token ?? null });
  },
  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null });
    window.location.href = "/login";
  },
}));
