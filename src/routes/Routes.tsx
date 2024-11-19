import App from "@/App";
import { createBrowserRouter } from "react-router-dom";
import { Login, Signup, LandingPage, Home } from "@/pages";
import ProtectedRoute from "@/wrappers/ProtectedRoute";
import PublicRoute from "@/wrappers/PublicRoute";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <App />,
      children: [
        {
          path: "",
          element: <LandingPage />,
        },
        {
          path: "login",
          element: <PublicRoute redirectTo="/home" />,
          children: [
            {
              path: "",
              element: <Login />,
            },
          ],
        },
        {
          path: "signup",
          element: <PublicRoute redirectTo="/home" />,
          children: [
            {
              path: "",
              element: <Signup />,
            },
          ],
        },
        {
          path: "home",
          element: <ProtectedRoute redirectTo="/login" />,
          children: [
            {
              path: "",
              element: <Home />,
            },
          ],
        },
      ],
    },
  ],
  {
    future: {
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_relativeSplatPath: true,
      v7_skipActionErrorRevalidation: true,
    },
  }
);

export default router;
