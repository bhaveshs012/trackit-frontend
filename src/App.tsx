import { useEffect } from "react";
import { loginSuccess, setLoading, logout } from "./features/authSlice";
import { ThemeProvider } from "@/context/ThemeProvider";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import apiClient from "./api/apiClient";
import Cookies from "js-cookie";

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkLogin = async () => {
      dispatch(setLoading(true));
      try {
        const refreshToken = Cookies.get("refreshToken"); // You could also use Cookies
        if (refreshToken) {
          const response = await apiClient.post("/users/refresh-token", {
            refreshToken,
          });

          const {
            accessToken,
            refreshToken: newRefreshToken,
            user,
          } = response.data.data;
          dispatch(
            loginSuccess({ user, accessToken, refreshToken: newRefreshToken })
          );
        } else {
          dispatch(logout());
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
