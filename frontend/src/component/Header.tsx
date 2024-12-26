import {
  Avatar,
  Box,
  Button,
  Divider,
  HStack,
  IconButton,
  LightMode,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  useColorMode,
  useColorModeValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { FaAirbnb, FaMoon, FaSun } from "react-icons/fa";
import LoginModal from "./LoginModal.tsx";
import React from "react";
import SignUpModal from "./SignUpModal.tsx";
import { Link } from "react-router-dom";
import useUser from "../lib/useUser.ts";
import { logOut } from "../api.ts";
import { useQueryClient } from "@tanstack/react-query";

export default function Header() {
  const { userLoading, isLoggedIn, user } = useUser();
  const queryClient = useQueryClient();

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

  const { colorMode, toggleColorMode } = useColorMode(); // 다크모드와 관련된 상태 및 핸들러를 반환함.
  const logoColor = useColorModeValue("red.500", "red.200"); // 라이트 및 다크 상태에 대한 밸류를 지정함.
  const Icon = useColorModeValue(FaMoon, FaSun);

  const toast = useToast(); // 토스트를 사용할 수 있도록 해줌.

  const onLogOut = async () => {
    const toastId = toast({
      title: "로그아웃 중",
      description: "잠시만 기다려주세요.",
      status: "loading",
      position: "bottom-right",
    });

    await logOut();

    queryClient.refetchQueries(["me"]);

    setTimeout(() => {
      toast.update(toastId, {
        title: "로그아웃 완료",
        description: "다음에 또 뵈요.",
        status: "success",
      });
    }, 1000);
  };

  return (
    <Stack
      justifyContent={"space-between"}
      alignItems="center"
      py={5}
      px={40}
      direction={{
        sm: "column",
        md: "row",
      }}
      spacing={{
        sm: 4,
        md: 0,
      }}
      borderBottomWidth={"1"}
    >
      <Link to={"/"}>
        <Box color={logoColor}>
          <FaAirbnb size={"48"} />
        </Box>
      </Link>
      <HStack spacing={2}>
        <IconButton
          onClick={toggleColorMode}
          variant={"ghost"}
          aria-label="다크모드 전환"
          icon={<Icon />}
        />
        {!userLoading ? (
          !isLoggedIn ? (
            <>
              <Button onClick={onLoginOpen}>로그인</Button>
              <LightMode>
                <Button onClick={onSignUpOpen} colorScheme={"red"}>
                  회원가입
                </Button>
              </LightMode>
            </>
          ) : (
            <Menu>
              <MenuButton>
                <Avatar name={user.name} src={user.avatar} size={"md"} />
              </MenuButton>
              <MenuList>
                <MenuItem onClick={onLogOut}>로그아웃</MenuItem>
                <MenuItem>설정</MenuItem>
              </MenuList>
            </Menu>
          )
        ) : null}
      </HStack>
      <LoginModal isOpen={isLoginOpen} onClose={onLoginClose} />
      <SignUpModal isOpen={isSignUpOpen} onClose={onSignUpClose} />
    </Stack>
  );
}
