'use client';

import { ArrowLeft, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface PropertyHeaderProps {
  title?: string;
  location?: string;
  price?: string;
}

export function PropertyHeader({ title, location, price }: PropertyHeaderProps) {
  const router = useRouter();

  return (
    <div className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali
        </Button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title || 'Judul Properti'}</h1>
            <p className="text-gray-600 flex items-center mt-1">
              <MapPin className="w-4 h-4 mr-1" />
              {location || 'Lokasi tidak tersedia'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-blue-600">
              {price || 'Harga tidak tersedia'}
            </p>
            <p className="text-sm text-gray-500">Kode: -</p>
          </div>
        </div>
      </div>
    </div>
  );
}