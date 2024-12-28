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
  uploadRoom,
} from "../api.ts";
import { IAmenity, ICategory, IRoomDetail } from "../../types.ts";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

export default function UploadRoom() {
  const { register, watch, handleSubmit } = useForm<IUploadRoomVariables>();

  const { data: amenities, isLoading: isAmenitiesLoading } = useQuery<
    IAmenity[]
  >(["amenities"], getAmenities);

  const { data: categories, isLoading: isCategoriesLoading } = useQuery<
    ICategory[]
  >(["categories"], getCategories);

  console.log(watch());

  const toast = useToast();

  const navigate = useNavigate();

  const mutation = useMutation(uploadRoom, {
    onSuccess: (data: IRoomDetail) => {
      toast({
        title: "방이 업로드 되었습니다.",
        status: "success",
        position: "bottom-right",
      });
      navigate(`/rooms/${data.id}`);
    },
  });

  const onSubmit = (data: IUploadRoomVariables) => {
    mutation.mutate(data);
  };

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

            <VStack
              spacing={10}
              mt={5}
              as="form"
              onSubmit={handleSubmit(onSubmit)}
            >
              <FormControl>
                <FormLabel>방 이름</FormLabel>
                <Input
                  {...register("name", { required: true })}
                  required
                  type="text"
                />
                <FormHelperText>
                  업로드할 방의 이름은 무엇인가요?
                </FormHelperText>
              </FormControl>

              <FormControl>
                <FormLabel>국가</FormLabel>
                <Input
                  {...register("country", { required: true })}
                  required
                  type="text"
                />
              </FormControl>

              <FormControl>
                <FormLabel>도시</FormLabel>
                <Input
                  {...register("city", { required: true })}
                  required
                  type="text"
                />
              </FormControl>

              <FormControl>
                <FormLabel>주소</FormLabel>
                <Input
                  {...register("address", { required: true })}
                  required
                  type="text"
                />
              </FormControl>

              <FormControl>
                <FormLabel>가격</FormLabel>
                <InputGroup>
                  <InputLeftAddon children={<FaDollarSign />} />
                  <Input
                    {...register("price", { required: true })}
                    required
                    type="number"
                    min={0}
                  />
                </InputGroup>
              </FormControl>

              <FormControl>
                <FormLabel>방 개수</FormLabel>
                <InputGroup>
                  <InputLeftAddon children={<FaBed />} />
                  <Input
                    {...register("rooms", { required: true })}
                    required
                    type="number"
                    min={1}
                  />
                </InputGroup>
              </FormControl>

              <FormControl>
                <FormLabel>화장실 개수</FormLabel>
                <InputGroup>
                  <InputLeftAddon children={<FaToilet />} />
                  <Input
                    {...register("toilets", { required: true })}
                    required
                    type="number"
                    min={0}
                  />
                </InputGroup>
              </FormControl>

              <FormControl>
                <FormLabel>설명</FormLabel>
                <Textarea {...register("description", { required: true })} />
              </FormControl>

              <FormControl>
                <Checkbox {...register("pet_friendly", { required: false })}>
                  애완동물 여부
                </Checkbox>
              </FormControl>

              <FormControl>
                <FormLabel>방 종류</FormLabel>
                <Select
                  {...register("kind", { required: true })}
                  placeholder="방의 종류를 선택해주세요"
                >
                  <option value="entire_place">Entire Place</option>
                  <option value="private_room">Private Room</option>
                  <option value="shared_room">Shared Room</option>
                </Select>
                <FormHelperText>
                  업로드할 방의 종류는 무엇인가요?
                </FormHelperText>
              </FormControl>

              <FormControl>
                <FormLabel>카테고리</FormLabel>
                <Select
                  {...register("category", { required: true })}
                  placeholder="방의 카테고리를 선택해주세요"
                >
                  {categories?.map((category) => (
                    <option key={category.pk} value={category.pk}>
                      {category.name}
                    </option>
                  ))}
                </Select>
                <FormHelperText>
                  업로드할 방의 카테고리는 무엇인가요?
                </FormHelperText>
              </FormControl>

              <FormControl>
                <FormLabel>편의시설</FormLabel>
                <Grid templateColumns={"1fr 1fr"} gap={5}>
                  {amenities?.map((amenity) => (
                    <Box key={amenity.pk}>
                      <Checkbox
                        value={amenity.pk}
                        {...register("amenities", { required: true })}
                      >
                        {amenity.name}
                      </Checkbox>
                      <FormHelperText>{amenity.description}</FormHelperText>
                    </Box>
                  ))}
                </Grid>
              </FormControl>

              {mutation.isError ? (
                <Text color="red.400">유효한 정보를 입력해주세요</Text>
              ) : null}

              <Button
                type="submit"
                isLoading={mutation.isLoading}
                colorScheme={"red"}
                size="lg"
                w="100%"
              >
                방 올리기
              </Button>
            </VStack>
          </Container>
        </Box>
      </HostOnlyPage>
    </ProtectedPage>
  );
}
