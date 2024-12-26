import {
  Avatar,
  Box,
  Container,
  Grid,
  GridItem,
  HStack,
  Heading,
  Image,
  Skeleton,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useQueries, useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { IReview, IRoomDetail, IRoomList } from "../../types.ts";
import React, { useEffect, useState } from "react";
import Room from "../component/Room.tsx";
import { FaStar } from "react-icons/fa";

export default function RoomDetail() {
  const { roomPk } = useParams();
  // const { isLoading, data } = useQuery<IRoomDetail[]>([`rooms`, roomPk], getRoom);

  // const { data: reviewsData, isLoading: isReviewsLoading } = useQuery<
  //   IReview[]
  // >([`rooms`, roomPk, `reviews`], getRoomReviews);

  /////////////////////////

  const [isLoading, setIsLoading] = useState(true);
  const [room, setRoom] = useState<IRoomDetail[]>([]);

  const [isReviewLoading, setIsReviewLoading] = useState(true);
  const [reviews, setReviews] = useState<IReview[]>([]);

  const fetchRoom = async () => {
    const response = await fetch(
      `http://127.0.0.1:8000/api/v1/rooms/${roomPk}`
    );
    const json = await response.json();
    setRoom(json);
    setIsLoading(false);
  };

  const fetchReview = async () => {
    const response = await fetch(
      `http://127.0.0.1:8000/api/v1/rooms/${roomPk}/reviews`
    );
    const json = await response.json();
    setReviews(json);
    setIsReviewLoading(false);
  };

  useEffect(() => {
    fetchRoom();
    fetchReview();
  }, []);

  return (
    <Box
      mt={10}
      px={{
        base: 10,
        lg: 40,
      }}
    >
      <Skeleton height={"43px"} width="25%" isLoaded={!isLoading}>
        <Heading>{room?.name}</Heading>
      </Skeleton>
      <Grid
        mt={{
          sm: 200,
          md: 150,
          lg: 100,
          xl: 62,
        }}
        rounded="xl"
        overflow={"hidden"}
        gap={3}
        height="60vh"
        templateRows={"1fr 1fr"}
        templateColumns={"repeat(4,1fr)"}
      >
        {room?.photos?.map((photo, index) => (
          <GridItem
            colSpan={index === 0 ? 2 : 1}
            rowSpan={index === 0 ? 2 : 1}
            overflow={"hidden"}
            key={index}
          >
            <Skeleton isLoaded={!isLoading} h="100%" w="100%">
              <Image objectFit={"cover"} w="100%" h="100%" src={photo.file} />
            </Skeleton>
          </GridItem>
        ))}
      </Grid>
      <HStack width={"100%"} justifyContent={"space-between"} mt={10}>
        <VStack alignItems={"flex-start"}>
          <Skeleton isLoaded={!isLoading} height={"30px"}>
            <Heading fontSize={"2xl"}>
              House hosted by {room?.owner?.name}
            </Heading>
          </Skeleton>
          <Skeleton isLoaded={!isLoading} height={"30px"}>
            <HStack fontSize={"xl"} justifyContent={"flex-start"} w="100%">
              <Text>
                {room?.toilets} toilet{room?.toilets === 1 ? "" : "s"}
              </Text>
              <Text>ᐧ</Text>
              <Text>
                {room?.rooms} room{room?.rooms === 1 ? "" : "s"}
              </Text>
            </HStack>
          </Skeleton>
        </VStack>
        <Avatar
          name={room?.owner?.name}
          size={"xl"}
          src={room?.owner?.avatar}
        />
      </HStack>
      <Box mt={10}>
        <Heading mb={5} fontSize={"2xl"}>
          <HStack>
            <FaStar /> <Text> {room?.rating} </Text>
            <Text>ᐧ</Text>
            <Text>
              {reviews?.length} Review{reviews?.length === 1 ? "" : "s"}
            </Text>
          </HStack>
        </Heading>

        <Container mt={15} maxW="container.lg" marginX="none">
          <Grid gap={10} templateColumns={"1fr 1fr"}>
            {reviews?.map((review, index) => (
              <VStack align={"flex-start"} key={index}>
                <HStack>
                  <Avatar
                    name={review.user.name}
                    src={review.user.avatar}
                    size="md"
                  />
                  <VStack spacing={0} alignItems={"flex-start"}>
                    <Heading fontSize={"md"}>{review.user.name}</Heading>
                    <HStack spacing={1}>
                      <FaStar size="12px" />
                      <Text>{review.rating}</Text>
                    </HStack>
                    <Text>{review.payload}</Text>
                  </VStack>
                </HStack>
              </VStack>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
