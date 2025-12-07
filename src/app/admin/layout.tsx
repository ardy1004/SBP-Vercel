'use client';

import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  FileText,
  Palette,
  Layout,
  Users,
  Settings,
  TrendingUp,
  Activity,
  Eye,
  MessageSquare,
  ArrowRight
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

export default function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  // Show welcome screen only on /admin root
  if (pathname === '/admin') {
    const adminSections = [
      {
        title: "Dashboard",
        description: "Real-time business overview, live metrics, and quick actions",
        icon: Activity,
        color: "bg-blue-500",
        path: "/admin/dashboard",
        features: ["Live visitor count", "Recent activity", "Quick actions"]
      },
      {
        title: "Properties",
        description: "Complete property management system with advanced CRUD operations",
        icon: FileText,
        color: "bg-green-500",
        path: "/admin/properties",
        features: ["Add/edit/delete", "Bulk operations", "Advanced filters"]
      },
      {
        title: "Page Builder",
        description: "Visual drag-and-drop page designer with 10+ customizable widgets",
        icon: Layout,
        color: "bg-purple-500",
        path: "/admin/page-builder",
        features: ["Drag & drop", "Auto-save", "Live preview"]
      },
      {
        title: "Themes",
        description: "AI-powered theme management with custom color schemes",
        icon: Palette,
        color: "bg-pink-500",
        path: "/admin/themes",
        features: ["AI suggestions", "Custom themes", "Live switching"]
      },
      {
        title: "Analytics",
        description: "Comprehensive analytics dashboard with charts and insights",
        icon: BarChart3,
        color: "bg-orange-500",
        path: "/admin/analytics",
        features: ["Traffic analysis", "Conversion tracking", "SEO insights"]
      },
      {
        title: "Leads",
        description: "Customer inquiry management and lead scoring system",
        icon: Users,
        color: "bg-red-500",
        path: "/admin/leads",
        features: ["Lead tracking", "Scoring system", "Follow-up automation"]
      },
      {
        title: "SEO Tools",
        description: "Search optimization tools and performance monitoring",
        icon: TrendingUp,
        color: "bg-indigo-500",
        path: "/admin/search-console",
        features: ["Search console", "Page insights", "SEO optimizer"]
      },
      {
        title: "Settings",
        description: "System configuration and third-party service integrations",
        icon: Settings,
        color: "bg-gray-500",
        path: "/admin/integrations",
        features: ["API connections", "System config", "Backup settings"]
      }
    ];

    return (
      <AdminLayout title="Admin Panel" subtitle="Manage your property business">
        <div className="space-y-8">
          {/* Welcome Header */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold">Welcome to Admin Panel</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your comprehensive business management dashboard. Each section is designed for specific tasks
              to help you efficiently manage your property business.
            </p>
            <div className="flex justify-center gap-4">
              <Badge variant="outline" className="text-sm">
                8 Specialized Sections
              </Badge>
              <Badge variant="outline" className="text-sm">
                Enterprise Features
              </Badge>
              <Badge variant="outline" className="text-sm">
                Real-time Updates
              </Badge>
            </div>
          </div>

          {/* Admin Sections Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {adminSections.map((section, index) => {
              const Icon = section.icon;
              return (
                <Card
                  key={index}
                  className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 group border-2 hover:border-primary/20"
                  onClick={() => router.push(section.path)}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`p-3 rounded-xl ${section.color} text-white group-hover:scale-110 transition-transform shadow-lg`}>
                        <Icon className="h-7 w-7" />
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {section.description}
                    </p>
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Key Features:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {section.features.map((feature, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Quick Stats */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <h3 className="text-lg font-semibold">System Status</h3>
                <div className="flex justify-center gap-8">
                  <div className="text-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
                    <p className="text-sm font-medium">Database</p>
                    <p className="text-xs text-muted-foreground">Connected</p>
                  </div>
                  <div className="text-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
                    <p className="text-sm font-medium">API</p>
                    <p className="text-xs text-muted-foreground">Healthy</p>
                  </div>
                  <div className="text-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
                    <p className="text-sm font-medium">Storage</p>
                    <p className="text-xs text-muted-foreground">Active</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    );
  }

  return <AdminLayout>{children}</AdminLayout>;
}