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
      { code }, // request.data에 담아 백엔드로 보냄.
      { headers: { "X-CSRFToken": Cookie.get("csrftoken") || "" } }
    )
    .then((response) => response.status);

export const kakaoLogIn = (code: string) =>
  axiosInstance
    .post(
      `/users/kakao`,
      { code },
      { headers: { "X-CSRFToken": Cookie.get("csrftoken") || "" } }
    )
    .then((response) => response.status);

export interface IUsernameLoginVariables {
  username: string;
  password: string;
}

export interface IUsernameLoginSuccess {
  username: string;
}

export interface IUsernameLoginError {
  error: string;
}

////////////

export interface ISignUpVariables {
  name: string;
  email: string;
  username: string;
  password: string;
  passwordConfirm: string;
}

export interface ISignUpSuccess {
  name: string;
}

export interface ISignUpError {
  error: string;
}

////////////

export const usernameLogIn = ({
  username,
  password,
}: IUsernameLoginVariables) =>
  axiosInstance
    .post(
      `/users/log-in`,
      { username, password },
      { headers: { "X-CSRFToken": Cookie.get("csrftoken") || "" } }
    )
    .then((response) => response.data);



export const userSignUp = ({
  name,
  email,
  username,
  password,
  passwordConfirm,
}: ISignUpVariables) =>
  axiosInstance
    .post(
      `/users/sign-up`,
      { name, email, username, password, passwordConfirm },
      { headers: { "X-CSRFToken": Cookie.get("csrftoken") || "" } }
    )
    .then((response) => response.data);
