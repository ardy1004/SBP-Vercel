import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { queryClient } from "@/lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { AuthProvider } from "@/hooks/use-auth";
import { OrganizationSchemaMarkup } from "@/components/SchemaMarkup";
import { useCoreWebVitals } from "@/hooks/use-core-web-vitals";
import "./globals.css"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Salam Bumi Property',
  description: 'Platform properti terpercaya untuk jual beli dan sewa properti',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <ErrorBoundary
          onError={(error, errorInfo) => {
            // Log to console in development
            console.error('App Error:', error, errorInfo);

            // In production, you could send to error reporting service
            // Example: Sentry.captureException(error, { contexts: { react: errorInfo } });
          }}
        >
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
        </ErrorBoundary>
      </body>
    </html>
  )
}
