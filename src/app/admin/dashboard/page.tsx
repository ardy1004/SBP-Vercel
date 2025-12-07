'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { RealTimeDashboard } from "@/components/admin/RealTimeDashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  MessageSquare
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function EnhancedAdminDashboardPage() {
  const router = useRouter();
  const { isAdmin, loading } = useAuth();

  // Redirect if not admin
  if (!loading && !isAdmin) {
    router.push('/admin/login');
    return null;
  }

  const quickActions = [
    {
      title: "Properties",
      description: "Manage property listings",
      icon: FileText,
      color: "bg-blue-500",
      action: () => router.push('/admin/properties'),
      stats: "24 active"
    },
    {
      title: "Page Builder",
      description: "Customize website pages",
      icon: Layout,
      color: "bg-purple-500",
      action: () => router.push('/admin/page-builder'),
      stats: "3 layouts"
    },
    {
      title: "Themes",
      description: "Manage design themes",
      icon: Palette,
      color: "bg-green-500",
      action: () => router.push('/admin/themes'),
      stats: "5 themes"
    },
    {
      title: "Analytics",
      description: "View detailed analytics",
      icon: BarChart3,
      color: "bg-orange-500",
      action: () => router.push('/admin/analytics'),
      stats: "Real-time"
    },
    {
      title: "Leads",
      description: "Customer inquiries",
      icon: Users,
      color: "bg-red-500",
      action: () => router.push('/admin/leads'),
      stats: "12 new"
    },
    {
      title: "Settings",
      description: "System configuration",
      icon: Settings,
      color: "bg-gray-500",
      action: () => router.push('/admin/integrations'),
      stats: "5 services"
    }
  ];

  const recentActivity = [
    { action: "Property updated", target: "Villa Modern Jakarta", time: "2 min ago", type: "update" },
    { action: "New inquiry", target: "John Doe - Apartment Search", time: "5 min ago", type: "inquiry" },
    { action: "Theme applied", target: "Luxury Gold Theme", time: "12 min ago", type: "theme" },
    { action: "Page published", target: "Homepage Layout v2", time: "1 hour ago", type: "publish" },
  ];

  return (
    <AdminLayout
      title="Dashboard"
      subtitle="Welcome back! Here's your business overview"
    >
      <div className="space-y-8">
        {/* Real-time Overview */}
        <RealTimeDashboard />

        {/* Quick Actions Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Quick Actions</h2>
            <Badge variant="outline" className="text-xs">
              Admin Tools
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Card
                  key={index}
                  className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 group"
                  onClick={action.action}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-lg ${action.color} text-white group-hover:scale-110 transition-transform`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {action.stats}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {action.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Recent Activity & System Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className={`p-2 rounded-full ${
                      activity.type === 'update' ? 'bg-blue-100 text-blue-600' :
                      activity.type === 'inquiry' ? 'bg-green-100 text-green-600' :
                      activity.type === 'theme' ? 'bg-purple-100 text-purple-600' :
                      'bg-orange-100 text-orange-600'
                    }`}>
                      {activity.type === 'update' && <FileText className="h-4 w-4" />}
                      {activity.type === 'inquiry' && <MessageSquare className="h-4 w-4" />}
                      {activity.type === 'theme' && <Palette className="h-4 w-4" />}
                      {activity.type === 'publish' && <Eye className="h-4 w-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-sm text-muted-foreground truncate">{activity.target}</p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium">Database</span>
                  </div>
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    Online
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium">API Services</span>
                  </div>
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    Healthy
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium">File Storage</span>
                  </div>
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    Active
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium">Last Backup</span>
                  </div>
                  <Badge variant="outline">
                    2 hours ago
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}