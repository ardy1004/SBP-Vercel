'use client';

import { queryClient } from "@/lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import dynamic from 'next/dynamic';
import { OrganizationSchemaMarkup } from "@/components/SchemaMarkup";

// Dynamically import AuthProvider to avoid SSR issues with Supabase
const AuthProvider = dynamic(() => import('@/hooks/use-auth').then(mod => ({ default: mod.AuthProvider })), {
  ssr: false,
  loading: () => null // No loading state needed for auth
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          {/* Organization Schema Markup for all pages */}
          <OrganizationSchemaMarkup />
          {children}
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}