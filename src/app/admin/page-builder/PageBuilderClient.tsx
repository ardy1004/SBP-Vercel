'use client';

import { useState, useEffect } from 'react';

// Force dynamic rendering to avoid SSR issues with localStorage
export const dynamic = 'force-dynamic';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HeroSection } from '@/components/HeroSection';
import { PropertyPilihanSlider } from '@/components/PropertyPilihanSlider';
import { Footer } from '@/components/Footer';
import { Navigation } from '@/components/Navigation';
import { PropertyCard } from '@/components/PropertyCard';
import { InquiryForm } from '@/components/InquiryForm';
import { SearchBar } from '@/components/SearchBar';
import { AdvancedFilters } from '@/components/AdvancedFilters';
import { supabase } from '@/lib/supabase';

// Widget types
interface Widget {
  id: string;
  type: 'hero' | 'property-slider' | 'footer' | 'text' | 'image' | 'navigation' | 'property-card' | 'inquiry-form' | 'search-bar' | 'filters';
  props: Record<string, any>;
  size?: {
    width: number;
    height: number;
  };
  position?: {
    x: number;
    y: number;
  };
}

// Available widgets
const AVAILABLE_WIDGETS = [
  { type: 'hero', label: 'Hero Section', icon: '🏠', category: 'Layout' },
  { type: 'navigation', label: 'Navigation', icon: '🧭', category: 'Layout' },
  { type: 'property-slider', label: 'Property Slider', icon: '🏢', category: 'Content' },
  { type: 'property-card', label: 'Property Card', icon: '📄', category: 'Content' },
  { type: 'search-bar', label: 'Search Bar', icon: '🔍', category: 'Interactive' },
  { type: 'filters', label: 'Advanced Filters', icon: '⚙️', category: 'Interactive' },
  { type: 'inquiry-form', label: 'Inquiry Form', icon: '📝', category: 'Interactive' },
  { type: 'text', label: 'Text Block', icon: '📝', category: 'Content' },
  { type: 'image', label: 'Image', icon: '🖼️', category: 'Media' },
  { type: 'footer', label: 'Footer', icon: '📄', category: 'Layout' },
];

