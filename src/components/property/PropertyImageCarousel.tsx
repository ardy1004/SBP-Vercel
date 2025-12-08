'use client';

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ResponsiveImage } from "@/components/ui/responsive-image";
import { ImageVariants } from "@/lib/imageUtils";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PropertyImageCarouselProps {
  images: string[];
  title: string;
  getImageVariants?: (imageUrl: string) => ImageVariants | undefined;
  autoSlideInterval?: number; // in milliseconds
  isPremium?: boolean;
}

export function PropertyImageCarousel({
  images,
  title,
  getImageVariants,
  autoSlideInterval = 4000,
  isPremium = false
}: PropertyImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto slide functionality
  useEffect(() => {
    if (!isAutoPlaying || images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, autoSlideInterval);

    return () => clearInterval(interval);
  }, [isAutoPlaying, images.length, autoSlideInterval]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  if (images.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">Tidak ada gambar tersedia</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0 relative overflow-hidden">
        {/* Main Image */}
        <div className="relative aspect-[16/10] md:aspect-[16/9]">
          <ResponsiveImage
            src={images[currentIndex]}
            variants={getImageVariants?.(images[currentIndex])}
            alt={`${title} - Image ${currentIndex + 1}`}
            className="w-full h-full object-cover transition-opacity duration-500"
          />

          {/* Premium Label - Bottom Left Corner */}
          {isPremium && (
            <div className="absolute bottom-4 left-4 bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-bold shadow-lg">
              ⭐ PREMIUM
            </div>
          )}

          {/* Overlay Controls */}
          <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-300">
            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={goToPrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronLeft className="w-6 h-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={goToNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronRight className="w-6 h-6" />
                </Button>
              </>
            )}

            {/* Auto Play Toggle */}
            {images.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleAutoPlay}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white"
              >
                {isAutoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
            )}

            {/* Image Counter */}
            <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
              {currentIndex + 1} / {images.length}
            </div>
          </div>
        </div>

        {/* Thumbnail Indicators */}
        {images.length > 1 && (
          <div className="p-4 bg-gray-50">
            <div className="flex justify-center gap-2 overflow-x-auto">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    index === currentIndex
                      ? 'border-blue-500 ring-2 ring-blue-200'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <ResponsiveImage
                    src={image}
                    variants={getImageVariants?.(image)}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Progress Bar for Auto Slide */}
        {images.length > 1 && isAutoPlaying && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
            <div
              className="h-full bg-blue-500 transition-all duration-100 ease-linear"
              style={{
                width: `${((currentIndex + 1) / images.length) * 100}%`
              }}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}