<template>
  <main class="chat-window">
    <header class="chat-header">
      <div>
        <h2># {{ room?.name || "Select a channel" }}</h2>
        <p v-if="room?.description">{{ room.description }}</p>
      </div>
      <div class="typing" v-if="typingUsers.length">
        {{ typingUsers.join(", ") }} {{ typingUsers.length > 1 ? "are" : "is" }} typing...
      </div>
    </header>

    <div class="messages" ref="messagesEl">
      <MessageBubble v-for="msg in messages" :key="msg._id" :message="msg" :is-mine="isMine(msg.sender)" />
      <p v-if="room && !messages.length" class="empty-state">
        💬<br><br>
        No messages yet.<br>
        Start the conversation!
      </p>

      <p v-if="!room" class="empty-state">
        👈<br><br>
        Select a channel from the sidebar.
      </p>
    </div>

    <form v-if="room" class="input-bar" @submit.prevent="send">
      <input v-model="text" type="text" placeholder="Write a message..." @input="onTyping" />

      <button type="submit" :disabled="!text.trim()">
        ➤
      </button>
    </form>
  </main>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from "vue";
import MessageBubble from "./MessageBubble.vue";
import type { Message, MessageSender } from "../types/chat.ts";

interface Room {
  _id: string;
  name: string;
  description?: string;
}

const props = withDefaults(defineProps<{
  room?: Room;
  messages?: Message[];
  currentUserId?: string;
  typingUsers?: string[];
}>(), {
  messages: () => [],
  typingUsers: () => [],
});

const emit = defineEmits<{
  send: [text: string];
  typing: [active: boolean];
}>();

const text = ref("");
const messagesEl = ref<HTMLDivElement | null>(null);

function isMine(sender?: MessageSender | string): boolean {
  if (!props.currentUserId || !sender) return false;
  if (typeof sender === "string") return sender === props.currentUserId;
  return sender._id === props.currentUserId;
}

function send() {
  if (!text.value.trim()) return;
  emit("send", text.value.trim());
  text.value = "";
}

let typingTimeout: ReturnType<typeof setTimeout> | null = null;
function onTyping() {
  emit("typing", true);
  clearTimeout(typingTimeout ?? undefined);
  typingTimeout = setTimeout(() => emit("typing", false), 1500);
}

watch(
  () => props.messages.length,
  async () => {
    await nextTick();
    if (messagesEl.value) messagesEl.value.scrollTop = messagesEl.value.scrollHeight;
  }
);
</script>
<style scoped>
.chat-window {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: linear-gradient(180deg, #181a27 0%, #11131d 100%);
  font-family: "Inter", system-ui, sans-serif;
  overflow: hidden;
}

/* ================= HEADER ================= */

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 24px;
  background: #1d2030;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  min-height: 75px;
  flex-shrink: 0;
}

.chat-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: #fff;
}

.chat-header p {
  margin: 4px 0 0;
  color: #9ca3af;
  font-size: 13px;
}

.typing {
  color: #49e2b1;
  font-size: 13px;
  font-style: italic;
  white-space: nowrap;
}

.typing::after {
  content: "";
  animation: dots 1.4s infinite;
}

@keyframes dots {
  0% {
    content: "";
  }

  25% {
    content: ".";
  }

  50% {
    content: "..";
  }

  100% {
    content: "...";
  }
}

/* ================= MESSAGE AREA ================= */

.messages {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  min-height: 0;
}

.messages>* {
  animation: fadeIn 0.25s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ================= EMPTY ================= */

.empty-state {
  margin: auto;
  color: #7f869d;
  font-size: 15px;
  text-align: center;
  max-width: 300px;
  line-height: 1.6;
}

/* ================= INPUT ================= */

.input-bar {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 22px;
  background: #1d2030;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  flex-shrink: 0;
}

.input-bar input {
  flex: 1;
  height: 48px;
  padding: 0 18px;
  border: none;
  outline: none;
  border-radius: 999px;
  background: #2a2f45;
  color: white;
  font-size: 14px;
  transition: 0.2s;
}

.input-bar input::placeholder {
  color: #8d95b3;
}

.input-bar input:focus {
  background: #323853;
  box-shadow: 0 0 0 2px rgba(124, 77, 255, 0.3);
}

.input-bar button {
  width: 48px;
  height: 48px;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  background: linear-gradient(135deg, #7c4dff, #00d4ff);
  color: white;
  font-size: 18px;
  transition: 0.25s;
}

.input-bar button:hover:not(:disabled) {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 8px 20px rgba(124, 77, 255, 0.35);
}

.input-bar button:active:not(:disabled) {
  transform: scale(0.96);
}

.input-bar button:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

/* ================= SCROLLBAR ================= */

.messages::-webkit-scrollbar {
  width: 8px;
}

.messages::-webkit-scrollbar-track {
  background: transparent;
}

.messages::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.12);
  border-radius: 999px;
}

.messages::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.25);
}

/* Firefox */

.messages {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.15) transparent;
}

/* ================= RESPONSIVE ================= */

@media (max-width: 768px) {

  .chat-header,
  .input-bar {
    padding: 14px 16px;
  }

  .messages {
    padding: 16px;
    gap: 12px;
  }

  .chat-header h2 {
    font-size: 18px;
  }

  .typing {
    display: none;
  }

  .input-bar input {
    height: 44px;
  }

  .input-bar button {
    width: 44px;
    height: 44px;
  }
}
</style>