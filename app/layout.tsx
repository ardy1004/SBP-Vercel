import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '../components/Providers'
import { PWAInstall } from '../components/PWAInstall'
import { registerServiceWorker } from '../lib/pwa'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Salam Bumi Property - Cari Properti Terbaik di Yogyakarta',
  description: 'Platform properti terdepan di Yogyakarta dengan fitur pencarian canggih, peta interaktif, dan perbandingan properti profesional. Temukan rumah, kost, apartment, villa, ruko, dan tanah impian Anda.',
  keywords: 'properti yogyakarta, rumah dijual, kost sewa, apartment yogyakarta, villa jogja, ruko sleman, tanah bantul, real estate indonesia',
  authors: [{ name: 'Salam Bumi Property' }],
  creator: 'Salam Bumi Property',
  publisher: 'Salam Bumi Property',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://salambumi.xyz'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Salam Bumi Property - Cari Properti Terbaik di Yogyakarta',
    description: 'Platform properti terdepan di Yogyakarta dengan fitur pencarian canggih, peta interaktif, dan perbandingan properti profesional.',
    url: 'https://salambumi.xyz',
    siteName: 'Salam Bumi Property',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Salam Bumi Property - Platform Properti Terpercaya',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Salam Bumi Property - Cari Properti Terbaik di Yogyakarta',
    description: 'Platform properti terdepan di Yogyakarta dengan fitur pencarian canggih, peta interaktif, dan perbandingan properti profesional.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-site-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/icon-192x192.svg" sizes="192x192" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon-192x192.svg" />
        <meta name="theme-color" content="#3B82F6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Salam Bumi Property" />
        <meta name="mobile-web-app-capable" content="yes" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('[PWA] SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('[PWA] SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <Providers>
          {children}
          <PWAInstall />
        </Providers>
      </body>
    </html>
  )
}