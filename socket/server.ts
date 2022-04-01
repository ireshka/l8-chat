import { Server } from "socket.io";
import { EventsKeys, RoomKeys } from "../types";

export function setupHandlers(io: Server) {
  io.on(EventsKeys.CONNECTION, (socket) => {
    // console.log("WOOHOO Someone connected with our server.");
    socket.emit(EventsKeys.CONNECTED, "connected");

    socket.on(EventsKeys.NEW_CLIENT_MESSAGE, (message: string) => {
      console.log("Server got new message from user:");
      console.log(`==> ${message}`);
      socket.to(RoomKeys.GENERAL).emit(EventsKeys.SERVER_MESSAGE, message);
    });

    socket.on(EventsKeys.JOIN, (room: EventsKeys) => {
      console.log('Joining room');
      socket.join(room);
      socket
        .to(room)
        .emit(EventsKeys.SERVER_MESSAGE, `Some joins ${room} room`);
    });
  });
}
