import * as React from "react";
import { useEffect } from "react";
import {
  Box,
  Card,
  Container,
  FormControl,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import type { NextPage } from "next";
import { Message } from "../components/Message";
import io, { Socket } from "socket.io-client";
import { EventsKeys, RoomKeys } from "../types";
import { RoomListElement } from "../components/RoomListElement";

interface IMessage {
  text: string;
  id: string;
}

const Home: NextPage = () => {
  const [inputValue, setInputValue] = React.useState("");
  const [messages, setMessages] = React.useState<IMessage[]>([]);
  const messageBoxRef = React.useRef<HTMLDivElement>(null);
  const [socket, setSocket] = React.useState<Socket | null>(null);
  const rooms = [RoomKeys.GENERAL, RoomKeys.NIGHTALK, RoomKeys.TEST];
  const [activeRoom, setActiveRoom] = React.useState(RoomKeys.GENERAL);

  const scrollToBottom = () => {
    messageBoxRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  };

  useEffect(() => {
    rooms.forEach((room) => {
      room === activeRoom
        ? socket?.emit(EventsKeys.JOIN, room)
        : socket?.emit(EventsKeys.LEAVE, room);
    });
  }, [activeRoom, socket]);

  useEffect(() => {
    setMessages([]);
  }, [activeRoom]);

  useEffect(() => {
    const newSocket = io();
    newSocket.on(EventsKeys.CONNECTED, (data) => handleIncomingMessage(data));
    newSocket.on(EventsKeys.SERVER_MESSAGE, (data) => {
      handleIncomingMessage(data);
    });
    setSocket(newSocket);
    return () => {
      newSocket.removeAllListeners();
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleIncomingMessage = (data: string) => {
    addMessageToList(data);
  };

  const addMessageToList = (text: string) => {
    setMessages((prevMessages) => {
      const messageObject = {
        text,
        id: Math.random().toString(),
      };
      return [...prevMessages, messageObject];
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    handleIncomingMessage(inputValue);
    socket?.emit(EventsKeys.NEW_CLIENT_MESSAGE, inputValue);
    setInputValue("");
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value.trimStart();
    setInputValue(inputValue);
  };

  const handleRoomClick = (roomName: RoomKeys) => {
    setActiveRoom(roomName);
  };

  return (
    <>
      <Container maxWidth="lg" sx={{ paddingTop: "2rem" }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="stretch"
          spacing={0.5}
        >
          <Card
            sx={{
              marginRight: "10px",
              borderColor: "blue",
              minWidth: "15%",
              padding: "10px",
            }}
            variant="outlined"
          >
            <Typography variant="h5" component="h2">
              Rooms
            </Typography>
            <Stack>
              {rooms.map((roomEl) => (
                <RoomListElement
                  roomName={roomEl}
                  isActiveRoom={roomEl === activeRoom}
                  key={roomEl}
                  handleRoomClick={handleRoomClick}
                />
              ))}
            </Stack>
          </Card>
          <Box flexGrow="1">
            <Card
              variant="outlined"
              sx={{
                minHeight: "200px",
                height: "80vh",
                padding: "10px",
                overflow: "auto",
                borderColor: "blue",
              }}
            >
              {messages.map((message) => (
                <Message text={message.text} key={message.id} />
              ))}
              <Box ref={messageBoxRef} />
            </Card>
            <FormControl
              onSubmit={handleSubmit}
              component="form"
              sx={{ marginTop: "10px", width: "100%" }}
            >
              <TextField
                fullWidth
                placeholder="Your message"
                onChange={handleInputChange}
                value={inputValue}
                autoComplete="off"
              />
            </FormControl>
          </Box>
        </Stack>
      </Container>
    </>
  );
};

export default Home;
