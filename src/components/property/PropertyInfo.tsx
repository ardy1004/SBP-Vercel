'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PropertyInfoProps {
  kodeListing?: string;
  status: string;
  jenisProperti: string;
  createdAt?: Date;
}

export function PropertyInfo({
  kodeListing,
  status,
  jenisProperti,
  createdAt
}: PropertyInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informasi Properti</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">ID Listing:</span>
          <span className="font-medium">{kodeListing || 'N/A'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Status:</span>
          <Badge variant={status === 'dijual' ? 'default' : 'secondary'}>
            {status}
          </Badge>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Tipe:</span>
          <span className="font-medium">{jenisProperti}</span>
        </div>
        {createdAt && (
          <div className="flex justify-between">
            <span className="text-gray-600">Dibuat:</span>
            <span className="font-medium">
              {new Date(createdAt).toLocaleDateString('id-ID')}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}