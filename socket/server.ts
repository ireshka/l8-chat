import { Server } from "socket.io";
import { EventsKeys } from "../types";

export function setupHandlers(io: Server) {
  io.on(EventsKeys.CONNECTION, (socket) => {
    console.log("WOOHOO Someone connected with our server.");
    socket.emit(EventsKeys.CONNECTED, "connected");

    socket.on(EventsKeys.NEW_CLIENT_MESSAGE, (message: string) => {
      console.log("server got new message from user:");
      console.log(`==> ${message}`);
      socket.broadcast.emit(EventsKeys.SERVER_MESSAGE, message);
    });
  });
}
