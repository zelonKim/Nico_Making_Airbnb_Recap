import {
  Avatar,
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  HStack,
  Heading,
  Image,
  Skeleton,
  Text,
  Textarea,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useMutation, useQueries, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { IReview, IRoomDetail, IRoomList } from "../../types.ts";
import React, { useEffect, useState } from "react";
import Room from "../component/Room.tsx";
import { FaStar } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { checkBooking, getMe, uploadReview } from "../api.ts";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Helmet } from "react-helmet";
import "../calendar.css";

export default function RoomDetail() {
  const {
    isLoading: userIsLoading,
    data: user,
    isError: userIsError,
  } = useQuery(["me"], getMe, {
    retry: false,
  });

  const { register, watch, handleSubmit } = useForm<IReview>();

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

  const toast = useToast();

  const navigate = useNavigate();

  const mutation = useMutation(uploadReview, {
    onSuccess: () => {
      toast({
        title: "리뷰가 등록되었습니다.",
        status: "success",
        duration: 2000,
      });
      fetchReview();
    },
    onError: () => {
      toast({
        title: "올바른 형식의 리뷰가 아닙니다.",
        status: "error",
        duration: 2000,
      });
    },
  });

  const onSubmit = (data: IReview) => {
    mutation.mutate(data);
  };

  const [dates, setDates] = useState<Date[]>();

  const { data: checkBookingData, isLoading: isCheckingBooking } = useQuery(
    ["check", roomPk, dates],
    checkBooking,
    {
      cacheTime: 0,
      enabled: dates !== undefined,
    }
  );

  console.log(checkBookingData, isCheckingBooking);

  return (
    <Box
      mt={10}
      px={{
        base: 10,
        lg: 40,
      }}
    >
      <Helmet>
        <title>{room ? room?.name : "로딩중..."}</title>
      </Helmet>
      <Skeleton height={"115px"} width="30%" isLoaded={!isLoading}>
        <Heading>{room?.name}</Heading>
      </Skeleton>
      <Grid
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
      <Grid gap={20} templateColumns={"2fr 1fr"} maxW="container.lg">
        <Box>
          <HStack justifyContent={"space-between"} width={"100%"} mt={9}>
            <VStack alignItems={"flex-start"}>
              <Skeleton isLoaded={!isLoading} height={"30px"}>
                <Heading fontSize={"2xl"} noOfLines={1}>
                  House hosted by. {room?.owner?.name}
                </Heading>
              </Skeleton>
              <Skeleton isLoaded={!isLoading} height={"30px"}>
                <HStack fontSize={"xl"} justifyContent={"flex-start"} w="100%">
                  <Text>
                    {room?.rooms} room{room?.rooms === 1 ? "" : "s"} &{" "}
                    {room?.toilets} toilet{room?.toilets === 1 ? "" : "s"}
                  </Text>
                </HStack>
              </Skeleton>
            </VStack>
            <Avatar
              name={room?.owner?.name}
              size={"lg"}
              src={room?.owner?.avatar}
            />
          </HStack>

          <Box mt={16}>
            <Heading
              fontStyle={"italic"}
              fontWeight={"semibold"}
              mb={5}
              fontSize={"lg"}
            >
              <HStack>
                <FaStar /> <Text>평균 {room?.rating} 점 </Text>
                <Text>-</Text>
                <Text> 총 {reviews?.length} 개의 리뷰</Text>
              </HStack>
            </Heading>

            <Container mt={6} maxW="container.lg" marginX="none">
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
                      </VStack>
                    </HStack>
                    <Text fontStyle={"italic"}>{review.payload}</Text>
                  </VStack>
                ))}
              </Grid>
            </Container>
          </Box>
        </Box>
        <Box pt={10}>
          <Calendar
            onChange={setDates}
            prev2Label={null}
            next2Label={null}
            minDetail="month"
            minDate={new Date()}
            maxDate={new Date(Date.now() + 60 * 60 * 24 * 7 * 4 * 6 * 1000)}
            selectRange
          />
          <Button
            disabled={!checkBookingData?.ok}
            w="100%"
            colorScheme={"red"}
            mt={5}
          >
            예약하기
          </Button>
          {!isCheckingBooking && !checkBookingData?.ok ? (
            <Text color="red.500">
              죄송합니다, 해당 일정은 이미 예약이 꽉찼습니다.
            </Text>
          ) : null}
        </Box>
      </Grid>

      <HStack
        spacing={10}
        mt={5}
        mb={5}
        as="form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormControl>
          <FormLabel>리뷰 남기기</FormLabel>
          <HStack>
            <Avatar name={user?.name} size={"lg"} src={user?.avatar} />
            <Textarea
              maxLength={100}
              {...register("payload", { required: true })}
              placeholder="최대 100자까지 등록 가능합니다."
            />
          </HStack>
        </FormControl>
        <VStack>
          <FormControl>
            <FormLabel>
              <HStack ml="-5" mt="6">
                <FaStar />
                <Text fontSize={"xs"} w="100px">
                  1~10점
                </Text>
              </HStack>
            </FormLabel>

            <Textarea
              {...register("rating", { required: true })}
              as="input"
              type="number"
              w="60px"
              min={1}
              max={10}
              ml="-5"
              mb="18"
              placeholder="/ 10"
            />
          </FormControl>
        </VStack>
        <Button p="9" type="submit" colorScheme={"red"} size="md" w="100px">
          리뷰 등록
        </Button>
        <Textarea
          {...register("user", { required: true })}
          w="50px"
          value={user}
          hidden
        />
        <Textarea
          {...register("roomPk", { required: true })}
          w="50px"
          value={roomPk}
          hidden
        />
      </HStack>
    </Box>
  );
}
