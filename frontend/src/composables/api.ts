import axios, { type InternalAxiosRequestConfig } from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  let token: string | null = null;
  try {
    token = typeof localStorage !== "undefined" ? localStorage.getItem("lychat_token") : null;
  } catch {
    token = null;
  }
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;