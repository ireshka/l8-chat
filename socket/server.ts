import { Server, Socket } from "socket.io";
import { EventsKeys, RoomKeys } from "../types";

export function setupHandlers(io: Server) {
  io.on(EventsKeys.CONNECTION, (socket: Socket) => {
    socket.emit(EventsKeys.CONNECTED, "connected");

    socket.on(EventsKeys.NEW_CLIENT_MESSAGE, (message: string) => {
      socket.rooms.forEach((room) => {
        socket.to(room).emit(EventsKeys.SERVER_MESSAGE, message);
      });
    });

    socket.on(EventsKeys.JOIN, async (room: string) => {
      console.log(socket.rooms);
      socket.join(room);
    });

    socket.on(EventsKeys.LEAVE, (room: string) => {
      socket.leave(room);
    });
  });
}
