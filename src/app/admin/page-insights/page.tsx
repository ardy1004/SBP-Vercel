'use client';

import { AdminLayout } from "@/components/admin/AdminLayout";
import { PageInsightsDashboard } from "@/components/admin/PageInsightsDashboard";

export default function AdminPageInsightsPage() {
  return (
    <AdminLayout
      title="Page Insights"
      subtitle="SEO optimization and page performance analysis"
    >
      <PageInsightsDashboard />
    </AdminLayout>
  );
}