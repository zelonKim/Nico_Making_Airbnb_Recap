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

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SignUpModal({ isOpen, onClose }: SignUpModalProps) {
  return (
    <Modal onClose={onClose} isOpen={isOpen}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>회원 가입</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack>
            <InputGroup>
              <InputLeftElement
                children={
                  <Box color="gray.500">
                    <IoAccessibility />
                  </Box>
                }
              />
              <Input variant={"filled"} placeholder="이름" />
            </InputGroup>

            <InputGroup>
              <InputLeftElement
                children={
                  <Box color="gray.500">
                    <FaEnvelope />
                  </Box>
                }
              />
              <Input variant={"filled"} placeholder="이메일" />
            </InputGroup>

            <InputGroup>
              <InputLeftElement
                children={
                  <Box color="gray.500">
                    <FaUserCircle />
                  </Box>
                }
              />
              <Input variant={"filled"} placeholder="아이디" />
            </InputGroup>

            <InputGroup>
              <InputLeftElement
                children={
                  <Box color="gray.500">
                    <FaLock />
                  </Box>
                }
              />
              <Input variant={"filled"} placeholder="비밀번호" />
            </InputGroup>

            <InputGroup>
              <InputLeftElement
                children={
                  <Box color="gray.500">
                    <FaUserLock />
                  </Box>
                }
              />
              <Input variant={"filled"} placeholder="비밀번호 확인" />
            </InputGroup>
          </VStack>
          <Button colorScheme={"red"} w="100%" mt="5">
            Sign up
          </Button>
          <SocialLogin />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
