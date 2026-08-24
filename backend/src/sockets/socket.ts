import { Server as HttpServer } from "http";
import { Server } from "socket.io";
import env from "../config/env.js";
import { authenticateSocket } from "./socket.auth.js";
import { registerSocketHandlers } from "./socket.handlers.js";
import { joinAccountRoom, leaveAccountRoom } from "./socket.rooms.js";
import { addConnectedAccount, removeConnectedAccount } from "./socketStore.js";

let io: Server;

export const initializeSocket = (httpServer: HttpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: env.CLIENT_URL,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    try {
      const account = authenticateSocket(socket);

      addConnectedAccount({
        accountId: account.accountId,
        accountType: account.accountType,
        socketId: socket.id,
      });

      joinAccountRoom(socket, account.accountType, account.accountId);

      registerSocketHandlers(socket, account);

      console.log(`${account.accountType} connected: ${account.accountId}`);

      socket.on("disconnect", () => {
        leaveAccountRoom(socket, account.accountType, account.accountId);

        removeConnectedAccount(
          account.accountType,
          account.accountId,
          socket.id,
        );

        console.log(
          `${account.accountType} disconnected: ${account.accountId}`,
        );
      });
    } catch (error) {
      console.error("Socket authentication failed:", error);

      socket.disconnect(true);
    }
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO is not initialized");
  }

  return io;
};
