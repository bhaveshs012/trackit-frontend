import { ThemeProvider } from "@/context/ThemeProvider";
// import Login from "./pages/login/Login";
import LandingPage from "./pages/landing/LandingPage";

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <LandingPage />
    </ThemeProvider>
  );
}
