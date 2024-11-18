import App from "@/App";
import { createBrowserRouter } from "react-router-dom";
import { Login, Signup, LandingPage, Home } from "@/pages";

const router = createBrowserRouter([
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
        element: <Login />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
      {
        path: "home",
        element: <Home />,
      },
    ],
  },
]);

export default router;
