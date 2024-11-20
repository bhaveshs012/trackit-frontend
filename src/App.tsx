import { useEffect } from "react";
import { loginSuccess, setLoading, logout } from "./features/authSlice";
import { ThemeProvider } from "@/context/ThemeProvider";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import apiClient from "./api/apiClient";
import { useNavigate } from "react-router-dom";

export default function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const checkLogin = async () => {
      dispatch(setLoading(true));
      try {
        const response = await apiClient.get("/users/autoLogin");
        if (response.status === 200) {
          navigate("/home");
        }
      } catch (error) {
        dispatch(logout());
      } finally {
        dispatch(setLoading(false));
      }
    };
    checkLogin();
  }, [dispatch]);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <>
        <Outlet />
      </>
    </ThemeProvider>
  );
}
