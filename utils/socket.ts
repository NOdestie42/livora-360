// socket.ts
import { io, Socket } from "socket.io-client";
import config from "./config";
import { getItemFromAsyncStorage } from "@/AsyncStorage";

let socket: Socket | null = null;

export async function initSocket() {
    const userId = await getItemFromAsyncStorage("userId");

    socket = io(config.baseURL, {
        transports: ["websocket"],
        query: { userId },
    });

    return socket;
}

export function getSocket() {
    if (!socket) throw new Error("Socket not initialized. Call initSocket() first.");
    return socket;
}
