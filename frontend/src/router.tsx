import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Root from "./component/Root.tsx";
import Home from "./routes/Home.tsx";
import NotFound from "./routes/NotFound.tsx";
import RoomDetail from "./routes/RoomDetail.tsx";
import GithubConfirm from "./routes/GithubConfirm.tsx";
import KakaoConfirm from "./routes/KakaoConfirm.tsx";
import UploadRoom from "./routes/UploadRoom.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <NotFound />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "rooms/upload",
        element: <UploadRoom />
      },
      {
        path: "rooms/:roomPk",
        element: <RoomDetail />,
      },
      {
        path: "social",
        children: [
          {
            path: "github",
            element: <GithubConfirm />,
          },
          {
            path: "kakao",
            element: <KakaoConfirm />,
          },
        ],
      },
    ],
  },
]);

export default router;
