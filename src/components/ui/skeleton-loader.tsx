import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface SkeletonLoaderProps {
  type?: 'card' | 'list' | 'property' | 'admin-dashboard' | 'property-detail';
  count?: number;
}

export function SkeletonLoader({ type = 'card', count = 1 }: SkeletonLoaderProps) {
  const renderSkeleton = () => {
    switch (type) {
      case 'property':
        return (
          <Card className="overflow-hidden">
            <div className="aspect-video relative">
              <Skeleton className="w-full h-full" />
            </div>
            <CardContent className="p-4 space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-14" />
              </div>
              <Skeleton className="h-8 w-24" />
            </CardContent>
          </Card>
        );

      case 'property-detail':
        return (
          <div className="space-y-6">
            {/* Image carousel skeleton */}
            <Skeleton className="aspect-video w-full rounded-lg" />

            {/* Property info skeleton */}
            <div className="space-y-4">
              <Skeleton className="h-8 w-2/3" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-10 w-1/3" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-14" />
              </div>
            </div>

            {/* Details grid skeleton */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="text-center space-y-2">
                  <Skeleton className="w-8 h-8 mx-auto rounded-full" />
                  <Skeleton className="h-4 w-16 mx-auto" />
                  <Skeleton className="h-5 w-12 mx-auto" />
                </div>
              ))}
            </div>

            {/* Description skeleton */}
            <div className="space-y-3">
              <Skeleton className="h-6 w-24" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          </div>
        );

      case 'admin-dashboard':
        return (
          <div className="space-y-6">
            {/* Stats cards skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-8 w-16" />
                      </div>
                      <Skeleton className="w-8 h-8 rounded-full" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick actions skeleton */}
            <div className="space-y-4">
              <Skeleton className="h-6 w-32" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <Skeleton className="w-12 h-12 rounded-lg" />
                        <Skeleton className="h-5 w-12" />
                      </div>
                      <Skeleton className="h-6 w-24 mb-2" />
                      <Skeleton className="h-4 w-32" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        );

      case 'list':
        return (
          <div className="space-y-4">
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-8 w-20" />
              </div>
            ))}
          </div>
        );

      default: // card
        return (
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        );
    }
  };

  if (count === 1) {
    return renderSkeleton();
  }

  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>
          {renderSkeleton()}
        </div>
      ))}
    </div>
  );
}

// Specialized loading components
export function PropertyCardSkeleton() {
  return <SkeletonLoader type="property" />;
}

export function PropertyDetailSkeleton() {
  return <SkeletonLoader type="property-detail" />;
}

export function AdminDashboardSkeleton() {
  return <SkeletonLoader type="admin-dashboard" />;
}

export function ListSkeleton({ count = 5 }: { count?: number }) {
  return <SkeletonLoader type="list" count={count} />;
}

// Page-level loading component
export function PageLoader({ message = "Memuat..." }: { message?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
}

// Inline loading spinner
export function InlineLoader({ size = "sm" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8"
  };

  return (
    <div className={`animate-spin rounded-full border-b-2 border-blue-600 ${sizeClasses[size]}`}></div>
  );
}