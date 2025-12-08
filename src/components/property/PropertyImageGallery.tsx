'use client';

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ResponsiveImage } from "@/components/ui/responsive-image";
import { ImageVariants } from "@/lib/imageUtils";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PropertyImageGalleryProps {
  images: string[];
  title: string;
  getImageVariants?: (imageUrl: string) => ImageVariants | undefined;
}

export function PropertyImageGallery({
  images,
  title,
  getImageVariants
}: PropertyImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
    setIsLightboxOpen(true);
    setIsZoomed(false);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setIsZoomed(false);
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  return (
    <>
      <Card>
        <CardContent className="p-0">
          {/* Main Image */}
          <div className="relative group cursor-pointer" onClick={() => openLightbox(selectedImageIndex)}>
            <ResponsiveImage
              src={images[selectedImageIndex]}
              variants={getImageVariants?.(images[selectedImageIndex])}
              alt={`${title} - Image ${selectedImageIndex + 1}`}
              className="w-full h-96 object-cover rounded-t-lg transition-transform duration-300 group-hover:scale-105"
            />
            {/* Zoom Icon */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <ZoomIn className="w-8 h-8 text-white" />
            </div>
            {/* Image Counter */}
            <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
              {selectedImageIndex + 1} / {images.length}
            </div>
          </div>

          {/* Thumbnail Gallery */}
          <div className="p-4 bg-gray-50">
            <div className="grid grid-cols-4 gap-3">
              {images.slice(0, 4).map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    selectedImageIndex === index
                      ? 'border-blue-500 ring-2 ring-blue-200'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <ResponsiveImage
                    src={image}
                    variants={getImageVariants?.(image)}
                    alt={`${title} - Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-200 hover:scale-110"
                  />
                </button>
              ))}
            </div>
            {images.length > 4 && (
              <p className="text-sm text-gray-500 mt-2 text-center">
                +{images.length - 4} gambar lainnya
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
          <div className="relative max-w-5xl max-h-screen p-4">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
            >
              <X className="w-6 h-6" />
            </Button>

            {/* Zoom Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleZoom}
              className="absolute top-4 left-4 z-10 text-white hover:bg-white/20"
            >
              <ZoomIn className="w-6 h-6" />
            </Button>

            {/* Main Image */}
            <div className={`relative ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`} onClick={toggleZoom}>
              <img
                src={images[selectedImageIndex]}
                alt={`${title} - Image ${selectedImageIndex + 1}`}
                className={`max-w-full max-h-screen object-contain transition-transform duration-300 ${
                  isZoomed ? 'scale-150' : 'scale-100'
                }`}
                style={{ imageRendering: isZoomed ? 'auto' : 'auto' }}
              />
            </div>

            {/* Navigation */}
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                >
                  <ChevronLeft className="w-8 h-8" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                >
                  <ChevronRight className="w-8 h-8" />
                </Button>
              </>
            )}

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm">
              {selectedImageIndex + 1} / {images.length}
            </div>

            {/* Thumbnail Strip */}
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2">
              {images.slice(Math.max(0, selectedImageIndex - 2), selectedImageIndex + 3).map((image, index) => {
                const actualIndex = Math.max(0, selectedImageIndex - 2) + index;
                return (
                  <button
                    key={actualIndex}
                    onClick={() => setSelectedImageIndex(actualIndex)}
                    className={`w-16 h-16 rounded overflow-hidden border-2 transition-all ${
                      actualIndex === selectedImageIndex
                        ? 'border-white'
                        : 'border-white/50 hover:border-white'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${actualIndex + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}