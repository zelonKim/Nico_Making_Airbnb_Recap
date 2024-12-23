import React from "react";
import { Button, HStack, Heading, Text, VStack } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <VStack bg="gray.100" justifyContent={"center"} minH="100vh">
      <Heading>Page not found</Heading>
      <Text>It seems that you are lost</Text>
      <Link to="/">
        <Button colorScheme={"red"} variant={"outline"}>
          Go Home &rarr;
        </Button>
      </Link>
    </VStack>
  );
}
