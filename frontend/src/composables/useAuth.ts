import { ref } from "vue";
import api from "./api";

export interface AuthUser {
  _id: string;
  username: string;
  email?: string;
  status?: string;
}

interface AuthResponse {
  token: string;
  user: AuthUser;
}

function safeGet(key: string): string | null {
  try {
    return typeof localStorage !== "undefined" ? localStorage.getItem(key) : null;
  } catch {
    return null;
  }
}

function safeSet(key: string, value: string): void {
  try {
    if (typeof localStorage !== "undefined") localStorage.setItem(key, value);
  } catch {}
}

function safeRemove(key: string): void {
  try {
    if (typeof localStorage !== "undefined") localStorage.removeItem(key);
  } catch {}
}

const user = ref<AuthUser | null>(JSON.parse(safeGet("lychat_user") ?? "null"));

export function useAuth() {
  async function login(email: string, password: string): Promise<AuthUser> {
    const { data } = await api.post<AuthResponse>("/auth/login", { email, password });
    safeSet("lychat_token", data.token);
    safeSet("lychat_user", JSON.stringify(data.user));
    user.value = data.user;
    return data.user;
  }

  async function register(username: string, email: string, password: string): Promise<AuthUser> {
    const { data } = await api.post<AuthResponse>("/auth/register", { username, email, password });
    safeSet("lychat_token", data.token);
    safeSet("lychat_user", JSON.stringify(data.user));
    user.value = data.user;
    return data.user;
  }

  function logout(): void {
    api.post("/auth/logout").catch(() => {});
    safeRemove("lychat_token");
    safeRemove("lychat_user");
    user.value = null;
  }

  return { user, login, register, logout };
}