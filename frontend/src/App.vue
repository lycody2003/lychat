<template>
  <AuthView v-if="!user" @authenticated="onAuthenticated" />
  
  <div v-else class="app-layout">
    <ChatSidebar :user="user" :rooms="rooms" :active-room-id="activeRoom?._id" @select-room="selectRoom"
      @create-room="createRoom" @logout="onLogout" @open-dm="openDM" />
    <ChatWindow :room="activeRoom || undefined" :messages="messages" :current-user-id="user._id"
      :typing-users="typingUsernames" @send="sendMessage" @typing="handleTyping" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import AuthView from "./components/AuthView.vue";
import ChatSidebar from "./components/ChatSidebar.vue";
import ChatWindow from "./components/ChatWindow.vue";
import { useAuth } from "./composables/useAuth.ts";
import { useSocket } from "./composables/useSocket.ts";
import api from "./composables/api.ts";
import type { AuthUser } from "./composables/useAuth.ts";
import type { Message } from "./types/chat.ts";

interface Room {
  _id: string;
  name: string;
  description?: string;
}

const { user, logout } = useAuth();
const { connect, disconnect, getSocket } = useSocket();

const rooms = ref<Room[]>([]);
const activeRoom = ref<Room | undefined>(undefined);
const messages = ref<Message[]>([]);
const typingUsernames = ref<string[]>([]);
const typingClearTimers: Record<string, ReturnType<typeof setTimeout>> = {};

async function onAuthenticated(): Promise<void> {
  await bootstrap();
}

async function bootstrap(): Promise<void> {
  connect();
  await loadRooms();
  bindSocketEvents();
}

async function loadRooms(): Promise<void> {
  const { data } = await api.get<Room[]>("/rooms");
  rooms.value = data;
}

async function openDM(friend: AuthUser): Promise<void> {
  const { data: room } = await api.post<Room>(`/friends/${friend._id}/dm`);
  room.name = room.name || friend.username;
  selectRoom(room);
}

async function createRoom(name: string): Promise<void> {
  const { data } = await api.post<Room>("/rooms", { name });
  rooms.value.unshift(data);
  selectRoom(data);
}

async function selectRoom(room: Room): Promise<void> {
  const socket = getSocket();
  if (activeRoom.value) socket?.emit("room:leave", { roomId: activeRoom.value._id });

  activeRoom.value = room;
  typingUsernames.value = [];
  socket?.emit("room:join", { roomId: room._id });

  const { data } = await api.get<Message[]>(`/messages/${room._id}`);
  messages.value = data;
}

function sendMessage(text: string): void {
  const socket = getSocket();
  if (!activeRoom.value) return;
  socket?.emit("message:send", { roomId: activeRoom.value._id, text });
}

function handleTyping(isTyping: boolean): void {
  const socket = getSocket();
  if (!activeRoom.value) return;
  socket?.emit(isTyping ? "typing:start" : "typing:stop", { roomId: activeRoom.value._id });
}

function bindSocketEvents(): void {
  const socket = getSocket();
  if (!socket) return;

  socket.on("message:new", (msg: Message) => {
    if (activeRoom.value && msg.room === activeRoom.value._id) {
      messages.value.push(msg);
    }
  });

  socket.on("typing:start", ({ roomId, username }: { roomId: string; username: string }) => {
    if (activeRoom.value?._id !== roomId) return;
    if (!typingUsernames.value.includes(username)) typingUsernames.value.push(username);
    clearTimeout(typingClearTimers[username]);
    typingClearTimers[username] = setTimeout(() => {
      typingUsernames.value = typingUsernames.value.filter((u) => u !== username);
    }, 2000);
  });

  socket.on("typing:stop", ({ roomId, username }: { roomId: string; username: string }) => {
    if (activeRoom.value?._id !== roomId) return;
    clearTimeout(typingClearTimers[username]);
    typingUsernames.value = typingUsernames.value.filter((u) => u !== username);
  });
}

function onLogout(): void {
  disconnect();
  logout();
  rooms.value = [];
  activeRoom.value = undefined;
  messages.value = [];
}

onMounted(() => {
  if (user.value) bootstrap();
});

onBeforeUnmount(() => disconnect());
</script>

<style>
* {
  box-sizing: border-box;
}

body {
  margin: 0;
}

.app-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
}
</style>
