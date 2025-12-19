import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

type ClassValue = Parameters<typeof clsx>[0]

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPriceNew(price: number | string, options?: { isPerMeter?: boolean }) {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  if (isNaN(numPrice)) return 'Rp 0';

  const formatted = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numPrice);

  if (options?.isPerMeter) {
    return `${formatted}/m²`;
  }

  return formatted;
}

export function generatePropertySlug(params: {
  status?: string;
  jenis_properti?: string;
  provinsi?: string;
  kabupaten?: string;
  judul_properti?: string;
  kode_listing?: string;
}) {
  const {
    status = 'dijual',
    jenis_properti = 'properti',
    provinsi,
    kabupaten,
    judul_properti,
    kode_listing
  } = params;

  const parts = [
    status,
    jenis_properti,
    kabupaten?.toLowerCase().replace(/\s+/g, '-'),
    judul_properti?.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim(),
    kode_listing
  ].filter(Boolean);

  return parts.join('-');
}