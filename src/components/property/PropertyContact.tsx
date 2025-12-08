'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, MessageCircle, User } from "lucide-react";

interface PropertyContactProps {
  ownerContact?: string | null;
}

export function PropertyContact({ ownerContact }: PropertyContactProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Kontak Penjual
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {ownerContact ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-green-600" />
              <span className="font-medium">{ownerContact}</span>
            </div>
            <div className="flex gap-2">
              <Button
                className="flex-1"
                onClick={() => window.open(`https://wa.me/${ownerContact?.replace(/\D/g, '')}`, '_blank')}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                WhatsApp
              </Button>
              <Button
                variant="outline"
                onClick={() => window.open(`tel:${ownerContact}`)}
              >
                <Phone className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">
            Kontak tidak tersedia
          </p>
        )}
      </CardContent>
    </Card>
  );
}