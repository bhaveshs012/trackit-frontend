import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Briefcase, StickyNote, Target, User, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const items = [
  {
    title: "Applications",
    url: "",
    icon: Briefcase,
  },
  {
    title: "Interviews",
    url: "interviews",
    icon: Target,
  },
  {
    title: "Resumes",
    url: "resumes",
    icon: StickyNote,
  },
  {
    title: "Contacts",
    url: "contacts",
    icon: Users,
  },
  {
    title: "Profile",
    url: "profile",
    icon: User,
  },
];

export function AppSidebar() {
  const navigate = useNavigate();
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Track IT</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a onClick={() => navigate(item.url)}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
