import { Server, Socket } from "socket.io";
import { EventsKeys, RoomKeys } from "../types";

export function setupHandlers(io: Server) {
  io.on(EventsKeys.CONNECTION, (socket: Socket) => {
    // console.log("WOOHOO Someone connected with our server.");
    socket.emit(EventsKeys.CONNECTED, "connected");

    socket.on(EventsKeys.NEW_CLIENT_MESSAGE, (message: string) => {
      console.log("Server got new message from user:");
      console.log(`==> ${message}`);
      socket.to(RoomKeys.GENERAL).emit(EventsKeys.SERVER_MESSAGE, message);
    });

    socket.on(EventsKeys.JOIN, (room: EventsKeys) => {
      console.log(`Client wants to join room: ${room}`);
      socket.rooms.clear();
      socket.join(room);
      socket.emit(EventsKeys.JOINED, room);
      console.log('==> room actual after add:');
      console.log(socket.rooms);
      socket
        .to(room)
        .emit(EventsKeys.SERVER_MESSAGE, `Some joins ${room} room`);
    });
  });
}
