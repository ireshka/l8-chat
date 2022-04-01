import { Stack, Box } from "@mui/material";
import { RoomKeys } from '../types';

type RoomListElementProps = {
  roomName: RoomKeys;
  isActiveRoom: boolean;
  handleRoomClick: (roomName: RoomKeys) => void;
};

export const RoomListElement = ({
  roomName,
  isActiveRoom,
  handleRoomClick,
}: RoomListElementProps) => {
  console.log(roomName);
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
