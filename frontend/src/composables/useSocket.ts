import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function useSocket() {
  function connect(): Socket {
    if (socket) return socket;

    let token: string | null = null;
    try {
      token = typeof localStorage !== "undefined" ? localStorage.getItem("lychat_token") : null;
    } catch {
      token = null;
    }

    socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000", {
      auth: { token },
    });

    return socket;
  }

  function disconnect(): void {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  }

  function getSocket(): Socket | null {
    return socket;
  }

  return { connect, disconnect, getSocket };
}