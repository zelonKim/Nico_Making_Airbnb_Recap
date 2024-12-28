import React from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import ProtectedPage from "../component/ProtectedPage.tsx";
import {
  Box,
  Button,
  Container,
  FormControl,
  Heading,
  Input,
  VStack,
  useToast,
} from "@chakra-ui/react";
import HostOnlyPage from "../component/HostOnlyPage.tsx";
import { useMutation } from "@tanstack/react-query";
import { createPhoto, getUploadURL, uploadImage } from "../api.ts";

interface IForm {
  file: FileList;
}

interface IUploadURLResponse {
  id: string;
  uploadURL: string;
}

export default function UploadPhotos() {
  const { roomPk } = useParams();

  const { register, watch, handleSubmit, reset } = useForm<IForm>();

  const toast = useToast();

  const createPhotoMutation = useMutation(createPhoto, {
    onSuccess: () => {
      toast({
        status: "success",
        title: "이미지가 업로드 되었습니다.",
        duration: 2000,
        isClosable: true,
      });
      reset();
    },
  });

  const uploadImageMutation = useMutation(uploadImage, {
    onSuccess: ({ result }: any) => {
      if (roomPk) {
        createPhotoMutation.mutate({
          description: "uploaded Image file",
          file: `https://imagedelivery.net/5fz2uymv7PzfIfz2Y7_xhA/${result.id}/public`,
          roomPk,
        });
      }
    },
  });

  const uploadURLMutation = useMutation(getUploadURL, {
    onSuccess: (data: IUploadURLResponse) => {
      uploadImageMutation.mutate({
        uploadURL: data.uploadURL,
        file: watch("file"),
      });
    },
  });

  const onSubmit = (data: any) => {
    uploadURLMutation.mutate();
  };

  return (
    <ProtectedPage>
      <HostOnlyPage>
        <Box pb={40} mt={10} px={{ base: 10, lg: 40 }}>
          <Container>
            <Heading textAlign={"center"}> Upload Photo</Heading>
            <VStack
              as="form"
              onSubmit={handleSubmit(onSubmit)}
              spacing={5}
              mt={10}
            >
              <FormControl>
                <Input {...register("file")} type="file" accept="image/*" />
              </FormControl>
              <Button
                isLoading={
                  createPhotoMutation.isLoading ||
                  uploadImageMutation.isLoading ||
                  uploadURLMutation.isLoading
                }
                type="submit"
                w="full"
                colorScheme={"red"}
              >
                사진 올리기
              </Button>
            </VStack>
          </Container>
        </Box>
      </HostOnlyPage>
    </ProtectedPage>
  );
}
