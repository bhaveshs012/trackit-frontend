import { ThemeProvider } from "@/context/ThemeProvider";
// import Login from "./pages/login/Login";
// import LandingPage from "./pages/landing/LandingPage";
// import Contacts from "./pages/contacts/Contacts";
// import Interviews from "./pages/interviews/Interviews";
import Home from "./pages/home/Home";
// import Signup from "./pages/signup/Signup";

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Home />
    </ThemeProvider>
  );
}
