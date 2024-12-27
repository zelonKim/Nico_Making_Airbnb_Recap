import React from "react";
import ProtectedPage from "../component/ProtectedPage.tsx";
import HostOnlyPage from "../component/HostOnlyPage.tsx";
import {
  Box,
  Checkbox,
  Container,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputLeftAddon,
  Select,
  VStack,
} from "@chakra-ui/react";
import { FaBed, FaDollarSign, FaToilet } from "react-icons/fa";

export default function UploadRoom() {
  return (
    <ProtectedPage>
      <HostOnlyPage>
        <Box
          mt={10}
          px={{
            base: 10,
            lg: 40,
          }}
        >
          <Container>
            <Heading textAlign={"center"}>Upload Room</Heading>
            <VStack spacing={5} as="form" mt={5}>
              <FormControl>
                <FormLabel>방 이름</FormLabel>
                <Input required type="text" />
                <FormHelperText>
                  업로드할 방의 이름은 무엇인가요?
                </FormHelperText>
              </FormControl>

              <FormControl>
                <FormLabel>국가</FormLabel>
                <Input required type="text" />
              </FormControl>

              <FormControl>
                <FormLabel>도시</FormLabel>
                <Input required type="text" />
              </FormControl>

              <FormControl>
                <FormLabel>주소</FormLabel>
                <Input required type="text" />
              </FormControl>

              <FormControl>
                <FormLabel>가격</FormLabel>
                <InputGroup>
                  <InputLeftAddon children={<FaDollarSign />} />
                  <Input required type="number" min={0} />
                </InputGroup>
              </FormControl>

              <FormControl>
                <FormLabel>방 개수</FormLabel>
                <InputGroup>
                  <InputLeftAddon children={<FaBed />} />
                  <Input required type="number" min={1} />
                </InputGroup>
              </FormControl>

              <FormControl>
                <FormLabel>화장실 개수</FormLabel>
                <InputGroup>
                  <InputLeftAddon children={<FaToilet />} />
                  <Input required type="number" min={0} />
                </InputGroup>
              </FormControl>
              <FormControl>
                <Checkbox>애완동물 여부</Checkbox>
              </FormControl>
              <FormControl>
                <FormLabel>방 종류</FormLabel>
                <Select placeholder="방의 종류를 선택해주세요">
                  <option value="entire_place">Entire Place</option>
                  <option value="private_room">Private Room</option>
                  <option value="shared_room">Shared Room</option>
                </Select>
                <FormHelperText>
                  업로드할 방의 종류는 무엇인가요?
                </FormHelperText>
              </FormControl>
            </VStack>
          </Container>
        </Box>
      </HostOnlyPage>
    </ProtectedPage>
  );
}
