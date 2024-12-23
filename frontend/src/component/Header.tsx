import {
  Box,
  Button,
  Divider,
  HStack,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
import { FaAirbnb, FaMoon } from "react-icons/fa";
import LoginModal from "./LoginModal.tsx";
import React from "react";
import SignUpModal from "./SignUpModal.tsx";

export default function Header() {
  const {
    isOpen: isLoginOpen,
    onClose: onLoginClose,
    onOpen: onLoginOpen,
  } = useDisclosure();
  const {
    isOpen: isSignUpOpen,
    onClose: onSignUpClose,
    onOpen: onSignUpOpen,
  } = useDisclosure();

  return (
    <HStack
      justifyContent={"space-between"}
      py={"5"}
      px={"10"}
      borderBottomWidth={"1"}
    >
      <Box color="red.500">
        <FaAirbnb size={"48"} />
      </Box>
      <HStack spacing={2}>
        <IconButton
          variant={"ghost"}
          aria-label="다크모드 전환"
          icon={<FaMoon />}
        />
        <Button onClick={onLoginOpen}>로그인</Button>
        <Button onClick={onSignUpOpen} colorScheme={"red"}>
          회원가입
        </Button>
      </HStack>

      <LoginModal isOpen={isLoginOpen} onClose={onLoginClose} />
      <SignUpModal isOpen={isSignUpOpen} onClose={onSignUpClose} />
    </HStack>
  );
}
