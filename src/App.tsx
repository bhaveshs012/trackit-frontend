import { ThemeProvider } from "@/context/ThemeProvider";
import { Outlet } from "react-router-dom";

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <>
        <Outlet />
      </>
    </ThemeProvider>
  );
}
