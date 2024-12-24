import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Root from "./component/Root.tsx";
import Home from "./routes/Home.tsx";
import NotFound from "./routes/NotFound.tsx";
import RoomDetail from "./routes/RoomDetail.tsx";

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
        path: "rooms/:roomPk",
        element: <RoomDetail />,
      },
    ],
  },
]);

export default router;
