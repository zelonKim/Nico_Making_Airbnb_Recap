import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import ProtectedPage from "../component/ProtectedPage.tsx";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Input,
  VStack,
  useToast,
} from "@chakra-ui/react";
import HostOnlyPage from "../component/HostOnlyPage.tsx";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  changeProfile,
  createPhoto,
  getUploadURL,
  uploadImage,
} from "../api.ts";
import useUser from "../lib/useUser.ts";

interface IForm {
  file: FileList;
}

interface IUploadURLResponse {
  id: string;
  uploadURL: string;
}

export default function Profile() {
  const { userLoading, isLoggedIn, user } = useUser();

  const queryClient = useQueryClient();

  const { register, watch, handleSubmit, reset } = useForm<IForm>();

  const toast = useToast();

  const profileMutation = useMutation(changeProfile, {
    onSuccess: () => {
      queryClient.refetchQueries(["me"]);
      toast({
        status: "success",
        title: "프로필 변경에 성공하였습니다.",
        duration: 2000,
        isClosable: true,
      });
    },
    onError: () => {
      toast({
        status: "error",
        title: "프로필 변경에 실패하였습니다.",
        duration: 2000,
        isClosable: true,
      });
    },
  });

  const onSubmit = (data: any) => {
    profileMutation.mutate(data);
  };

  return (
    <ProtectedPage>
      <Box pb={40} mt={10} px={{ base: 10, lg: 40 }}>
        <Container>
          <Heading textAlign={"center"}>프로필 변경</Heading>
          <VStack
            as="form"
            onSubmit={handleSubmit(onSubmit)}
            spacing={5}
            mt={10}
          >
            <FormControl>
              <HStack mb={5}>
                <FormLabel w="25%" fontSize="lg" fontWeight="bold">
                  아바타 사진
                </FormLabel>
                <Input
                  rounded="lg"
                  {...register("avatar")}
                  w="90%"
                  ml={30}
                  mb={5}
                  placeholder={user.avatar}
                  type="url"
                />
              </HStack>

              <HStack mb={5}>
                <FormLabel w="25%" fontSize="lg" fontWeight="bold">
                  이름
                </FormLabel>

                <Input
                  rounded="lg"
                  {...register("name")}
                  w="90%"
                  ml={30}
                  mb={5}
                  placeholder={user.name}
                />
              </HStack>

              <HStack mb={5}>
                <FormLabel w="25%" fontSize="lg" fontWeight="bold">
                  현재 비밀번호
                </FormLabel>

                <Input
                  rounded="lg"
                  {...register("oldPassword")}
                  w="90%"
                  ml={30}
                  mb={5}
                  type="password"
                />
              </HStack>

              <HStack mb={5}>
                <FormLabel w="25%" fontSize="lg" fontWeight="bold">
                  새로운 비밀번호
                </FormLabel>

                <Input
                  rounded="lg"
                  {...register("NewPassword")}
                  w="90%"
                  ml={30}
                  mb={5}
                  type="password"
                />
              </HStack>

              <HStack mb={15}>
                <FormLabel w="25%" fontSize="lg" fontWeight="bold">
                  이메일 주소
                </FormLabel>

                <Input
                  rounded="lg"
                  {...register("email")}
                  w="90%"
                  ml={30}
                  mb={5}
                  type="email"
                  placeholder={user.email}
                />
              </HStack>
            </FormControl>
            <Button type="submit" w="100%" colorScheme={"red"}>
              변경하기
            </Button>
          </VStack>
        </Container>
      </Box>
    </ProtectedPage>
  );
}
