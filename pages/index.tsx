import * as React from "react";
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
  const [rooms, setRooms] = React.useState<RoomKeys[]>([
    RoomKeys.GENERAL,
    RoomKeys.NIGHTALK,
    RoomKeys.TEST,
  ]);
  const [activeRoom, setActiveRoom] = React.useState(RoomKeys.GENERAL);

  const scrollToBottom = () => {
    messageBoxRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  };

  React.useEffect(() => {
    const newSocket = io(`http://${window.location.hostname}:3000`);
    newSocket.on(EventsKeys.CONNECTED, (data) => handleIncomingMessage(data));
    newSocket.on(EventsKeys.SERVER_MESSAGE, (data) => {
      console.log("ok, i got serverMessage");
      handleIncomingMessage(data);
    });
    newSocket.on(EventsKeys.JOINED, handleChangeRoom);
    newSocket?.emit(EventsKeys.JOIN, activeRoom);
    setSocket(newSocket);
    return () => {
      newSocket.removeAllListeners();
      newSocket.close();
    };
  }, []);

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleIncomingMessage = (data: string) => {
    console.log(data);
    addMessageToList(data);
  };

  const handleChangeRoom = (roomName: RoomKeys) => {
    console.log(`I want to new active room: ${roomName}`);
    console.log(`Actual active room: ${activeRoom}`);
    setActiveRoom(() => roomName);
  }

  React.useEffect(() => {
    const timeoutId = setTimeout(() => addMessageToList("3sek"), 3000);
    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  const addMessageToList = (text: string) => {
    setMessages((prevMessages) => {
      const messageObject = {
        text,
        id: Math.random().toString(),
      };
      const newMessages = [...prevMessages, messageObject];
      return newMessages;
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    handleIncomingMessage(inputValue);
    socket?.emit(EventsKeys.NEW_CLIENT_MESSAGE, inputValue);
    setInputValue("");
  };

  // const handleBoxClick = () => {
  //   addMessageToList("innyEvent");
  // };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value.trimStart();
    setInputValue(inputValue);
  };

  const handleRoomClick = (roomName: RoomKeys) => {
    console.log(`Actual room name: ${activeRoom}`);
    console.log("Room change");
    socket?.emit(EventsKeys.JOIN, roomName);
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
              // onClick={handleBoxClick}
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
