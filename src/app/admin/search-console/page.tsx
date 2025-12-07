'use client';

import { AdminLayout } from "@/components/admin/AdminLayout";
import { SearchConsoleDashboard } from "@/components/admin/SearchConsoleDashboard";

export default function AdminSearchConsolePage() {
  return (
    <AdminLayout
      title="Search Console"
      subtitle="Google Search Console integration and SEO insights"
    >
      <SearchConsoleDashboard />
    </AdminLayout>
  );
}