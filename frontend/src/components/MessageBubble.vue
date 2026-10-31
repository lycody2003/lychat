<template>
  <div class="msg-row" :class="{ mine: isMine }">
    <!-- Friend Avatar -->
    <div v-if="!isMine" class="avatar">
      {{ initials(senderUsername) }}
    </div>

    <div class="content">
      <span v-if="!isMine" class="sender-name">
        {{ senderUsername }}
      </span>

      <div class="bubble" :class="{ mine: isMine }">
        {{ message.text }}
      </div>

      <span class="time">
        {{ formatTime(message.createdAt) }}
      </span>
    </div>

    <!-- Optional avatar for myself -->
    <div v-if="isMine" class="avatar mine-avatar">
      Me
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Message } from "../types/chat";

const props = defineProps<{
  message: Message;
  isMine: boolean;
}>();

const senderUsername = computed<string | undefined>(() => {
  if (!props.message.sender || typeof props.message.sender === "string") return undefined;
  return props.message.sender.username;
});

function initials(name?: string): string {
  return name ? name.slice(0, 2).toUpperCase() : "?";
}

function formatTime(date?: string | Date): string {
  if (!date) return "";
  return new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
</script>

<style scoped>
.msg-row {
  display: flex;
  align-items: flex-end;
  width: 100%;
  margin: 12px 0;
  gap: 10px;
}

/* Friend */
.msg-row:not(.mine) {
  justify-content: flex-start;
}

/* Me */
.msg-row.mine {
  justify-content: flex-end;
}

/* Avatar */

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #7c4dff, #5b8cff);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 700;
  font-size: 12px;
  flex-shrink: 0;
}

.mine-avatar {
  background: linear-gradient(135deg, #00c896, #00d4ff);
}

.content {
  display: flex;
  flex-direction: column;
  max-width: 70%;
}

.msg-row.mine .content {
  align-items: flex-end;
}

.sender-name {
  font-size: 12px;
  color: #9aa1b5;
  margin-bottom: 4px;
  padding-left: 6px;
}

.bubble {
  max-width: 100%;
  padding: 12px 16px;
  border-radius: 18px;
  background: #272b36;
  color: #fff;
  line-height: 1.5;
  word-break: break-word;
  box-shadow: 0 4px 10px rgba(0, 0, 0, .15);

  border-bottom-left-radius: 6px;
}

.bubble.mine {
  background: linear-gradient(135deg, #7c4dff, #5b8cff);
  border-bottom-left-radius: 18px;
  border-bottom-right-radius: 6px;
}

.time {
  font-size: 11px;
  color: #7b8196;
  margin-top: 4px;
  padding: 0 6px;
}
</style>