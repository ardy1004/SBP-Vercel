import { render, screen } from '@testing-library/react'
import { PropertyCard } from '../PropertyCard'
import type { Property } from '@/types'

const mockProperty: Property = {
  id: 'test-id',
  kodeListing: 'TEST001',
  judulProperti: 'Test Property',
  deskripsi: 'A beautiful test property',
  jenisProperti: 'rumah',
  hargaProperti: 100000000,
  provinsi: 'DI.Yogyakarta',
  kabupaten: 'Sleman',
  imageUrl: 'https://example.com/image.jpg',
  isPremium: false,
  isFeatured: false,
  isHot: false,
  isSold: false,
  isPropertyPilihan: false,
  status: 'dijual',
  createdAt: new Date(),
  updatedAt: new Date(),
}

describe('PropertyCard', () => {
  it('renders property information correctly', () => {
    render(<PropertyCard property={mockProperty} />)

    expect(screen.getByText('TEST001')).toBeInTheDocument()
    expect(screen.getByText('Test Property')).toBeInTheDocument()
    expect(screen.getByText('Sleman, DI.Yogyakarta')).toBeInTheDocument()
    expect(screen.getByText('🏠 Rumah')).toBeInTheDocument()
    expect(screen.getByText('Rp 100.000.000')).toBeInTheDocument()
  })

  it('displays sold overlay when property is sold', () => {
    const soldProperty = { ...mockProperty, isSold: true }
    render(<PropertyCard property={soldProperty} />)

    expect(screen.getByText('TERJUAL')).toBeInTheDocument()
  })

  it('shows premium badge when property is premium', () => {
    const premiumProperty = { ...mockProperty, isPremium: true }
    render(<PropertyCard property={premiumProperty} />)

    expect(screen.getByText(/PREMIUM/)).toBeInTheDocument()
  })
})