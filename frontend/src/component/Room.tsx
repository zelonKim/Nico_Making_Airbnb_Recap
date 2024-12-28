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
import React from "react";
import { FaCamera, FaRegHeart, FaStar } from "react-icons/fa";
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
      <VStack alignItems={"flex-start"}>
        <Box position="relative" overflow={"hidden"} mb={2} rounded="2xl">
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
          <Button
            variant={"unstyled"}
            cursor={"pointer"}
            position="absolute"
            top={0}
            right={0}
            color="gray.100"
            onClick={onCameraClick}
          >
            {isOwner ? <FaCamera size="20px" /> : <FaRegHeart size="20px" />}
          </Button>
        </Box>
        <Box>
          <Grid gap={2} templateColumns={"6fr 1fr"}>
            <Text as="b" noOfLines={1} fontSize="sm">
              {name}
            </Text>
            <HStack
              _hover={{
                color: "red.300",
              }}
              spacing={1}
            >
              <FaStar size={15} />
              <Text>{rating}</Text>
            </HStack>
          </Grid>
          <Text fontSize={"sm"} color={gray}>
            {city}, {country}
          </Text>
        </Box>
        <Text fontSize={"sm"} color={gray}>
          <Text as="b">${price}</Text> / night
        </Text>
      </VStack>
    </Link>
  );
}
