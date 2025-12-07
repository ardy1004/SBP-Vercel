'use client';

import { AdminLayout } from "@/components/admin/AdminLayout";
import { LeadManagement } from "@/components/admin/LeadManagement";

export default function AdminLeadsPage() {
  return (
    <AdminLayout
      title="Lead Management"
      subtitle="Manage customer inquiries and leads"
    >
      <LeadManagement />
    </AdminLayout>
  );
}