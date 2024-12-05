import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/AppSidebar";
import { Outlet } from "react-router-dom";

function Dashboard() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
      </main>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <Outlet />
      </div>
    </SidebarProvider>
  );
}

export default Dashboard;
