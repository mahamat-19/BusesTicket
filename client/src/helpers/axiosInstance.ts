import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "/api",
});

// attach token before request
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
