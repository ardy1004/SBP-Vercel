'use client';

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, Phone, Mail, Send } from "lucide-react";

interface AgentContactProps {
  agentName?: string;
  agentPhoto?: string;
  agentPhone?: string;
  agentEmail?: string;
  propertyTitle?: string;
}

export function AgentContact({
  agentName = "Monic Vera S",
  agentPhoto = "/agent-monic.jpg", // Placeholder, bisa diganti dengan foto asli
  agentPhone = "+6281234567890",
  agentEmail = "monic@salambumiproperty.com",
  propertyTitle
}: AgentContactProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Create WhatsApp message
    const whatsappMessage = `*Halo ${agentName}!*

Saya tertarik dengan properti:
*${propertyTitle || 'Properti yang Anda tawarkan'}*

Nama: ${formData.name}
Email: ${formData.email}
No. HP: ${formData.phone}

Pesan: ${formData.message}

Mohon informasi lebih lanjut.`;

    const whatsappUrl = `https://wa.me/${agentPhone.replace(/\D/g, '')}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappUrl, '_blank');

    setIsSubmitting(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Avatar className="w-12 h-12">
            <AvatarImage src={agentPhoto} alt={agentName} />
            <AvatarFallback>{agentName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold">{agentName}</div>
            <div className="text-sm text-muted-foreground">Marketing Property</div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Contact Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => window.open(`https://wa.me/${agentPhone.replace(/\D/g, '')}`, '_blank')}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            WhatsApp
          </Button>
          <Button
            variant="outline"
            onClick={() => window.open(`tel:${agentPhone}`)}
          >
            <Phone className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            onClick={() => window.open(`mailto:${agentEmail}`)}
          >
            <Mail className="w-4 h-4" />
          </Button>
        </div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nama Lengkap</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Masukkan nama Anda"
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">No. Telepon</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="081234567890"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="email@contoh.com"
              required
            />
          </div>

          <div>
            <Label htmlFor="message">Pesan</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              placeholder={`Halo ${agentName}, saya tertarik dengan properti ini. Bisa minta informasi lebih detail?`}
              rows={3}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Mengirim...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Kirim Pesan via WhatsApp
              </>
            )}
          </Button>
        </form>

        {/* Agent Info */}
        <div className="pt-4 border-t">
          <div className="text-sm text-muted-foreground space-y-1">
            <div>📱 {agentPhone}</div>
            <div>✉️ {agentEmail}</div>
            <div className="text-xs mt-2">
              Kami akan merespons dalam 1-2 jam kerja
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}