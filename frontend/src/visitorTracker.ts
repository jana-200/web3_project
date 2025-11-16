import { io, Socket } from "socket.io-client";

const socket: Socket = io(import.meta.env.VITE_SOCKET_URL, {
  path: "/socket.io",
  transports: ["websocket"],
  autoConnect: true,
});

export default socket;
