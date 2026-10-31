<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <div class="logo">Ly</div>
      <span class="title">Lychat</span>
    </div>

    <div class="user-card">
      <div class="avatar">{{ initials(user?.username) }}</div>
      <div class="user-info">
        <p class="name">{{ user?.username }}</p>
        <p class="status">● Online</p>
      </div>
      <button class="logout-btn" @click="emit('logout')" title="Logout">⏻</button>
    </div>

    <div class="panel-tabs">
      <button :class="{ active: tab === 'channels' }" @click="tab = 'channels'">Channels</button>
      <button :class="{ active: tab === 'friends' }" @click="tab = 'friends'">Friends</button>
    </div>

    <template v-if="tab === 'channels'">
      <div class="rooms-header">
        <span>Channels</span>
        <button class="add-btn" @click="showCreate = !showCreate">+</button>
      </div>

      <form v-if="showCreate" class="create-room" @submit.prevent="createRoom">
        <input v-model="newRoomName" placeholder="Channel name" required />
        <button type="submit">Create</button>
      </form>

      <ul class="room-list">
        <li
          v-for="room in rooms"
          :key="room._id"
          :class="{ active: room._id === activeRoomId }"
          @click="emit('select-room', room)"
        >
          <span class="hash">#</span>
          <span class="room-name">{{ room.name }}</span>
        </li>
        <li v-if="!rooms.length" class="empty">No channels yet. Create one!</li>
      </ul>
    </template>

    <FriendsPanel v-else @open-dm="(f) => emit('open-dm', f)" />
  </aside>
</template>

<script setup lang="ts">
import { ref } from "vue";
import FriendsPanel from "./FriendsPanel.vue";
import type { AuthUser } from "../composables/useAuth.ts";

interface Room {
  _id: string;
  name: string;
}

type SidebarTab = "channels" | "friends";

defineProps<{                        // ← removed `const props =`
  user: AuthUser | null;
  rooms: Room[];
  activeRoomId?: string;
}>();

const emit = defineEmits<{
  "select-room": [room: Room];
  "create-room": [name: string];
  logout: [];
  "open-dm": [friend: AuthUser];
}>();

const tab = ref<SidebarTab>("channels");
const showCreate = ref(false);
const newRoomName = ref("");

function createRoom() {
  if (!newRoomName.value.trim()) return;
  emit("create-room", newRoomName.value.trim());
  newRoomName.value = "";
  showCreate.value = false;
}

function initials(name?: string): string {
  return name ? name.slice(0, 2).toUpperCase() : "?";
}
</script>

<style scoped>
.sidebar {
  width: 280px;
  height: 100vh;
  background: #14151f;
  border-right: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  flex-direction: column;
  font-family: "Inter", system-ui, sans-serif;
  color: #d8d8e8;
}

.sidebar-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 20px 18px;
}

.sidebar-header .logo {
  width: 32px;
  height: 32px;
  border-radius: 9px;
  background: linear-gradient(135deg, #7c4dff, #00e0c6);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: white;
  font-size: 14px;
}

.sidebar-header .title {
  font-weight: 700;
  font-size: 17px;
  color: white;
}

.user-card {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 14px 18px;
  padding: 10px 12px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.04);
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #5b8cff, #7c4dff);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 13px;
  color: white;
}

.user-info { flex: 1; min-width: 0; }
.name { font-size: 13.5px; font-weight: 600; color: white; margin: 0; }
.status { font-size: 11px; color: #4ade80; margin: 0; }

.logout-btn {
  background: transparent;
  border: none;
  color: #8e8ea3;
  cursor: pointer;
  font-size: 16px;
}
.logout-btn:hover { color: #ff6b81; }

.panel-tabs {
  display: flex;
  gap: 6px;
  margin: 0 14px 14px;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 10px;
  padding: 4px;
}

.panel-tabs button {
  flex: 1;
  padding: 7px;
  border: none;
  background: transparent;
  color: #9b9bb0;
  font-size: 12.5px;
  font-weight: 600;
  border-radius: 7px;
  cursor: pointer;
}

.panel-tabs button.active {
  background: linear-gradient(135deg, #7c4dff, #5b8cff);
  color: white;
}

.rooms-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 18px;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #6c6c84;
  margin-bottom: 8px;
}

.add-btn {
  background: rgba(255, 255, 255, 0.06);
  border: none;
  color: white;
  width: 22px;
  height: 22px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}
.add-btn:hover { background: #7c4dff; }

.create-room {
  display: flex;
  gap: 6px;
  margin: 0 14px 10px;
}
.create-room input {
  flex: 1;
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  color: white;
  font-size: 13px;
  outline: none;
}
.create-room button {
  padding: 0 12px;
  border-radius: 8px;
  border: none;
  background: #7c4dff;
  color: white;
  font-size: 12px;
  cursor: pointer;
}

.room-list {
  list-style: none;
  margin: 0;
  padding: 0 10px;
  overflow-y: auto;
  flex: 1;
}

.room-list li {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 12px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 14px;
  color: #aaabc0;
  margin-bottom: 2px;
  transition: 0.15s;
}

.room-list li:hover { background: rgba(255, 255, 255, 0.05); }

.room-list li.active {
  background: linear-gradient(135deg, rgba(124, 77, 255, 0.25), rgba(0, 224, 198, 0.15));
  color: white;
}

.hash { color: #6c6c84; font-weight: 600; }
.empty { color: #5a5a70; font-size: 12.5px; padding: 10px 12px; cursor: default; }
</style>
