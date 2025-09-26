"use client"

import { LogOut, Home, Plus, BarChart3 } from "lucide-react"
import { signOut } from "next-auth/react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// Logout function
const handleLogout = async () => {
  try {
    await signOut({
      callbackUrl: '/',
      redirect: true
    });
  } catch (error) {
    console.error('Logout error:', error);
  }
};

// Menu item type
type MenuItem = {
  title: string;
  url: string | (() => void);
  icon: React.ComponentType;
};

// Menu items.
const items: MenuItem[] = [
  {
    title: "All Posts",
    url: "/dashboard/allposts",
    icon: Home,
  },
  {
    title: "Add Post",
    url: "/dashboard/addpost",
    icon: Plus,
  },
  {
    title: "Reviews Generator",
    url: '/dashboard/reddit-reviews-generator',
    icon: BarChart3,
  },
  {
    title: "LogOut",
    url: handleLogout,
    icon: LogOut,
  }
  // ,
  // {
  //   title: "Search",
  //   url: "#",
  //   icon: Search,
  // },
  // {
  //   title: "Settings",
  //   url: "#",
  //   icon: Settings,
  // },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[18px]">Admin Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="text-1.5xl">
                    {typeof item.url === 'function' ? (
                      <button onClick={item.url} className="flex items-center gap-2 w-full">
                        <item.icon />
                        <span>{item.title}</span>
                      </button>
                    ) : item.title === "Reviews Generator" ? (
                      <a href={item.url} target="_blank" rel="noopener noreferrer">
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    ) : (
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}