import {
  Box,
  Button,
  Grid,
  HStack,
  Heading,
  Image,
  Skeleton,
  SkeletonText,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { FaHeart, FaRegHeart, FaStar } from "react-icons/fa";
import Room from "../component/Room.tsx";
import RoomSkeleton from "../component/RoomSkeleton.tsx";
import { useQuery } from "@tanstack/react-query";
import { getRooms } from "../api.ts";
import { Link } from "react-router-dom";
import { IRoomList } from "../../types";

export default function Home() {
  // const [isLoading, setIsLoading] = useState(true);
  // const [rooms, setRooms] = useState<IRoom[]>([]);

  // const fetchRooms = async () => {
  //   const response = await fetch("http://127.0.0.1:8000/api/v1/rooms/");
  //   const json = await response.json();
  //   setRooms(json);
  //   setIsLoading(false);
  // };

  // useEffect(() => {
  //   fetchRooms();
  // }, []);

  const response = useQuery<IRoomList[]>(["rooms"], getRooms);

  console.log(response);

  return (
    <Grid
      mt={10}
      px={{
        base: 10,
        lg: 40,
      }}
      columnGap={4}
      rowGap={8}
      templateColumns={{
        sm: "1fr", // 스마트폰 사이즈 디자인
        md: "1fr 1fr",
        lg: "repeat(3, 1fr)",
        xl: "repeat(4, 1fr)",
        "2xl": "repeat(5, 1fr)",
      }}
    >
      {response.isLoading ? (
        <>
          <RoomSkeleton />
          <RoomSkeleton />
          <RoomSkeleton />
          <RoomSkeleton />
          <RoomSkeleton />
          <RoomSkeleton />
          <RoomSkeleton />
          <RoomSkeleton />
        </>
      ) : null}

      {response.data?.map((room) => (
        <Room
          key={room.pk}
          pk={room.pk}
          imageUrl={room.photos[0].file}
          name={room.name}
          rating={room.rating}
          city={room.city}
          country={room.country}
          price={room.price}
        />
      ))}
    </Grid>
  );
}
