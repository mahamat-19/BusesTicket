import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export const registerSchema = loginSchema.extend({
  name: z.string().min(1, { message: "Name is required" }),
});

export const busSchema = z.object({
  name: z.string().min(1),
  number: z.string().optional(),
  capacity: z.number().optional(),
  from: z.string().min(1),
  to: z.string().min(1),
  fare: z.number().nonnegative(),
  seats: z.number().positive().optional(),
  journeyDate: z.string(),
  departure: z.string().optional(),
  arrival: z.string().optional(),
  type: z.string().optional(),
  status: z.string().optional(),
});

export const bookingSchema = z.object({
  busId: z.string().min(1),
  seatNumber: z.number().positive(),
});

export type LoginForm = z.infer<typeof loginSchema>;
export type RegisterForm = z.infer<typeof registerSchema>;
export type BusForm = z.infer<typeof busSchema>;
export type BookingForm = z.infer<typeof bookingSchema>;
