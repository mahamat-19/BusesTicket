import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from "@tanstack/react-query";
import axiosInstance from "../helpers/axiosInstance";
import { Bus, Booking, User } from "../types";

// API Response wrapper type
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Buses
export const useBuses = (filters: Partial<Bus> = {}) => {
  return useQuery<Bus[]>({
    queryKey: ["buses", filters],
    queryFn: () =>
      axiosInstance.post<ApiResponse<Bus[]>>("/buses/get-all-buses", filters).then((res) => res.data.data),
  });
};

export const useBus = (id: string) => {
  return useQuery<Bus>({
    queryKey: ["bus", id],
    queryFn: () =>
      axiosInstance.post<ApiResponse<Bus>>("/buses/get-bus-by-id", { _id: id }).then((res) => res.data.data),
  });
};

export const useAddBus = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<Bus>, Error, Partial<Bus>>({
    mutationFn: (bus: Partial<Bus>) => axiosInstance.post("/buses/add-bus", bus),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["buses"] }),
  });
};

export const useUpdateBus = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<Bus>, Error, Partial<Bus> & { _id: string }>({
    mutationFn: (bus: Partial<Bus> & { _id: string }) =>
      axiosInstance.post("/buses/update-bus", bus),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["buses"] }),
  });
};

export const useDeleteBus = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<void>, Error, string>({
    mutationFn: (id: string) => axiosInstance.post("/buses/delete-bus", { _id: id }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["buses"] }),
  });
};

// Users
export const useUsers = () => {
  return useQuery<User[]>({
    queryKey: ["users"],
    queryFn: () =>
      axiosInstance.post<ApiResponse<User[]>>("/users/get-all-users", {}).then((res) => res.data.data),
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<User>, Error, Partial<User> & { _id: string }>({
    mutationFn: (user: Partial<User> & { _id: string }) =>
      axiosInstance.post("/users/update-user-permissions", user),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });
};

// Bookings
export const useMyBookings = () => {
  return useQuery<Booking[]>({
    queryKey: ["myBookings"],
    queryFn: () =>
      axiosInstance.post<ApiResponse<Booking[]>>("/bookings/get-bookings-by-user-id", {}).then((res) => res.data.data),
  });
};

export const useAllBookings = () => {
  return useQuery<Booking[]>({
    queryKey: ["allBookings"],
    queryFn: () =>
      axiosInstance.post<ApiResponse<Booking[]>>("/bookings/get-all-bookings", {}).then((res) => res.data.data),
  });
};

export const useBookSeat = () => {
  const queryClient = useQueryClient();
  return useMutation<
    ApiResponse<Booking>,
    Error,
    { bus: string; seats: number[]; transactionId: string }
  >({
    mutationFn: (payload: { bus: string; seats: number[]; transactionId: string }) =>
      axiosInstance.post("/bookings/book-seat", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myBookings"] });
      queryClient.invalidateQueries({ queryKey: ["buses"] });
    },
  });
};

export const useMakePayment = () => {
  return useMutation<ApiResponse<{ transactionId: string }>, Error, { token: any; amount: number }>({
    mutationFn: (payload: { token: any; amount: number }) =>
      axiosInstance.post("/bookings/make-payment", payload),
  });
};

// Authentication & user
export const useLogin = () => {
  return useMutation<ApiResponse<string>, Error, { email: string; password: string }>({
    mutationFn: (credentials: { email: string; password: string }) =>
      axiosInstance.post<ApiResponse<string>>("/users/login", credentials).then((res) => res.data),
  });
};

export const useRegister = () => {
  return useMutation<ApiResponse<null>, Error, { name: string; email: string; password: string }>({
    mutationFn: (data: { name: string; email: string; password: string }) =>
      axiosInstance.post<ApiResponse<null>>("/users/register", data).then((res) => res.data),
  });
};
