import { Box, Heading, Skeleton, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getRoom } from "../api.ts";
import { IRoomDetail, IRoomList } from "../types.ts";
import React from "react";



export default function RoomDetail() {
  const { roomPk } = useParams();
  const { isLoading, data } = useQuery<IRoomDetail>(["rooms", roomPk], getRoom);

  return (
    <Box
      mt={10}
      px={{
        base: 10,
        lg: 40,
      }}
    >
      <Skeleton>
        <Heading>{data?.name}</Heading>
      </Skeleton>
    </Box>
  );
}
