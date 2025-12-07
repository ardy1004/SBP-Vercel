import { ReactNode } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";
import { ThemeProvider } from "@/hooks/use-theme";

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  showSearch?: boolean;
  onSearch?: (query: string) => void;
  notifications?: number;
  showSidebar?: boolean; // New prop to control sidebar visibility
}

export function AdminLayout({
  children,
  title,
  subtitle,
  showSearch,
  onSearch,
  notifications,
  showSidebar = true // Default to true for backward compatibility
}: AdminLayoutProps) {
  return (
    <ThemeProvider defaultTheme="system" storageKey="salambumi-admin-theme">
      <div className="min-h-screen bg-background">
        <div className="flex">
          {/* Sidebar - Only show if showSidebar is true */}
          {showSidebar && <AdminSidebar />}

          {/* Main Content */}
          <div className={`flex-1 flex flex-col min-w-0 ${!showSidebar ? 'w-full' : ''}`}>
            {/* Header */}
            <AdminHeader
              title={title}
              subtitle={subtitle}
              showSearch={showSearch}
              onSearch={onSearch}
              notifications={notifications}
            />

            {/* Page Content */}
            <main className="flex-1 overflow-auto">
              <div className="p-6">
                {children}
              </div>
            </main>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}