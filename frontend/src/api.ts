import { QueryFunctionContext } from "@tanstack/react-query";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000/api/v1/",
});

export const getRooms = () =>
  axiosInstance.get("rooms/").then((response) => response.data);

export const getRoom = ({ queryKey }) => {
  const [_, roomPk] = queryKey;
  axiosInstance.get(`rooms/${roomPk}`).then((response) => response.data);
};
