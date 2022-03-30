import * as React from "react";
import { Box, Card, Container, FormControl, TextField } from "@mui/material";
import type { NextPage } from "next";
import { Message } from "../components/Message";
import io, { Socket } from "socket.io-client";
import { EventsKeys } from "../types";
interface IMessage {
  text: string;
  id: string;
}

const Home: NextPage = () => {
  const [inputValue, setInputValue] = React.useState("");
  const [messages, setMessages] = React.useState<IMessage[]>([]);
  const messageBoxRef = React.useRef<HTMLDivElement>(null);
  const [socket, setSocket] = React.useState<Socket | null>(null);

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
    setSocket(newSocket);
  }, []);

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleIncomingMessage = (data: string) => {
    console.log(data);
    addMessageToList(data);
  };

  React.useEffect(() => {
    setTimeout(() => addMessageToList("3sek"), 3000);
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
    socket?.emit(EventsKeys.NEW_CLIENT_MESSAGE, inputValue);
    setInputValue("");
  };

  const handleBoxClick = () => {
    addMessageToList("innyEvent");
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value.trimStart();
    setInputValue(inputValue);
  };

  return (
    <>
      <Container maxWidth="md" sx={{ paddingTop: "2rem" }}>
        <Card
          variant="outlined"
          sx={{
            minHeight: "200px",
            height: "80vh",
            padding: "10px",
            overflow: "auto",
            borderColor: "blue",
          }}
          onClick={handleBoxClick}
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
      </Container>
    </>
  );
};

export default Home;
