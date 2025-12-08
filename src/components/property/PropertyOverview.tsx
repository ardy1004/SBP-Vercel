'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Suspense, lazy } from "react";
import { MapPin, Share2 } from "lucide-react";

// Lazy load ShareButtons to avoid SSR issues
const ShareButtons = lazy(() => import("@/components/ShareButtons").then(module => ({ default: module.ShareButtons })));

interface PropertyOverviewProps {
  kodeListing?: string;
  judulProperti?: string;
  lokasi?: string;
  harga?: string;
  property: any; // Full property object for ShareButtons
}

export function PropertyOverview({
  kodeListing,
  judulProperti,
  lokasi,
  harga,
  property
}: PropertyOverviewProps) {
  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        {/* Kode Listing */}
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-sm">
            Kode: {kodeListing || 'N/A'}
          </Badge>
        </div>

        {/* Judul Properti */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
            {judulProperti || 'Judul Properti'}
          </h1>
        </div>

        {/* Lokasi */}
        <div className="flex items-center text-gray-600">
          <MapPin className="w-5 h-5 mr-2 text-blue-600" />
          <span className="text-lg">{lokasi || 'Lokasi tidak tersedia'}</span>
        </div>

        {/* Harga */}
        <div>
          <p className="text-3xl md:text-4xl font-bold text-blue-600">
            {harga || 'Harga tidak tersedia'}
          </p>
        </div>

        {/* Share Links All Medsos */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Bagikan:</span>
          </div>
          <Suspense fallback={<div className="w-32 h-8 bg-gray-200 animate-pulse rounded" />}>
            <ShareButtons
              property={property}
              variant="compact"
            />
          </Suspense>
        </div>
      </CardContent>
    </Card>
  );
}