'use client';

import { AdminLayout } from "@/components/admin/AdminLayout";
import { AnalyticsDashboard } from "@/components/admin/AnalyticsDashboard";

export default function AdminAnalyticsPage() {
  return (
    <AdminLayout
      title="Analytics"
      subtitle="Website performance and user analytics"
    >
      <AnalyticsDashboard />
    </AdminLayout>
  );
}