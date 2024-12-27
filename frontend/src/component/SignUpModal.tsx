import React from "react";

import {
  Box,
  Button,
  Divider,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  VStack,
  useDisclosure,
  useToast,
  Text,
} from "@chakra-ui/react";

import {
  FaEnvelope,
  FaLock,
  FaLockOpen,
  FaUnlock,
  FaUserCircle,
  FaUserLock,
} from "react-icons/fa";
import { IoAccessibility } from "react-icons/io5";
import SocialLogin from "./SocialLogin.tsx";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ISignUpError,
  ISignUpSuccess,
  ISignUpVariables,
  userSignUp,
} from "../api.ts";

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ISignUpForm {
  name: string;
  email: string;
  username: string;
  password: string;
  passwordConfirm: string;
}

export default function SignUpModal({ isOpen, onClose }: SignUpModalProps) {
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<ISignUpForm>();

  const onSubmit = ({
    name,
    email,
    username,
    password,
    passwordConfirm,
  }: ISignUpForm) => {
    mutation.mutate({ name, email, username, password, passwordConfirm });
  };

  const toast = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation<ISignUpSuccess, ISignUpError, ISignUpVariables>(
    userSignUp,
    {
      onMutate: () => {
        console.log("회원가입 시작");
      },

      onSuccess: (response) => {
        toast({
          title: "회원가입 성공",
          description: `${response.name}님 회원가입을 축하합니다 🥳`,
          status: "success",
          duration: 2000,
        });
        onClose();
        reset();
        queryClient.refetchQueries(["me"]);
      },

      onError: () => {
        console.log("에러 발생");
      },
    }
  );

  return (
    <Modal onClose={onClose} isOpen={isOpen}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>회원 가입</ModalHeader>
        <ModalCloseButton />
        <ModalBody as="form" onSubmit={handleSubmit(onSubmit)}>
          <VStack>
            <InputGroup>
              <InputLeftElement
                children={
                  <Box color="gray.500">
                    <IoAccessibility />
                  </Box>
                }
              />
              <Input
                {...register("name", {
                  required: "이름을 입력해주세요",
                  minLength: {
                    value: 2,
                    message: "이름은 두 글자 이상이여야 합니다.",
                  },
                })}
                variant={"filled"}
                placeholder="이름"
                isInvalid={Boolean(errors.name?.message)}
              />
            </InputGroup>
            <Text fontSize="sm" color="red.400" fontWeight={"bold"}>
              {errors.name?.message}
            </Text>

            <InputGroup>
              <InputLeftElement
                children={
                  <Box color="gray.500">
                    <FaEnvelope />
                  </Box>
                }
              />
              <Input
                {...register("email", {
                  required: "이메일을 입력해주세요",
                })}
                variant={"filled"}
                placeholder="이메일"
                isInvalid={Boolean(errors.email?.message)}
                type="email"
              />
            </InputGroup>
            <Text fontSize="sm" color="red.400" fontWeight={"bold"}>
              {errors.email?.message}
            </Text>

            <InputGroup>
              <InputLeftElement
                children={
                  <Box color="gray.500">
                    <FaUserCircle />
                  </Box>
                }
              />
              <Input
                {...register("username", {
                  required: "아이디를 입력해주세요",
                  minLength: {
                    value: 2,
                    message: "아이디는 두 글자 이상이여야 합니다.",
                  },
                })}
                variant={"filled"}
                placeholder="아이디"
                isInvalid={Boolean(errors.username?.message)}
              />
            </InputGroup>
            <Text fontSize="sm" color="red.400" fontWeight={"bold"}>
              {errors.username?.message}
            </Text>

            <InputGroup>
              <InputLeftElement
                children={
                  <Box color="gray.500">
                    <FaLock />
                  </Box>
                }
              />
              <Input
                {...register("password", {
                  required: "비밀번호를 입력해주세요",
                  minLength: {
                    value: 8,
                    message: "비밀번호는 8자리 이상이어야 합니다.",
                  },
                  maxLength: {
                    value: 15,
                    message: "비밀번호는 15자리 이하이어야 합니다.",
                  },
                })}
                variant={"filled"}
                placeholder="비밀번호"
                type="password"
                isInvalid={Boolean(errors.password?.message)}
              />
            </InputGroup>
            <Text fontSize="sm" color="red.400" fontWeight={"bold"}>
              {errors.password?.message}
            </Text>

            <InputGroup>
              <InputLeftElement
                children={
                  <Box color="gray.500">
                    <FaUserLock />
                  </Box>
                }
              />
              <Input
                {...register("passwordConfirm", {
                  required: "비밀번호 확인을 입력해주세요",
                })}
                variant={"filled"}
                placeholder="비밀번호 확인"
                type="password"
                isInvalid={Boolean(errors.passwordConfirm?.message)}
              />
            </InputGroup>
            <Text fontSize="sm" color="red.400" fontWeight={"bold"}>
              {errors.passwordConfirm?.message}
            </Text>
          </VStack>

          {mutation.isError ? (
            <Text color="red.500" textAlign={"center"} fontSize="sm">
              비밀번호가 일치하지 않습니다.
            </Text>
          ) : null}

          <Button
            isLoading={mutation.isLoading}
            type="submit"
            colorScheme={"red"}
            w="100%"
            mt="5"
          >
            Sign up
          </Button>
          <SocialLogin />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
