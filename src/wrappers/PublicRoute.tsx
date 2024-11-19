import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = ({ redirectTo = "/home" }) => {
  const { isAuthenticated } = useSelector((state: any) => state.auth);

  return !isAuthenticated ? <Outlet /> : <Navigate to={redirectTo} />;
};

export default PublicRoute;
