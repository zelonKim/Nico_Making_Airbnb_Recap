import React, { useEffect } from "react";
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
  Spinner,
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
  removeRoom,
  uploadRoom,
} from "../api.ts";
import { IAmenity, ICategory, IRoomDetail, IRoomList } from "../../types.ts";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

export interface IRemoveRoomDetailVariables {
  roomPk: number;
}

export default function RemoveRoomDetail() {
  const { roomPk } = useParams();

  const toast = useToast();
  const navigate = useNavigate();

  const mutation = useMutation(removeRoom, {
    onSuccess: () => {
      toast({
        title: "방이 삭제되었습니다.",
        status: "success",
        position: "bottom-right",
      });
      navigate(`/`);
    },
    onError: () => {
      toast({
        title: "방의 소유자만 삭제할 수 있습니다.",
        status: "error",
        position: "bottom-right",
      });
      navigate(`/`);
    },
  });

  useEffect(() => {
    mutation.mutate(roomPk!);
  }, []);

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
          <Text>wait for remove</Text>
        </Box>
      </HostOnlyPage>
    </ProtectedPage>
  );
}
