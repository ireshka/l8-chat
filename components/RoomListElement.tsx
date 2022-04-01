import { Stack, Box } from "@mui/material";

type RoomListElementProps = {
  roomName: string;
  isActiveRoom: boolean;
  handleRoomClick: (roomName: string) => void;
};

export const RoomListElement = ({
  roomName,
  isActiveRoom,
  handleRoomClick,
}: RoomListElementProps) => {
  return (
    <Stack
      onClick={() => handleRoomClick(roomName)}
      component="li"
      justifyContent="space-between"
      key={roomName}
      direction="row"
      alignItems="center"
      sx={{
        borderBottom: 1,
        borderColor: "primary.light",
        cursor: "pointer",
        padding: "10px 0",
      }}
    >
      <Box>{roomName}</Box>
      <Box
        sx={{
          width: "15px",
          height: "15px",
          backgroundColor: isActiveRoom ? "green" : "red",
          borderRadius: "50%",
          marginLeft: "10px",
        }}
      ></Box>
    </Stack>
  );
};
