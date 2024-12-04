import apiClient from "@/api/apiClient";
import LoadingScreen from "@/pages/common/LoadingScreen";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = ({ redirectTo = "/home" }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    apiClient.get("/users/validate-token").then(() => {
      setIsAuthenticated(true);
    });
  }, []);

  if (!isAuthenticated) {
    return <LoadingScreen />;
  }

  return !isAuthenticated ? <Outlet /> : <Navigate to={redirectTo} />;
};

export default PublicRoute;
