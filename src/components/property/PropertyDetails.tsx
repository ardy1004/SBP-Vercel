'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Maximize, Bed, Bath } from "lucide-react";

interface PropertyDetailsProps {
  luasTanah?: string | null;
  luasBangunan?: string | null;
  kamarTidur?: number | null;
  kamarMandi?: number | null;
  deskripsi?: string | null;
  shgb?: string | null; // SHGB (Sertifikat Hak Guna Bangunan)
  pbg?: string | null;  // PBG (Persetujuan Bangunan Gedung)
}

export function PropertyDetails({
  luasTanah,
  luasBangunan,
  kamarTidur,
  kamarMandi,
  deskripsi,
  shgb,
  pbg,
}: PropertyDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Detail Properti</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {luasTanah && (
            <div className="text-center">
              <Maximize className="w-6 h-6 mx-auto text-blue-600 mb-2" />
              <p className="text-sm text-gray-600">Luas Tanah</p>
              <p className="font-semibold">{luasTanah} m²</p>
            </div>
          )}
          {luasBangunan && (
            <div className="text-center">
              <Maximize className="w-6 h-6 mx-auto text-blue-600 mb-2" />
              <p className="text-sm text-gray-600">Luas Bangunan</p>
              <p className="font-semibold">{luasBangunan} m²</p>
            </div>
          )}
          {kamarTidur && (
            <div className="text-center">
              <Bed className="w-6 h-6 mx-auto text-blue-600 mb-2" />
              <p className="text-sm text-gray-600">Kamar Tidur</p>
              <p className="font-semibold">{kamarTidur}</p>
            </div>
          )}
          {kamarMandi && (
            <div className="text-center">
              <Bath className="w-6 h-6 mx-auto text-blue-600 mb-2" />
              <p className="text-sm text-gray-600">Kamar Mandi</p>
              <p className="font-semibold">{kamarMandi}</p>
            </div>
          )}
        </div>

        {/* SHGB & PBG Information - Moved to detail section */}
        {(shgb || pbg) && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3 text-blue-900">Informasi Legal & Perizinan</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {shgb && (
                <div className="bg-white p-3 rounded border">
                  <div className="text-sm text-gray-600">SHGB</div>
                  <div className="font-semibold text-blue-900">{shgb}</div>
                  <div className="text-xs text-gray-500 mt-1">Sertifikat Hak Guna Bangunan</div>
                </div>
              )}
              {pbg && (
                <div className="bg-white p-3 rounded border">
                  <div className="text-sm text-gray-600">PBG</div>
                  <div className="font-semibold text-blue-900">{pbg}</div>
                  <div className="text-xs text-gray-500 mt-1">Persetujuan Bangunan Gedung</div>
                </div>
              )}
            </div>
          </div>
        )}

        {deskripsi && (
          <div>
            <h3 className="font-semibold mb-2">Deskripsi</h3>
            <div
              className="text-gray-700 whitespace-pre-line"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(deskripsi) }}
            />
          </div>
        )}

      </CardContent>
    </Card>
  );
}

// Simple HTML sanitization function
function sanitizeHtml(html: string): string {
  // Remove potentially dangerous tags and attributes
  const allowedTags = ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li'];
  const allowedAttributes = ['class'];

  // Basic sanitization - remove script tags and dangerous attributes
  let sanitized = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/javascript:/gi, '');

  // Only allow specific tags
  sanitized = sanitized.replace(/<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/g, (match, tagName) => {
    if (allowedTags.includes(tagName.toLowerCase())) {
      return match;
    }
    return '';
  });

  return sanitized;
}