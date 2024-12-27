import React, { useEffect } from "react";
import useUser from "../lib/useUser.ts";
import { useNavigate } from "react-router-dom";

interface IProtectedPageProps {
  children: React.ReactNode;
}

export default function HostOnlyPage({ children }: IProtectedPageProps) {
  const { user, userLoading } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userLoading) {
      if (!user?.is_host) {
        navigate("/");
      }
    }
  }, [userLoading, user, navigate]);
  return <>{children}</>;
}
