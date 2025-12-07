'use client';

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Edit, Trash2, CheckSquare, Square, Search, Filter, X, Save, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { queryClient } from "@/lib/queryClient";
import type { Property } from "@shared/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { PropertyForm } from "@/components/admin/PropertyForm";

export default function AdminPropertiesPage() {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [bulkStatusValue, setBulkStatusValue] = useState<string>("");
  const { toast } = useToast();

  const { data: rawProperties = [], isLoading } = useQuery<any[]>({
    queryKey: ['admin-properties'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching properties:', error);
        throw error;
      }

      console.log('Raw properties from Supabase:', data?.slice(0, 3));
      return data || [];
    },
  });

  // Transform Supabase snake_case to camelCase for admin panel
  const properties = rawProperties.map((property: any) => ({
    id: property.id,
    kodeListing: property.kode_listing,
    judulProperti: property.judul_properti,
    deskripsi: property.deskripsi,
    jenisProperti: property.jenis_properti,
    luasTanah: property.luas_tanah,
    luasBangunan: property.luas_bangunan,
    kamarTidur: property.kamar_tidur,
    kamarMandi: property.kamar_mandi,
    legalitas: property.legalitas,
    hargaProperti: property.harga_properti,
    provinsi: property.provinsi,
    kabupaten: property.kabupaten,
    alamatLengkap: property.alamat_lengkap,
    imageUrl: property.image_url,
    imageUrl1: property.image_url1,
    imageUrl2: property.image_url2,
    imageUrl3: property.image_url3,
    imageUrl4: property.image_url4,
    imageUrl5: property.image_url5,
    imageUrl6: property.image_url6,
    imageUrl7: property.image_url7,
    imageUrl8: property.image_url8,
    imageUrl9: property.image_url9,
    isPremium: property.is_premium,
    isFeatured: property.is_featured,
    isHot: property.is_hot,
    isSold: property.is_sold,
    priceOld: property.price_old,
    isPropertyPilihan: property.is_property_pilihan,
    hargaPerMeter: Boolean((property as any).harga_per_meter || false),
    ownerContact: property.owner_contact,
    status: property.status,
    metaTitle: property.meta_title,
    metaDescription: property.meta_description,
    createdAt: new Date(property.created_at),
    updatedAt: new Date(property.updated_at),
  }));

  // Filter and search properties
  const filteredProperties = properties.filter(property => {
    const matchesSearch = !searchTerm ||
      property.kodeListing.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (property.judulProperti && property.judulProperti.toLowerCase().includes(searchTerm.toLowerCase())) ||
      property.provinsi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.kabupaten.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = !filterType || filterType === "all" || property.jenisProperti === filterType;
    const matchesStatus = !filterStatus || filterStatus === "all" || property.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-properties'] });
      toast({ title: "Properti berhasil dihapus" });
    },
    onError: (error: any) => {
      console.error('Delete error:', error);
      toast({
        title: "Error",
        description: error?.message || "Gagal menghapus properti",
        variant: "destructive",
      });
    },
  });

  const bulkUpdateMutation = useMutation({
    mutationFn: async ({ ids, updates }: { ids: string[], updates: any }) => {
      const { data, error } = await supabase
        .from('properties')
        .update(updates)
        .in('id', ids)
        .select();

      if (error) throw error;
      return { updated: data?.length || 0, properties: data };
    },
    onSuccess: async (data, variables) => {
      console.log('=== BULK UPDATE SUCCESS ===');
      console.log('Response data:', data);
      console.log('Variables:', variables);
      console.log('Updated properties count:', data?.updated);

      await queryClient.invalidateQueries({ queryKey: ['admin-properties'] });
      setSelectedIds([]);
      toast({ title: `${data?.updated || variables.ids.length} properti berhasil diupdate` });
    },
    onError: (error: any) => {
      console.error('=== BULK UPDATE ERROR ===', error);
      toast({
        title: "Error",
        description: error?.message || "Gagal mengupdate properti",
        variant: "destructive",
      });
    },
  });

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus properti ini?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleBulkUpdate = (field: string, value: any) => {
    if (selectedIds.length === 0) return;
    console.log('=== BULK UPDATE ===');
    console.log('Field:', field);
    console.log('Value:', value);
    console.log('Selected IDs:', selectedIds);
    const updates: any = {};
    updates[field] = value;
    console.log('Updates object:', updates);
    bulkUpdateMutation.mutate({ ids: selectedIds, updates });
  };

  const handleBulkStatusChange = () => {
    if (selectedIds.length === 0 || !bulkStatusValue) return;
    handleBulkUpdate('status', bulkStatusValue);
    setBulkStatusValue("");
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterType("all");
    setFilterStatus("all");
  };

  const toggleSelection = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id)
        ? prev.filter(selectedId => selectedId !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredProperties.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredProperties.map(p => p.id));
    }
  };

  const formatPrice = (price: string, isPerMeter: boolean = false) => {
    const num = parseFloat(price);
    let displayPrice = num;

    if (isPerMeter) {
      if (num >= 1000000000) {
        const value = num / 1000000000;
        const rounded = Math.round(value * 10) / 10;
        return `Rp ${rounded % 1 === 0 ? rounded.toFixed(0) : rounded.toFixed(1)}jt/m²`;
      } else if (num >= 1000000) {
        const value = num / 1000000;
        const rounded = Math.round(value * 10) / 10;
        return `Rp ${rounded % 1 === 0 ? rounded.toFixed(0) : rounded.toFixed(1)}jt/m²`;
      } else if (num >= 1000) {
        const value = num / 1000;
        const rounded = Math.round(value * 10) / 10;
        return `Rp ${rounded % 1 === 0 ? rounded.toFixed(0) : rounded.toFixed(1)}rb/m²`;
      }
      return `Rp ${num.toLocaleString('id-ID')}/m²`;
    } else {
      if (num >= 1000000000) {
        const value = num / 1000000000;
        const rounded = Math.round(value * 10) / 10;
        return `Rp ${rounded % 1 === 0 ? rounded.toFixed(0) : rounded.toFixed(1)}M`;
      } else if (num >= 1000000) {
        const value = num / 1000000;
        const rounded = Math.round(value * 10) / 10;
        return `Rp ${rounded % 1 === 0 ? rounded.toFixed(0) : rounded.toFixed(1)}M`;
      }
      return `Rp ${num.toLocaleString('id-ID')}`;
    }
  };

  const getPropertyImage = (property: any) => {
    const imageFields = [
      property.imageUrl,
      property.imageUrl1,
      property.imageUrl2,
      property.imageUrl3,
      property.imageUrl4,
      property.imageUrl5,
    ];

    for (const img of imageFields) {
      if (img && img.trim() !== '') {
        try {
          new URL(img);
          return img;
        } catch {
          continue;
        }
      }
    }

    const propertyTypePlaceholders: Record<string, string> = {
      rumah: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop',
      kost: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&h=300&fit=crop',
      apartment: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop',
      villa: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=400&h=300&fit=crop',
      ruko: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop',
      tanah: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop',
      gudang: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=400&h=300&fit=crop',
      hotel: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
    };

    return propertyTypePlaceholders[property.jenisProperti] ||
           'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div></div>
        <div className="flex gap-2">
          <Button
            variant={isBulkMode ? "secondary" : "outline"}
            onClick={() => {
              setIsBulkMode(!isBulkMode);
              if (isBulkMode) setSelectedIds([]);
            }}
          >
            {isBulkMode ? <Square className="h-4 w-4 mr-2" /> : <CheckSquare className="h-4 w-4 mr-2" />}
            {isBulkMode ? "Keluar Mode Bulk" : "Mode Bulk"}
          </Button>
          <Button
            onClick={() => {
              setSelectedProperty(null);
              setIsFormOpen(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Tambah Properti
          </Button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari kode listing, judul, provinsi, atau kabupaten..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background"
          />
        </div>

        <div className="flex gap-2">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Tipe Properti" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Tipe</SelectItem>
              {["rumah", "apartment", "villa", "ruko", "tanah", "kost", "hotel", "gudang", "bangunan_komersial"].map((type) => (
                <SelectItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1).replace(/_/g, ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="dijual">Dijual</SelectItem>
              <SelectItem value="disewakan">Disewakan</SelectItem>
            </SelectContent>
          </Select>

          {(searchTerm || filterType || filterStatus) && (
            <Button variant="outline" onClick={clearFilters} size="icon">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {isBulkMode && selectedIds.length > 0 && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckSquare className="h-5 w-5 text-blue-600" />
                <span className="font-semibold text-blue-900">{selectedIds.length} properti dipilih</span>
              </div>
              <div className="flex gap-2">
                <Select value={bulkStatusValue} onValueChange={setBulkStatusValue}>
                  <SelectTrigger className="w-32 h-8">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dijual">Dijual</SelectItem>
                    <SelectItem value="disewakan">Disewakan</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  size="sm"
                  onClick={handleBulkStatusChange}
                  disabled={!bulkStatusValue || bulkUpdateMutation.isPending}
                >
                  <Save className="h-3 w-3 mr-1" />
                  Set Status
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    if (confirm(`Hapus ${selectedIds.length} properti?`)) {
                      selectedIds.forEach(id => deleteMutation.mutate(id));
                    }
                  }}
                >
                  <Trash2 className="h-3 w-3 mr-2" />
                  Hapus {selectedIds.length}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="text-center py-12">
          <p>Memuat properti...</p>
        </div>
      ) : properties.length === 0 ? (
        <Card className="bg-muted">
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">Belum ada properti</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredProperties.map((property) => (
            <Card key={property.id} className={`hover-elevate transition-all ${selectedIds.includes(property.id) ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  {isBulkMode && (
                    <div className="flex items-center">
                      <Checkbox
                        checked={selectedIds.includes(property.id)}
                        onCheckedChange={() => toggleSelection(property.id)}
                      />
                    </div>
                  )}
                  <div className="w-24 h-24 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                    <img
                      src={getPropertyImage(property)}
                      alt={property.kodeListing}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop';
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {property.judulProperti || property.kodeListing}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {property.kabupaten || 'N/A'}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          ID: {property.kodeListing}
                        </p>
                        <div className="mt-1">
                          <p className="text-sm font-medium text-primary">
                            {formatPrice(property.hargaProperti, (property as any).hargaPerMeter)}
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Legalitas: {property.legalitas || 'N/A'}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedProperty(property);
                            setIsFormOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(property.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {property.isPremium && <Badge variant="secondary">Premium</Badge>}
                      {property.isFeatured && <Badge className="bg-amber-500 text-white">Featured</Badge>}
                      {property.isHot && <Badge variant="destructive">Hot</Badge>}
                      {property.isSold && <Badge variant="destructive">SOLD</Badge>}
                      {property.isPropertyPilihan && <Badge variant="outline">Pilihan</Badge>}
                      <Badge variant="secondary">{property.status}</Badge>
                    </div>

                    {property.ownerContact && (
                      <p className="text-sm text-muted-foreground">
                        Kontak: {property.ownerContact}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedProperty ? "Edit Properti" : "Tambah Properti Baru"}
            </DialogTitle>
          </DialogHeader>
          <PropertyForm
            property={selectedProperty}
            onSuccess={() => {
              setIsFormOpen(false);
              queryClient.invalidateQueries({ queryKey: ['admin-properties'] });
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}