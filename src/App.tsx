import { ThemeProvider } from "@/context/ThemeProvider";
import Login from "./pages/login/Login";

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Login />
    </ThemeProvider>
  );
}
