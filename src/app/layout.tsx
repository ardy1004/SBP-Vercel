import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { GoogleAnalytics } from '@next/third-parties/google'
import { Providers } from './providers'
import { reportWebVitals } from './web-vitals'
import { PerformanceMonitor } from '@/components/PerformanceMonitor'
import "./globals.css"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Salam Bumi Property',
  description: 'Platform properti terpercaya untuk jual beli dan sewa properti',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <Providers>
          {children}
          <PerformanceMonitor />
        </Providers>
        <GoogleAnalytics gaId="GA_MEASUREMENT_ID" />
      </body>
    </html>
  )
}

// Export Web Vitals reporting function
export { reportWebVitals }
