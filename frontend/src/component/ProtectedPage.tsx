import React, { useEffect } from "react";
import useUser from "../lib/useUser.ts";
import { useNavigate } from "react-router-dom";

interface IProtectedPageProps {
  children: React.ReactNode;
}

export default function ProtectedPage({ children }: IProtectedPageProps) {
  const { user, isLoggedIn, userLoading } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userLoading) {
      if (!isLoggedIn) {
        navigate("/");
      }
    }
  }, [userLoading, isLoggedIn, navigate]);
  return <>{children}</>;
}
