import apiClient from "@/api/apiClient";
import LoadingScreen from "@/pages/common/LoadingScreen";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectTo = "/login",
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const validateToken = async () => {
      try {
        await apiClient.get("/users/validate-token");
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    validateToken();
  }, []);

  // Show a loading screen while the authentication status is being determined.
  if (isAuthenticated === null) {
    return <LoadingScreen />;
  }

  // Redirect to the login page if not authenticated.
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // Render the children if authenticated.
  return <>{children}</>;
};

export default ProtectedRoute;
