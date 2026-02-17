
// client/src/types.ts

// ---------- Domain Models ----------
export interface User {
  _id: string;
  name: string;
  email: string;
  isAdmin?: boolean;
  createdAt?: string;
  updatedAt?: string;
  // add more fields as needed
}

export type BookingStatus = "Pending" | "Confirmed" | "Cancelled";

export interface Booking {
  _id: string;
  user?: string | any; // Can be populated
  bus?: Bus | string; // Can be populated
  seats: number[];
  transactionId: string;
  status?: BookingStatus;
  createdAt?: string;
  updatedAt?: string;
}

export type BusStatus = "Yet To Start" | "Running" | "Completed" | string;

export interface Bus {
  _id: string;
  name: string;
  from: string;
  to: string;
  journeyDate: string; // ISO date string
  status: BusStatus;
  capacity: number;
  fare: number;
  timings?: string[];
  departure?: string;
  arrival?: string;
  seatsBooked?: number[];
}

// ---------- UI/Store Types ----------
export type AlertType = "success" | "error" | "info" | "warning";

// If you keep filters around commonly, define a reusable type
export interface BusFilters {
  from?: string;
  to?: string;
  journeyDate?: string;
}

// Auth payloads (adjust to your server)
export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

// Ticketing payloads
export interface BookSeatPayload {
  busId: string;
  seatNumbers: number[];
  journeyDate: string;
}

export interface MakePaymentPayload {
  bookingId: string;
  amount: number;
  // add gateway fields as needed
}
