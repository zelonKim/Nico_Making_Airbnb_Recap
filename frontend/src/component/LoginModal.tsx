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
  Text,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { FaLock, FaUserCircle } from "react-icons/fa";
import SocialLogin from "./SocialLogin.tsx";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  IUsernameLoginError,
  IUsernameLoginSuccess,
  IUsernameLoginVariables,
  usernameLogIn,
} from "../api.ts";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface IForm {
  username: string;
  password: string;
}

interface IUsername {
  username: string;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  // const [username, setUsername] = useState("");
  // const [password, setPassword] = useState("");
  // const [email, setEmail] = useState("");
  // const [emailError, setEmailError] = useState("");

  // const onChange = (event: React.SyntheticEvent<HTMLInputElement>) => {
  //   const { name, value } = event.currentTarget;

  //   if (name === "username") {
  //     setUsername(value);
  //   } else if (name === "password") {
  //     setPassword(value);
  //   }
  // };

  // const onSubmit = (event: React.SyntheticEvent<HTMLDivElement>) => {
  //   event.preventDefault();
  //   if (!email.includes("@")) {
  //     setEmailError("유효한 이메일을 입력해주세요")
  //   }
  // };

  ////////////////////////

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<IForm>();
  // watch()를 통해 변화되는 상태값을 감지할 수 있음.
  // handleSubmit(핸들러명)을 통해 기본 동작 방지(preventDefault)와 유효성 검사를 수행하면서, 핸들러를 호출할 수 있음.
  // formState:{errors}를 통해 발생된 에러 객체를 가져올 수 있음.
  // setValue()를 통해 해당 요소에 값을 설정할 수 있음.
  // reset()을 통해 이전에 입력된 값을 없애줄 수 있음.

  const onSubmit = ({ username, password }: IForm) => {
    // 사용자가 Input에 입력한 값들이 담긴 객체가 매개변수로 전달됨.
    mutation.mutate({ username, password });
  };

  const toast = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation<
    IUsernameLoginSuccess,
    IUsernameLoginError,
    IUsernameLoginVariables
  >(usernameLogIn, {
    onMutate: () => {
      console.log("로그인 시작");
    },

    onSuccess: (response) => {
      toast({
        title: "로그인 성공",
        description: "환영합니다 🤗",
        status: "success",
        duration: 2000,
      });
      onClose();
      reset();
      setValue("username", response.username);
      queryClient.refetchQueries(["me"]);
    },

    onError: (error) => {
      console.log("에러 발생");
    },
  });

  return (
    <Modal onClose={onClose} isOpen={isOpen}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>로그인</ModalHeader>
        <ModalCloseButton />
        <ModalBody as="form" onSubmit={handleSubmit(onSubmit)}>
          <VStack>
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
                })} // ...register("속성명")를 통해 name, onChange, onBlur 속성을 정의할 수 있음.
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
                  required: "비밀번호를 입력해주세요", // react-hook-form에서 유효성 검사와 해당 에러메시지를 설정할 수 있음.
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
          </VStack>

          {mutation.isError ? (
            <Text color="red.500" textAlign={"center"} fontSize="sm">
              아이디나 비밀번호가 틀렸습니다.
            </Text>
          ) : null}

          <Button
            isLoading={mutation.isLoading}
            type="submit"
            colorScheme={"red"}
            w="100%"
            mt="5"
          >
            Log in
          </Button>
          <SocialLogin />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
