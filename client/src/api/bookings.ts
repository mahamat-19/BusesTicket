
// client/src/api/bookings.ts
import axiosInstance from "../helpers/axiosInstance";
import type { Booking, BookSeatPayload, MakePaymentPayload } from "../types";

export async function getMyBookings(): Promise<Booking[]> {
  const token = localStorage.getItem("token");
  const res = await axiosInstance.get("/bookings/me", {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  return (res.data?.data ?? res.data) as Booking[];
}

export async function bookSeat(payload: BookSeatPayload): Promise<Booking> {
  const token = localStorage.getItem("token");
  const res = await axiosInstance.post("/bookings", payload, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  return (res.data?.data ?? res.data) as Booking;
}

export async function makePayment(payload: MakePaymentPayload): Promise<{ success: boolean }> {
  const token = localStorage.getItem("token");
  const res = await axiosInstance.post("/payments", payload, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  return (res.data?.data ?? res.data) as { success: boolean };
}
