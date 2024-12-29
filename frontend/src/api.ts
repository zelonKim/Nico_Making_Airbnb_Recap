import {
  QueryFunction,
  QueryFunctionContext,
  QueryKey,
} from "@tanstack/react-query";
import axios from "axios";
import { IReview } from "../types.ts";
import Cookie from "js-cookie";
import { IRemoveRoomVariables } from "./routes/RemoveRoom";
import { IRemoveRoomDetailVariables } from "./routes/RemoveRoomDetail";
import { formatDate } from "./lib/utils.ts";

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

export const getAmenities = () =>
  axiosInstance.get(`rooms/amenities`).then((response) => response.data);

export const getCategories = () =>
  axiosInstance.get(`categories/`).then((response) => response.data);

export interface IUploadRoomVariables {
  name: string;
  country: string;
  city: string;
  price: number;
  rooms: number;
  toilets: number;
  description: string;
  address: string;
  pet_friendly: boolean;
  kind: string;
  amenities: number[];
  category: number;
}

export const uploadRoom = (variables: IUploadRoomVariables) =>
  axiosInstance
    .post(`rooms/`, variables, {
      headers: { "X-CSRFToken": Cookie.get("csrftoken") || "" },
    })
    .then((response) => response.data);

////////////

export const uploadReview = ({ roomPk, user, payload, rating }: IReview) =>
  axiosInstance
    .post(
      `rooms/${roomPk}/reviews`,
      { user, payload, rating },
      {
        headers: { "X-CSRFToken": Cookie.get("csrftoken") || "" },
      }
    )
    .then((response) => response.data);

/////////////////

export const getUploadURL = () =>
  axiosInstance
    .post(`medias/photos/get-url`, null, {
      headers: { "X-CSRFToken": Cookie.get("csrftoken") || "" },
    }) // 클라우드 플레어의 업로드할 URL을 얻어옴.
    .then((response) => response.data);

/////////////////////

export interface IUploadImageVariables {
  file: FileList;
  uploadURL: string;
}

export const uploadImage = ({ file, uploadURL }: IUploadImageVariables) => {
  const form = new FormData();
  form.append("file", file[0]);

  return axios
    .post(uploadURL, form, {
      headers: {
        "Content-Type": "multipart/form-data",
      }, // 해당 URL로 이미지 파일을 업로드함.
    })
    .then((response) => response.data);
};

/////////////////////

export interface ICreatePhotoVariables {
  description: string;
  file: string;
  roomPk: string;
}

export const createPhoto = ({
  description,
  file,
  roomPk,
}: ICreatePhotoVariables) =>
  axiosInstance
    .post(
      `rooms/${roomPk}/photos`,
      {
        file,
        description,
      },
      {
        headers: {
          "X-CSRFToken": Cookie.get("csrftoken") || "",
        },
      }
    ) // 장고 서버에 해당 이미지를 저장함.
    .then((response) => response.data);

//////////////////

export interface IProfileVariables {
  avatar: string;
  name: string;
  oldPassword: string;
  newPassword: string;
  email: string;
}

export const changeProfile = ({
  avatar,
  name,
  oldPassword,
  newPassword,
  email,
}: IProfileVariables) =>
  axiosInstance
    .put(
      `users/change-profile`,
      {
        avatar,
        name,
        oldPassword,
        newPassword,
        email,
      },
      {
        headers: {
          "X-CSRFToken": Cookie.get("csrftoken") || "",
        },
      }
    )
    .then((response) => response.data);

//////////////////

export const removeRoom = (roomPk: string) =>
  axiosInstance
    .delete(`rooms/${roomPk}`, {
      headers: {
        "X-CSRFToken": Cookie.get("csrftoken") || "",
      },
    })
    .then((response) => response.data);

////////////////

type CheckBookingQueryKey = [string, string?, Date[]?];

export const checkBooking = ({
  queryKey,
}: QueryFunctionContext<CheckBookingQueryKey>) => {
  const [_, roomPk, dates] = queryKey;
  if (dates) {
    const [firstDate, secondDate] = dates;

    const checkIn = formatDate(firstDate);

    const checkOut = formatDate(secondDate);

    return axiosInstance
      .get(
        `rooms/${roomPk}/bookings/check?check_in=${checkIn}&check_out=${checkOut}`
      )
      .then((response) => response.data);
  }
};
