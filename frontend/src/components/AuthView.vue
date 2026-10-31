<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="brand">
        <div class="logo">Ly</div>
        <h1>Lychat v-1.0.3</h1>
        <p>Chat smarter, connect faster.</p>
      </div>

      <div class="tabs">
        <button :class="{ active: mode === 'login' }" @click="mode = 'login'">Login</button>
        <button :class="{ active: mode === 'register' }" @click="mode = 'register'">Register</button>
      </div>

      <form @submit.prevent="submit" class="form">
        <input v-if="mode === 'register'" v-model="username" type="text" placeholder="Username" required />
        <input v-model="email" type="email" placeholder="Email" required />
        <input v-model="password" type="password" placeholder="Password" required />

        <p v-if="error" class="error">{{ error }}</p>

        <button type="submit" class="submit-btn" :disabled="loading">
          {{ loading ? "Please wait..." : mode === "login" ? "Login" : "Create account" }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAuth } from "../composables/useAuth";
import type { AuthUser } from "../composables/useAuth";
import type { AxiosError } from "axios";

const emit = defineEmits<{ authenticated: [user: AuthUser] }>();

const { login, register } = useAuth();

type Mode = "login" | "register";

const mode = ref<Mode>("login");
const username = ref("");
const email = ref("");
const password = ref("");
const error = ref("");
const loading = ref(false);

async function submit() {
  error.value = "";
  loading.value = true;
  try {
    const user: AuthUser =
      mode.value === "login"
        ? await login(email.value, password.value)
        : await register(username.value, email.value, password.value);

    console.log("User : ", user);
    emit("authenticated", user);
  } catch (err) {
    const axiosErr = err as AxiosError<{ message: string }>;
    error.value = axiosErr.response?.data?.message ?? "Something went wrong";
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at 20% 20%, #1f2240, #0c0d1a 70%);
  font-family: "Inter", system-ui, sans-serif;
}

.auth-card {
  width: 380px;
  padding: 36px 32px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(12px);
}

.brand {
  text-align: center;
  margin-bottom: 28px;
}

.logo {
  width: 56px;
  height: 56px;
  margin: 0 auto 12px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 22px;
  color: white;
  background: linear-gradient(135deg, #7c4dff, #00e0c6);
  box-shadow: 0 8px 24px rgba(124, 77, 255, 0.4);
}

.brand h1 {
  color: white;
  font-size: 24px;
  margin: 0;
}

.brand p {
  color: #8e8ea3;
  font-size: 13px;
  margin-top: 4px;
}

.tabs {
  display: flex;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 4px;
  margin-bottom: 22px;
}

.tabs button {
  flex: 1;
  padding: 10px;
  border: none;
  background: transparent;
  color: #9b9bb0;
  font-weight: 600;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.2s;
}

.tabs button.active {
  background: linear-gradient(135deg, #7c4dff, #5b8cff);
  color: white;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.form input {
  padding: 13px 14px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  color: white;
  font-size: 14px;
  outline: none;
  transition: 0.2s;
}

.form input:focus {
  border-color: #7c4dff;
  background: rgba(255, 255, 255, 0.08);
}

.error {
  color: #ff6b81;
  font-size: 13px;
  margin: 0;
}

.submit-btn {
  margin-top: 6px;
  padding: 13px;
  border-radius: 10px;
  border: none;
  font-weight: 600;
  font-size: 14px;
  color: white;
  cursor: pointer;
  background: linear-gradient(135deg, #7c4dff, #00e0c6);
  transition: 0.2s;
}

.submit-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 24px rgba(124, 77, 255, 0.35);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
