import { Server } from "socket.io";

export function setupHandlers(io: Server) {
  io.on("connection", (socket) => {
    console.log("WOOHOO");
    socket.emit("connected", "connected");

    socket.on("newClientMessage", (message: string) => {
      console.log("server got new message");
      console.log(message);
      // socket.emit("serverMessage", message);
      io.emit("serverMessage", message);
    });
  });
}
