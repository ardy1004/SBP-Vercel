'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Settings, CheckCircle, AlertCircle, ExternalLink } from "lucide-react";

export default function AdminIntegrationsPage() {
  const integrations = [
    {
      name: "Supabase",
      description: "Database and authentication",
      status: "connected",
      icon: "🗄️"
    },
    {
      name: "Google Analytics",
      description: "Website analytics and tracking",
      status: "connected",
      icon: "📊"
    },
    {
      name: "Google Search Console",
      description: "SEO insights and search performance",
      status: "pending",
      icon: "🔍"
    },
    {
      name: "Gemini AI",
      description: "AI-powered content generation",
      status: "connected",
      icon: "🤖"
    },
    {
      name: "Email Service",
      description: "Transactional emails and notifications",
      status: "pending",
      icon: "📧"
    },
    {
      name: "Cloud Storage",
      description: "File uploads and media storage",
      status: "connected",
      icon: "☁️"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((integration) => (
          <Card key={integration.name} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{integration.icon}</span>
                  <CardTitle className="text-lg">{integration.name}</CardTitle>
                </div>
                <Badge
                  variant={integration.status === 'connected' ? 'default' : 'secondary'}
                  className={integration.status === 'connected' ? 'bg-green-100 text-green-800' : ''}
                >
                  {integration.status === 'connected' ? (
                    <CheckCircle className="h-3 w-3 mr-1" />
                  ) : (
                    <AlertCircle className="h-3 w-3 mr-1" />
                  )}
                  {integration.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {integration.description}
              </p>
              <Button
                variant={integration.status === 'connected' ? 'outline' : 'default'}
                size="sm"
                className="w-full"
              >
                <Settings className="h-4 w-4 mr-2" />
                {integration.status === 'connected' ? 'Configure' : 'Connect'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="h-5 w-5" />
            API Documentation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Access API documentation and integration guides for all connected services.
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                View Supabase Docs
              </Button>
              <Button variant="outline" size="sm">
                Google Analytics API
              </Button>
              <Button variant="outline" size="sm">
                Gemini AI Docs
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}