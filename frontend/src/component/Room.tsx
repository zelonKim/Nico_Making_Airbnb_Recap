import {
  Box,
  Button,
  Grid,
  HStack,
  Image,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useState } from "react";
import {
  FaCamera,
  FaHeart,
  FaRegHeart,
  FaRegStar,
  FaStar,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

interface IRoomProps {
  imageUrl: string;
  name: string;
  rating: number;
  city: string;
  country: string;
  price: number;
  pk: number;
  isOwner: boolean;
}

export default function Room({
  pk,
  imageUrl,
  name,
  rating,
  city,
  country,
  price,
  isOwner,
}: IRoomProps) {
  const gray = useColorModeValue("gray.600", "gray.300");
  const navigate = useNavigate();

  const onCameraClick = (event: React.SyntheticEvent<HTMLButtonElement>) => {
    event.preventDefault();
    navigate(`/rooms/${pk}/photos`);
  };

 

  return (
    <Link to={`./rooms/${pk}`}>
      <VStack alignItems={"flex-start"} mb={8}>
        <Box position="relative" overflow={"hidden"} mb={1.5} rounded="3xl">
          {imageUrl ? (
            <Image
              objectFit={"cover"}
              h="280px"
              maxH="280px"
              w="310px"
              maxW={{
                lg: "280px",
              }}
              src={imageUrl}
            />
          ) : (
            <Box
              objectFit={"cover"}
              bg="gray.300"
              h="280px"
              maxH="280px"
              w="310px"
              maxW={{
                lg: "280px",
              }}
            >
              <Text
                textAlign={"center"}
                textColor={"gray.50"}
                fontSize={"lg"}
                pt={32}
              >
                사진을 업로드 해주세요
              </Text>
            </Box>
          )}
          {isOwner ? (
            <Button
              variant={"unstyled"}
              cursor={"pointer"}
              position="absolute"
              top={0}
              right={0}
              color="gray.100"
              onClick={onCameraClick}
            >
              <FaCamera color="white" size="20px" />
            </Button>
          ) : null}
        </Box>
        <Box>
          <Grid ml={2} gap={16} templateColumns={"6fr 1fr"}>
            <Text fontWeight={"semibold"} noOfLines={1} fontSize="md">
              {name}
            </Text>
            <HStack spacing={1} color={"red.400"}>
              <FaStar size={15} />
              <Text>{rating}</Text>
            </HStack>
          </Grid>
          <Text ml={2} mt={1} fontSize={"sm"} color={gray}>
            {city}, {country}
          </Text>

          <Text ml={2} mt={2} fontSize={"sm"}>
            <Text as="b">${price}</Text> / night
          </Text>
        </Box>
      </VStack>
    </Link>
  );
}
