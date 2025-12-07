'use client';

import { useState } from 'react';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { HeroSection } from '@/components/HeroSection';
import { PropertyPilihanSlider } from '@/components/PropertyPilihanSlider';
import { Footer } from '@/components/Footer';

// Widget types
interface Widget {
  id: string;
  type: 'hero' | 'property-slider' | 'footer' | 'text' | 'image';
  props: Record<string, any>;
}

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
      case 'property-slider':
        return <PropertyPilihanSlider properties={[]} {...widget.props} />;
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

export default function PageBuilderPage() {
  const [widgets, setWidgets] = useState<Widget[]>([
    { id: 'hero-1', type: 'hero', props: {} },
    { id: 'slider-1', type: 'property-slider', props: {} },
    { id: 'footer-1', type: 'footer', props: {} },
  ]);

  const [selectedWidget, setSelectedWidget] = useState<Widget | null>(null);
  const [isEditing, setIsEditing] = useState(false);

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
      <div className="w-80 border-l p-4 bg-muted/10">
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Add Widgets</h3>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" onClick={() => addWidget('hero')}>
                Hero
              </Button>
              <Button variant="outline" size="sm" onClick={() => addWidget('property-slider')}>
                Property Slider
              </Button>
              <Button variant="outline" size="sm" onClick={() => addWidget('text')}>
                Text
              </Button>
              <Button variant="outline" size="sm" onClick={() => addWidget('image')}>
                Image
              </Button>
              <Button variant="outline" size="sm" onClick={() => addWidget('footer')}>
                Footer
              </Button>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Actions</h3>
            <div className="space-y-2">
              <Button className="w-full">Save Layout</Button>
              <Button variant="outline" className="w-full">Preview</Button>
              <Button variant="outline" className="w-full">Publish</Button>
            </div>
          </div>
        </div>
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