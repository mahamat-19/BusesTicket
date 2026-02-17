
// client/src/api/auth.ts
import axiosInstance from "../helpers/axiosInstance";
import type { LoginPayload, RegisterPayload, User } from "../types";

export async function login(payload: LoginPayload): Promise<{ token: string; user: User }> {
  const res = await axiosInstance.post("/auth/login", payload);
  return (res.data?.data ?? res.data) as { token: string; user: User };
}

export async function register(payload: RegisterPayload): Promise<{ token: string; user: User }> {
  const res = await axiosInstance.post("/auth/register", payload);
  return (res.data?.data ?? res.data) as { token: string; user: User };
}
``
