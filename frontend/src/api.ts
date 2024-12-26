import {
  QueryFunction,
  QueryFunctionContext,
  QueryKey,
} from "@tanstack/react-query";
import axios from "axios";
import { IRoomDetail } from "../types";
import Cookie from "js-cookie";

const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000/api/v1/",
  withCredentials: true,
});

export const getRooms = () =>
  axiosInstance.get("rooms/").then((response) => response.data);

// export const getRoom = ({ queryKey }: any) => {
//   const [_, roomPk] = queryKey;
//   axiosInstance.get(`rooms/${roomPk}`).then((response) => response.data);
// };

// export const getRoomReviews = ({ queryKey }: any) => {
//   console.log(queryKey);
//   const [_, roomPk] = queryKey;
//   axiosInstance
//     .get(`rooms/${roomPk}/reviews`)
//     .then((response) => response.data);
// };

export const getMe = () =>
  axiosInstance.get(`users/me`).then((response) => response.data);

export const logOut = () =>
  axiosInstance
    .post(`users/log-out`, null, {
      headers: { "X-CSRFToken": Cookie.get("csrftoken") || "" },
    })
    .then((response) => response.data);

export const githubLogIn = (code: string) =>
  axiosInstance
    .post(
      `/users/github`,
      { code },
      { headers: { "X-CSRFToken": Cookie.get("csrftoken") || "" } }
    )
    .then((response) => response.status);
