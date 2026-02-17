import create from "zustand";
import { AlertType } from "../types";

export interface AlertState {
  loading: boolean;
  alert: { type: AlertType; message: string } | null;
  setLoading: (loading: boolean) => void;
  setAlert: (type: AlertType, message: string) => void;
  clearAlert: () => void;
}

export const useAlertStore = create<AlertState>((set) => ({
  loading: false,
  alert: null,
  setLoading: (loading) => set({ loading }),
  setAlert: (type, message) => set({ alert: { type, message } }),
  clearAlert: () => set({ alert: null }),
}));
