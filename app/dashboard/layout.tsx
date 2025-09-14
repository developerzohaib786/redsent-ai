import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 flex flex-col items-center w-full">
        <div className="w-full max-w-none flex flex-col">
          <SidebarTrigger />
          <div className="flex-1 flex justify-center">
            {children}
          </div>
        </div>
      </main>
    </SidebarProvider>
  )
}