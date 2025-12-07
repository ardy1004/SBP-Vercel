'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

// Theme interface
interface Theme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    foreground: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  spacing: {
    borderRadius: string;
  };
  isActive: boolean;
}

// Pre-built themes
const defaultThemes: Theme[] = [
  {
    id: 'light',
    name: 'Light Modern',
    colors: {
      primary: '#3b82f6',
      secondary: '#f1f5f9',
      background: '#ffffff',
      foreground: '#0f172a',
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter',
    },
    spacing: {
      borderRadius: '8px',
    },
    isActive: true,
  },
  {
    id: 'dark',
    name: 'Dark Professional',
    colors: {
      primary: '#60a5fa',
      secondary: '#1e293b',
      background: '#0f172a',
      foreground: '#f8fafc',
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter',
    },
    spacing: {
      borderRadius: '8px',
    },
    isActive: false,
  },
  {
    id: 'luxury',
    name: 'Luxury Gold',
    colors: {
      primary: '#d4af37',
      secondary: '#2d1810',
      background: '#1a1a1a',
      foreground: '#f5f5f0',
    },
    fonts: {
      heading: 'Playfair Display',
      body: 'Inter',
    },
    spacing: {
      borderRadius: '12px',
    },
    isActive: false,
  },
];

export default function ThemeManagerPage() {
  const [themes, setThemes] = useState<Theme[]>(defaultThemes);
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const setActiveTheme = (themeId: string) => {
    setThemes(themes.map(theme => ({
      ...theme,
      isActive: theme.id === themeId,
    })));
  };

  const updateTheme = (updatedTheme: Theme) => {
    setThemes(themes.map(theme =>
      theme.id === updatedTheme.id ? updatedTheme : theme
    ));
    setIsEditing(false);
    setSelectedTheme(null);
  };

  const createNewTheme = () => {
    const newTheme: Theme = {
      id: `custom-${Date.now()}`,
      name: 'New Theme',
      colors: {
        primary: '#3b82f6',
        secondary: '#f1f5f9',
        background: '#ffffff',
        foreground: '#0f172a',
      },
      fonts: {
        heading: 'Inter',
        body: 'Inter',
      },
      spacing: {
        borderRadius: '8px',
      },
      isActive: false,
    };
    setThemes([...themes, newTheme]);
    setSelectedTheme(newTheme);
    setIsEditing(true);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Theme Manager</h1>
        <p className="text-muted-foreground">Create and manage themes for your website</p>
      </div>

      <div className="mb-4">
        <Button onClick={createNewTheme}>Create New Theme</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {themes.map((theme) => (
          <Card key={theme.id} className={`relative ${theme.isActive ? 'ring-2 ring-primary' : ''}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{theme.name}</CardTitle>
                {theme.isActive && <Badge>Active</Badge>}
              </div>
            </CardHeader>
            <CardContent>
              {/* Theme Preview */}
              <div
                className="p-4 rounded-lg mb-4"
                style={{
                  backgroundColor: theme.colors.background,
                  color: theme.colors.foreground,
                  borderRadius: theme.spacing.borderRadius,
                }}
              >
                <div
                  className="w-full h-2 rounded mb-2"
                  style={{ backgroundColor: theme.colors.primary }}
                />
                <div
                  className="w-3/4 h-2 rounded mb-2"
                  style={{ backgroundColor: theme.colors.secondary }}
                />
                <div className="text-sm" style={{ fontFamily: theme.fonts.body }}>
                  Sample text
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedTheme(theme);
                    setIsEditing(true);
                  }}
                >
                  Edit
                </Button>
                {!theme.isActive && (
                  <Button
                    size="sm"
                    onClick={() => setActiveTheme(theme.id)}
                  >
                    Activate
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Theme Modal */}
      {isEditing && selectedTheme && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto">
            <CardHeader>
              <CardTitle>Edit Theme: {selectedTheme.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="theme-name">Theme Name</Label>
                <Input
                  id="theme-name"
                  value={selectedTheme.name}
                  onChange={(e) => setSelectedTheme({
                    ...selectedTheme,
                    name: e.target.value
                  })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Primary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={selectedTheme.colors.primary}
                      onChange={(e) => setSelectedTheme({
                        ...selectedTheme,
                        colors: { ...selectedTheme.colors, primary: e.target.value }
                      })}
                      className="w-16 h-10"
                    />
                    <Input
                      value={selectedTheme.colors.primary}
                      onChange={(e) => setSelectedTheme({
                        ...selectedTheme,
                        colors: { ...selectedTheme.colors, primary: e.target.value }
                      })}
                    />
                  </div>
                </div>

                <div>
                  <Label>Secondary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={selectedTheme.colors.secondary}
                      onChange={(e) => setSelectedTheme({
                        ...selectedTheme,
                        colors: { ...selectedTheme.colors, secondary: e.target.value }
                      })}
                      className="w-16 h-10"
                    />
                    <Input
                      value={selectedTheme.colors.secondary}
                      onChange={(e) => setSelectedTheme({
                        ...selectedTheme,
                        colors: { ...selectedTheme.colors, secondary: e.target.value }
                      })}
                    />
                  </div>
                </div>

                <div>
                  <Label>Background Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={selectedTheme.colors.background}
                      onChange={(e) => setSelectedTheme({
                        ...selectedTheme,
                        colors: { ...selectedTheme.colors, background: e.target.value }
                      })}
                      className="w-16 h-10"
                    />
                    <Input
                      value={selectedTheme.colors.background}
                      onChange={(e) => setSelectedTheme({
                        ...selectedTheme,
                        colors: { ...selectedTheme.colors, background: e.target.value }
                      })}
                    />
                  </div>
                </div>

                <div>
                  <Label>Foreground Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={selectedTheme.colors.foreground}
                      onChange={(e) => setSelectedTheme({
                        ...selectedTheme,
                        colors: { ...selectedTheme.colors, foreground: e.target.value }
                      })}
                      className="w-16 h-10"
                    />
                    <Input
                      value={selectedTheme.colors.foreground}
                      onChange={(e) => setSelectedTheme({
                        ...selectedTheme,
                        colors: { ...selectedTheme.colors, foreground: e.target.value }
                      })}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="heading-font">Heading Font</Label>
                  <Select
                    value={selectedTheme.fonts.heading}
                    onValueChange={(value) => setSelectedTheme({
                      ...selectedTheme,
                      fonts: { ...selectedTheme.fonts, heading: value }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inter">Inter</SelectItem>
                      <SelectItem value="Playfair Display">Playfair Display</SelectItem>
                      <SelectItem value="Roboto">Roboto</SelectItem>
                      <SelectItem value="Open Sans">Open Sans</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="body-font">Body Font</Label>
                  <Select
                    value={selectedTheme.fonts.body}
                    onValueChange={(value) => setSelectedTheme({
                      ...selectedTheme,
                      fonts: { ...selectedTheme.fonts, body: value }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inter">Inter</SelectItem>
                      <SelectItem value="Roboto">Roboto</SelectItem>
                      <SelectItem value="Open Sans">Open Sans</SelectItem>
                      <SelectItem value="Lato">Lato</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="border-radius">Border Radius</Label>
                <Select
                  value={selectedTheme.spacing.borderRadius}
                  onValueChange={(value) => setSelectedTheme({
                    ...selectedTheme,
                    spacing: { ...selectedTheme.spacing, borderRadius: value }
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="4px">Small (4px)</SelectItem>
                    <SelectItem value="8px">Medium (8px)</SelectItem>
                    <SelectItem value="12px">Large (12px)</SelectItem>
                    <SelectItem value="16px">Extra Large (16px)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button onClick={() => updateTheme(selectedTheme)}>Save Changes</Button>
                <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}