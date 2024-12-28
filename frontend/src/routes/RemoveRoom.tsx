import React from "react";
import ProtectedPage from "../component/ProtectedPage.tsx";
import HostOnlyPage from "../component/HostOnlyPage.tsx";
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  Heading,
  Input,
  InputGroup,
  InputLeftAddon,
  Select,
  Text,
  Textarea,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { FaBed, FaDollarSign, FaToilet } from "react-icons/fa";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  IUploadRoomVariables,
  getAmenities,
  getCategories,
  getRooms,
  uploadRoom,
} from "../api.ts";
import { IAmenity, ICategory, IRoomDetail, IRoomList } from "../../types.ts";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

export default function RemoveRoom() {
  const { register, watch, handleSubmit } = useForm<IUploadRoomVariables>();

  const { data, isLoading } = useQuery<IRoomList[]>(["rooms"], getRooms);

  const toast = useToast();
  const navigate = useNavigate();

  //   const mutation = useMutation(removeRoom, {
  //     onSuccess: (data: IRoomDetail) => {
  //       toast({
  //         title: "방이 삭제 되었습니다.",
  //         status: "success",
  //         position: "bottom-right",
  //       });
  //       navigate(`/`);
  //     },
  //   });

  // const onSubmit = (data: IUploadRoomVariables) => {
  //   mutation.mutate(data);
  // };

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
            <Heading textAlign={"center"}>Remove Room</Heading>

            <VStack
              spacing={10}
              mt={5}
              as="form"
              //   onSubmit={handleSubmit(onSubmit)}
            >
              <FormControl>
                <FormLabel>삭제할 방</FormLabel>
                <Select
                  {...register("name", { required: true })}
                  placeholder="삭제할 방을 선택해주세요"
                >
                  {data?.map((room) => (
                    <option key={room.pk} value={room.pk}>
                      {room.name}
                    </option>
                  ))}
                </Select>
                <FormHelperText>어떤 방을 삭제하실건가요?</FormHelperText>
              </FormControl>

              {/* {mutation.isError ? (
                <Text color="red.400">삭제할 방을 선택해주세요</Text>
              ) : null} */}

              <Button
                type="submit"
                // isLoading={mutation.isLoading}
                colorScheme={"red"}
                size="lg"
                w="100%"
              >
                방 지우기
              </Button>
            </VStack>
          </Container>
        </Box>
      </HostOnlyPage>
    </ProtectedPage>
  );
}
