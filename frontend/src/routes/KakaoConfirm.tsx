import { Heading, Spinner, Text, VStack, useToast } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { kakaoLogIn } from "../api.ts";
import { useQueryClient } from "@tanstack/react-query";

export default function KakaoConfirm() {
  const { search } = useLocation();
  const toast = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const confirmLogin = async () => {
    const params = new URLSearchParams(search);
    const code = params.get("code");

    if (code) {
      const status = await kakaoLogIn(code);
      if (status === 200) {
        toast({
          status: "success",
          title: "환영합니다",
          description: "카카오톡으로 로그인 하였습니다.",
          position: "bottom-right",
        });
        queryClient.refetchQueries(["me"]);
        navigate("/");
      }
    }
  };

  useEffect(() => {
    confirmLogin();
  }, []);

  return (
    <VStack justifyContent={"center"} mt={40}>
      <Heading>Processing log in...</Heading>
      <Text>Don`t get out</Text>
      <Spinner size="lg"></Spinner>
    </VStack>
  );
}
