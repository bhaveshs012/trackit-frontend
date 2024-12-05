import apiClient from "@/api/apiClient";
import LoadingScreen from "@/pages/common/LoadingScreen";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = ({ redirectTo = "/dashboard" }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const validateToken = async () => {
      try {
        await apiClient.get("/users/validate-token");
        setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
      }
    };

    validateToken();
  }, []);

  if (isAuthenticated === null) {
    return <LoadingScreen />;
  }

  return !isAuthenticated ? <Outlet /> : <Navigate to={redirectTo} />;
};

export default PublicRoute;
