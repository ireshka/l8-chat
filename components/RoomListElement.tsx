import { Stack, Box } from "@mui/material";

type RoomListElementProps = {
  roomName: string;
  isActiveRoom: boolean;
};

export const RoomListElement = ({
  roomName,
  isActiveRoom,
}: RoomListElementProps) => {
  return (
    <Stack
      justifyContent="space-between"
      key={roomName}
      direction="row"
      alignItems="center"
      sx={{
        borderBottom: 1,
        borderColor: "blue",
      }}
    >
      <Box>{roomName}</Box>
      <Box sx={{ marginLeft: "10px" }} component={"ul"}>
        <Box
          sx={{
            width: "15px",
            height: "15px",
            backgroundColor: isActiveRoom ? "green" : "red",
            borderRadius: "50%",
            borderBottom: 1,
          }}
        ></Box>
      </Box>
    </Stack>
  );
};