// Sortable Widget Component
function SortableWidget({ widget, onEdit }: { widget: Widget; onEdit: (widget: Widget) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: widget.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const renderWidget = () => {
    switch (widget.type) {
      case 'hero':
        return <HeroSection onSearch={() => {}} {...widget.props} />;
      case 'navigation':
        return <Navigation {...widget.props} />;
      case 'property-slider':
        return <PropertyPilihanSlider properties={[]} {...widget.props} />;
      case 'property-card':
        return (
          <div className="max-w-sm">
            <PropertyCard
              property={{
                id: 'demo',
                kodeListing: 'DEMO001',
                judulProperti: 'Demo Property',
                deskripsi: 'Demo property for preview',
                jenisProperti: 'rumah',
                hargaProperti: '500000000',
                imageUrl: 'https://via.placeholder.com/400x300',
                status: 'dijual',
                provinsi: 'demo',
                kabupaten: 'demo',
                alamatLengkap: 'Demo Address',
                luasTanah: '100',
                luasBangunan: '80',
                kamarTidur: 3,
                kamarMandi: 2,
                legalitas: 'SHM',
                isPremium: false,
                isFeatured: false,
                isHot: false,
                isSold: false,
                isPropertyPilihan: false,
                createdAt: new Date(),
                updatedAt: new Date(),
              }}
              onToggleFavorite={() => {}}
              isFavorite={false}
              {...widget.props}
            />
          </div>
        );
      case 'inquiry-form':
        return <InquiryForm propertyId="demo" {...widget.props} />;
      case 'search-bar':
        return <SearchBar onSearch={() => {}} {...widget.props} />;
      case 'filters':
        return <AdvancedFilters onApplyFilters={() => {}} currentFilters={{}} {...widget.props} />;
      case 'footer':
        return <Footer {...widget.props} />;
      case 'text':
        return (
          <div className="p-4 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-bold">{widget.props.title || 'Text Widget'}</h2>
            <p>{widget.props.content || 'Add your content here'}</p>
          </div>
        );
      case 'image':
        return (
          <div className="p-4 bg-white rounded-lg shadow">
            <img
              src={widget.props.src || 'https://via.placeholder.com/400x200'}
              alt={widget.props.alt || 'Image'}
              className="w-full h-auto rounded"
            />
          </div>
        );
      default:
        return <div>Unknown widget type</div>;
    }
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="relative group">
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <Button size="sm" variant="outline" onClick={() => onEdit(widget)}>
          Edit
        </Button>
      </div>
      {renderWidget()}
    </div>
  );
}

export default function PageBuilderClient() {
  const [widgets, setWidgets] = useState<Widget[]>([
    { id: 'hero-1', type: 'hero', props: {} },
    { id: 'slider-1', type: 'property-slider', props: {} },
    { id: 'footer-1', type: 'footer', props: {} },
  ]);

  const [selectedWidget, setSelectedWidget] = useState<Widget | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [layouts, setLayouts] = useState<any[]>([]);
  const [currentLayout, setCurrentLayout] = useState<string>('homepage');
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: any) {
    const { active, over } = event;

    if (active.id !== over.id) {
      setWidgets((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  const addWidget = (type: Widget['type']) => {
    const newWidget: Widget = {
      id: `${type}-${Date.now()}`,
      type,
      props: {},
    };
    setWidgets([...widgets, newWidget]);
  };

  const updateWidget = (updatedWidget: Widget) => {
    setWidgets(widgets.map(w => w.id === updatedWidget.id ? updatedWidget : w));
    setIsEditing(false);
    setSelectedWidget(null);
  };

  const deleteWidget = (id: string) => {
    setWidgets(widgets.filter(w => w.id !== id));
  };

  // Save layout to Supabase
  const saveLayout = async () => {
    try {
      const layoutData = {
        name: currentLayout,
        widgets: widgets,
        updatedAt: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('page_layouts')
        .upsert(layoutData, { onConflict: 'name' });

      if (error) throw error;

      alert('Layout saved successfully!');
    } catch (error) {
      console.error('Error saving layout:', error);
      alert('Failed to save layout');
    }
  };

  // Load layout from Supabase
  const loadLayout = async (layoutName: string) => {
    try {
      const { data, error } = await supabase
        .from('page_layouts')
        .select('*')
        .eq('name', layoutName)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setWidgets(data.widgets || []);
        setCurrentLayout(layoutName);
      }
    } catch (error) {
      console.error('Error loading layout:', error);
    }
  };

  // Load available layouts on mount
  useEffect(() => {
    const fetchLayouts = async () => {
      try {
        const { data, error } = await supabase
          .from('page_layouts')
          .select('name')
          .order('updatedAt', { ascending: false });

        if (error) throw error;
        setLayouts(data || []);
      } catch (error) {
        console.error('Error fetching layouts:', error);
      }
    };

    fetchLayouts();
    loadLayout(currentLayout);
  }, []);

  return (
    <div className="flex h-screen">
      {/* Canvas */}
      <div className="flex-1 p-4 overflow-auto">
        <div className="mb-4">
          <h1 className="text-2xl font-bold">Page Builder</h1>
          <p className="text-muted-foreground">Drag and drop widgets to build your page</p>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={widgets.map(w => w.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-4">
              {widgets.map((widget) => (
                <SortableWidget
                  key={widget.id}
                  widget={widget}
                  onEdit={(widget) => {
                    setSelectedWidget(widget);
                    setIsEditing(true);
                  }}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      {/* Sidebar */}
      <div className="w-80 border-l p-4 bg-muted/10 overflow-y-auto">
        <Tabs defaultValue="widgets" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="widgets">Widgets</TabsTrigger>
            <TabsTrigger value="layouts">Layouts</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="widgets" className="space-y-4">
            {['Layout', 'Content', 'Interactive', 'Media'].map(category => (
              <div key={category}>
                <h4 className="font-medium mb-2 text-sm">{category}</h4>
                <div className="grid grid-cols-2 gap-2">
                  {AVAILABLE_WIDGETS
                    .filter(widget => widget.category === category)
                    .map(widget => (
                      <Button
                        key={widget.type}
                        variant="outline"
                        size="sm"
                        onClick={() => addWidget(widget.type as Widget['type'])}
                        className="h-auto p-2 flex flex-col items-center gap-1"
                      >
                        <span className="text-lg">{widget.icon}</span>
                        <span className="text-xs">{widget.label}</span>
                      </Button>
                    ))}
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="layouts" className="space-y-4">
            <div>
              <Label htmlFor="layout-select">Current Layout</Label>
              <Select value={currentLayout} onValueChange={setCurrentLayout}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="homepage">Homepage</SelectItem>
                  <SelectItem value="about">About Page</SelectItem>
                  <SelectItem value="contact">Contact Page</SelectItem>
                  <SelectItem value="properties">Properties Page</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Button onClick={saveLayout} className="w-full">
                Save Layout
              </Button>
              <Button variant="outline" onClick={() => loadLayout(currentLayout)} className="w-full">
                Load Layout
              </Button>
            </div>

            <div>
              <h4 className="font-medium mb-2 text-sm">Saved Layouts</h4>
              <div className="space-y-1">
                {layouts.map(layout => (
                  <Button
                    key={layout.name}
                    variant="ghost"
                    size="sm"
                    onClick={() => loadLayout(layout.name)}
                    className="w-full justify-start"
                  >
                    {layout.name}
                  </Button>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <div className="space-y-2">
              <Button
                variant={isPreviewMode ? "default" : "outline"}
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                className="w-full"
              >
                {isPreviewMode ? 'Exit Preview' : 'Preview Mode'}
              </Button>
              <Button variant="outline" className="w-full">
                Export Layout
              </Button>
              <Button variant="outline" className="w-full">
                Import Layout
              </Button>
              <Button variant="destructive" className="w-full">
                Clear Canvas
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Modal */}
      {isEditing && selectedWidget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-96 max-h-96 overflow-auto">
            <CardHeader>
              <CardTitle>Edit {selectedWidget.type}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedWidget.type === 'text' && (
                <>
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={selectedWidget.props.title || ''}
                      onChange={(e) => setSelectedWidget({
                        ...selectedWidget,
                        props: { ...selectedWidget.props, title: e.target.value }
                      })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      value={selectedWidget.props.content || ''}
                      onChange={(e) => setSelectedWidget({
                        ...selectedWidget,
                        props: { ...selectedWidget.props, content: e.target.value }
                      })}
                    />
                  </div>
                </>
              )}

              {selectedWidget.type === 'image' && (
                <>
                  <div>
                    <Label htmlFor="src">Image URL</Label>
                    <Input
                      id="src"
                      value={selectedWidget.props.src || ''}
                      onChange={(e) => setSelectedWidget({
                        ...selectedWidget,
                        props: { ...selectedWidget.props, src: e.target.value }
                      })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="alt">Alt Text</Label>
                    <Input
                      id="alt"
                      value={selectedWidget.props.alt || ''}
                      onChange={(e) => setSelectedWidget({
                        ...selectedWidget,
                        props: { ...selectedWidget.props, alt: e.target.value }
                      })}
                    />
                  </div>
                </>
              )}

              <div className="flex gap-2">
                <Button onClick={() => updateWidget(selectedWidget)}>Save</Button>
                <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    deleteWidget(selectedWidget.id);
                    setIsEditing(false);
                  }}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}