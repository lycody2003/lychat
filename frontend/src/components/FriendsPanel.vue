<template>
  <div class="friends-panel">
    <div class="search-box">
      <input v-model="query" placeholder="Search by username..." @input="search" />
    </div>

    <div v-if="searchResults.length" class="section">
      <h4>Results</h4>
      <div v-for="u in searchResults" :key="u._id" class="row">
        <div class="avatar">{{ initials(u.username) }}</div>
        <span class="uname">{{ u.username }}</span>
        <button class="small-btn" @click="addFriend(u._id)">Add</button>
      </div>
    </div>

    <div v-if="incomingRequests.length" class="section">
      <h4>Friend Requests</h4>
      <div v-for="r in incomingRequests" :key="r._id" class="row">
        <div class="avatar">{{ initials(r.from.username) }}</div>
        <span class="uname">{{ r.from.username }}</span>
        <button class="small-btn accept" @click="accept(r._id)">✓</button>
        <button class="small-btn reject" @click="reject(r._id)">✕</button>
      </div>
    </div>

    <div class="section">
      <h4>Friends ({{ friends.length }})</h4>
      <div v-if="!friends.length" class="empty">No friends yet — search above to add some!</div>
      <div v-for="f in friends" :key="f._id" class="row clickable" @click="$emit('open-dm', f)">
        <div class="avatar">
          {{ initials(f.username) }}
          <span class="dot" :class="{ on: f.status === 'online' }"></span>
        </div>
        <span class="uname">{{ f.username }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import api from "../composables/api";

interface User {
  _id: string;
  username: string;
  status?: string;
}

interface FriendRequest {
  _id: string;
  from: User;
}

defineEmits<{ "open-dm": [friend: User] }>();

const query = ref("");
const searchResults = ref<User[]>([]);
const friends = ref<User[]>([]);
const incomingRequests = ref<FriendRequest[]>([]);

let searchTimeout: ReturnType<typeof setTimeout> | null = null;

function search() {
  clearTimeout(searchTimeout ?? undefined);
  searchTimeout = setTimeout(async () => {
    if (!query.value.trim()) {
      searchResults.value = [];
      return;
    }
    const { data } = await api.get("/friends/search", { params: { q: query.value.trim() } });
    searchResults.value = data;
  }, 300);
}

async function loadFriends() {
  const { data } = await api.get("/friends");
  friends.value = data;
}

async function loadRequests() {
  const { data } = await api.get("/friends/requests");
  incomingRequests.value = data;
}

async function addFriend(userId: string) {
  await api.post("/friends/requests", { toUserId: userId });
  searchResults.value = searchResults.value.filter((u) => u._id !== userId);
}

async function accept(requestId: string) {
  await api.post(`/friends/requests/${requestId}/accept`);
  incomingRequests.value = incomingRequests.value.filter((r) => r._id !== requestId);
  await loadFriends();
}

async function reject(requestId: string) {
  await api.post(`/friends/requests/${requestId}/reject`);
  incomingRequests.value = incomingRequests.value.filter((r) => r._id !== requestId);
}

function initials(name: string) {
  return name ? name.slice(0, 2).toUpperCase() : "?";
}

onMounted(() => {
  loadFriends();
  loadRequests();
});

defineExpose({ loadFriends, loadRequests });
</script>

<style scoped>
.friends-panel {
  width: 320px;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 16px;
  overflow-y: auto;
}

.search-box input {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  outline: none;
  font-size: 14px;
  transition: .2s;
}

.search-box input:focus {
  border-color: #4f46e5;
}

.section {
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .05);
}

.section h4 {
  margin: 0 0 12px;
  font-size: 14px;
  color: #f8f8f8;
  text-transform: uppercase;
  letter-spacing: .5px;
}

.row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  border-radius: 8px;
  transition: .2s;
}

.row:not(:last-child) {
  margin-bottom: 8px;
}

.clickable {
  cursor: pointer;
}

.avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  position: relative;
  flex-shrink: 0;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #94a3b8;
  position: absolute;
  bottom: 1px;
  right: 1px;
  border: 2px solid white;
}

.dot.on {
  background: #22c55e;
}

.uname {
  flex: 1;
  font-weight: 500;
  color: #ffffff;
}

.small-btn {
  border: none;
  background: #6366f1;
  color: white;
  padding: 6px 14px;
  border-radius: 8px;
  cursor: pointer;
  transition: .2s;
}

.small-btn:hover {
  background: #4f46e5;
}

.accept {
  background: #22c55e;
}

.accept:hover {
  background: #16a34a;
}

.reject {
  background: #ef4444;
}

.reject:hover {
  background: #dc2626;
}

.empty {
  color: #94a3b8;
  font-size: 14px;
  text-align: center;
  padding: 20px 0;
}
</style>