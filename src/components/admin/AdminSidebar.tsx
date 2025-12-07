import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Home, FileText, BarChart3, Settings, LogOut, Upload, Search, Zap, Users, Palette, Layout } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    {
      path: "/admin/dashboard",
      label: "Dashboard",
      icon: Home,
      description: "Overview & quick actions"
    },
    {
      path: "/admin/properties",
      label: "Properties",
      icon: FileText,
      description: "Manage listings"
    },
    {
      path: "/admin/page-builder",
      label: "Page Builder",
      icon: Layout,
      description: "Design website pages"
    },
    {
      path: "/admin/themes",
      label: "Themes",
      icon: Palette,
      description: "Customize appearance"
    },
    {
      path: "/admin/analytics",
      label: "Analytics",
      icon: BarChart3,
      description: "Traffic & performance"
    },
    {
      path: "/admin/leads",
      label: "Leads",
      icon: Users,
      description: "Customer inquiries"
    },
    {
      path: "/admin/search-console",
      label: "SEO Tools",
      icon: Search,
      description: "Search optimization"
    },
    {
      path: "/admin/integrations",
      label: "Settings",
      icon: Settings,
      description: "System configuration"
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin/login');
  };

  return (
    <div className="w-64 bg-sidebar border-r h-screen flex flex-col sticky top-0">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold">Admin Panel</h2>
        <p className="text-sm text-muted-foreground">Salam Bumi Property</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;

          return (
            <Link key={item.path} href={item.path} data-testid={`link-${item.label.toLowerCase()}`}>
              <div
                className={`w-full p-3 rounded-lg transition-all duration-200 hover-elevate cursor-pointer ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                }`}
              >
                <div className="flex items-center gap-3 mb-1">
                  <Icon className={`h-5 w-5 ${isActive ? 'text-primary' : ''}`} />
                  <span className="font-medium text-sm">{item.label}</span>
                </div>
                <p className={`text-xs ml-8 ${
                  isActive
                    ? 'text-sidebar-accent-foreground/80'
                    : 'text-sidebar-foreground/60'
                }`}>
                  {item.description}
                </p>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={handleLogout}
          data-testid="button-logout"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Logout
        </Button>
      </div>
    </div>
  );
}
