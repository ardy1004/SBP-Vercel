import type { Metadata } from 'next';
import { getPropertyBySlug } from "@/lib/property-server";

// Generate dynamic metadata for SEO
export async function generatePropertyMetadata(slug: string): Promise<Metadata> {
  const property = await getPropertyBySlug(slug);

  if (!property) {
    return {
      title: 'Properti Tidak Ditemukan - Salam Bumi Property',
      description: 'Maaf, properti yang Anda cari tidak dapat ditemukan.',
    };
  }

  // Helper functions for metadata generation
  const getPropertyImages = (property: any) => {
    const imageFields = [
      property.imageUrl,
      property.imageUrl1,
      property.imageUrl2,
      property.imageUrl3,
      property.imageUrl4,
      property.imageUrl5,
      property.imageUrl6,
      property.imageUrl7,
      property.imageUrl8,
      property.imageUrl9,
    ];

    const validImages: string[] = [];

    for (const img of imageFields) {
      if (img && img.trim() !== '') {
        try {
          new URL(img);
          validImages.push(img);
        } catch {
          continue;
        }
      }
    }

    // Ensure minimum 5 images, add placeholders if needed
    const propertyTypePlaceholders: Record<string, string> = {
      rumah: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
      kost: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&h=600&fit=crop',
      apartment: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop',
      villa: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&h=600&fit=crop',
      ruko: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop',
      tanah: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop',
      gudang: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&h=600&fit=crop',
      hotel: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
    };

    const placeholder = propertyTypePlaceholders[property.jenisProperti] ||
                       'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop';

    // Add placeholders to reach minimum 5 images
    while (validImages.length < 5) {
      validImages.push(placeholder);
    }

    return validImages;
  };

  const formatPrice = (price: any, isPerMeter: boolean = false) => {
    // Handle different price types (string, number, null, undefined)
    let priceStr = '';
    if (typeof price === 'number') {
      priceStr = price.toString();
    } else if (typeof price === 'string') {
      priceStr = price;
    } else {
      return 'Harga tidak tersedia';
    }

    const num = parseFloat(priceStr.replace(/[^\d.-]/g, ''));
    if (isNaN(num)) {
      return 'Harga tidak valid';
    }

    if (isPerMeter) {
      if (num >= 1000000000) {
        const value = num / 1000000000;
        const rounded = Math.round(value * 10) / 10;
        return `Rp ${rounded % 1 === 0 ? rounded.toFixed(0) : rounded.toFixed(1)}jt/m²`;
      } else if (num >= 1000000) {
        const value = num / 1000000;
        const rounded = Math.round(value * 10) / 10;
        return `Rp ${rounded % 1 === 0 ? rounded.toFixed(0) : rounded.toFixed(1)}jt/m²`;
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

  const propertyImages = getPropertyImages(property);
  const price = formatPrice(property.hargaProperti, property.hargaPerMeter);
  const location = property.alamatLengkap || `${property.kabupaten}, ${property.provinsi}`;

  return {
    title: `${property.judulProperti} - ${property.kodeListing} | Salam Bumi Property`,
    description: `${property.jenisProperti} ${property.status} di ${location}. Harga ${price}. ${property.deskripsi?.substring(0, 120)}...`,
    keywords: [
      property.jenisProperti,
      property.status,
      property.kabupaten,
      property.provinsi,
      property.kodeListing,
      'properti',
      'real estate',
      'rumah',
      'tanah',
      'apartemen'
    ].join(', '),
    authors: [{ name: 'Salam Bumi Property' }],
    creator: 'Salam Bumi Property',
    publisher: 'Salam Bumi Property',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      title: `${property.judulProperti} - ${property.kodeListing}`,
      description: `${property.jenisProperti} ${property.status} di ${location}. Harga ${price}.`,
      url: `https://sbp-vercel.vercel.app/properties/${slug}`,
      siteName: 'Salam Bumi Property',
      images: [
        {
          url: propertyImages[0],
          width: 1200,
          height: 630,
          alt: `${property.judulProperti} - ${property.kodeListing}`,
        },
        ...propertyImages.slice(1, 4).map((image, index) => ({
          url: image,
          width: 600,
          height: 400,
          alt: `${property.judulProperti} - Image ${index + 2}`,
        }))
      ],
      locale: 'id_ID',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${property.judulProperti} - ${property.kodeListing}`,
      description: `${property.jenisProperti} ${property.status} di ${location}. Harga ${price}.`,
      images: [propertyImages[0]],
      creator: '@salambumiproperty',
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: `https://sbp-vercel.vercel.app/properties/${slug}`,
    },
  };
}