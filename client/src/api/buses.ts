
// client/src/api/buses.ts
import axiosInstance from "../helpers/axiosInstance";
import type { Bus, BusFilters } from "../types";

export async function getBuses(filters?: BusFilters): Promise<Bus[]> {
  const token = localStorage.getItem("token");
  const res = await axiosInstance.get("/buses", {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    params: filters,
  });
  return (res.data?.data ?? res.data) as Bus[];
}

export async function getBusById(id: string): Promise<Bus> {
  const token = localStorage.getItem("token");
  const res = await axiosInstance.get(`/buses/${id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  return (res.data?.data ?? res.data) as Bus;
}
