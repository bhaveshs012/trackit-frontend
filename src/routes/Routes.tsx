import App from "@/App";
import { createBrowserRouter, Outlet } from "react-router-dom";
import {
  Login,
  Signup,
  LandingPage,
  Home,
  Interviews,
  Resumes,
  Contacts,
  Dashboard,
  Profile,
  ArchivedApplications,
} from "@/pages";
import ProtectedRoute from "@/wrappers/ProtectedRoute";
import PublicRoute from "@/wrappers/PublicRoute";
import ErrorScreen from "@/pages/common/ErrorScreen";
import PageNotFound from "@/pages/common/PageNotFound";

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
          element: <PublicRoute redirectTo="/dashboard" />,
          children: [
            {
              path: "",
              element: <Login />,
            },
          ],
        },
        {
          path: "signup",
          element: <PublicRoute redirectTo="/dashboard" />,
          children: [
            {
              path: "",
              element: <Signup />,
            },
          ],
        },
        {
          path: "error",
          element: (
            <ErrorScreen
              title="Some error occurred !!"
              description="Please try again later"
            />
          ),
        },
        {
          path: "dashboard",
          element: (
            <ProtectedRoute redirectTo="/login">
              <Dashboard />,
            </ProtectedRoute>
          ),
          children: [
            {
              path: "",
              element: (
                <ProtectedRoute redirectTo="/login">
                  <Home />
                </ProtectedRoute>
              ),
            },
            {
              path: "interviews",
              element: (
                <ProtectedRoute redirectTo="/login">
                  <Outlet />
                </ProtectedRoute>
              ),
              children: [
                {
                  index: true, // Default route for "/interviews"
                  element: <Interviews displayArchived={false} />,
                },
                {
                  path: "archived", // Route for "/interviews/archived"
                  element: <Interviews displayArchived={true} />,
                },
              ],
            },
            {
              path: "resumes",
              element: (
                <ProtectedRoute redirectTo="/login">
                  <Resumes />
                </ProtectedRoute>
              ),
            },
            {
              path: "contacts",
              element: (
                <ProtectedRoute redirectTo="/login">
                  <Contacts />
                </ProtectedRoute>
              ),
            },
            {
              path: "profile",
              element: (
                <ProtectedRoute redirectTo="/login">
                  <Profile />
                </ProtectedRoute>
              ),
            },
          ],
        },
        {
          path: "/applications/archived",
          element: <ArchivedApplications />,
        },
        {
          path: "*",
          element: <PageNotFound />,
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
