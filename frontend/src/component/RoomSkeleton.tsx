import { Box, Skeleton, SkeletonText } from "@chakra-ui/react";
import React from "react";

export default function RoomSkeleton() {
  return (
    <Box>
      <Skeleton rounded="2xl" h={280} mb={7} />
      <SkeletonText w="50%" noOfLines={3} />
    </Box>
  );
}
