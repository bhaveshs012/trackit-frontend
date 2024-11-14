import { ThemeProvider } from "@/context/ThemeProvider";
// import Login from "./pages/login/Login";
// import LandingPage from "./pages/landing/LandingPage";
import Contacts from "./pages/contacts/Contacts";
// import Signup from "./pages/signup/Signup";

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Contacts />
    </ThemeProvider>
  );
}
