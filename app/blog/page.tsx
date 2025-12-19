'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Calendar, User, ArrowRight } from 'lucide-react'

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')

  // Mock blog articles - in real app, this would come from API
  const articles = [
    {
      id: 1,
      title: "Panduan Lengkap Membeli Rumah Pertama Kali",
      excerpt: "Pelajari langkah-langkah penting dalam membeli rumah pertama kali, mulai dari persiapan budget hingga proses serah terima.",
      content: "Membeli rumah pertama kali adalah keputusan besar dalam hidup. Artikel ini akan membahas...",
      category: "Panduan",
      author: "Salam Bumi Property",
      date: "2024-12-15",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop",
      tags: ["rumah", "pembelian", "panduan"]
    },
    {
      id: 2,
      title: "Tips Memilih Lokasi Properti yang Strategis",
      excerpt: "Faktor-faktor penting yang perlu dipertimbangkan dalam memilih lokasi properti untuk investasi atau hunian.",
      content: "Lokasi adalah salah satu faktor terpenting dalam investasi properti...",
      category: "Tips",
      author: "Salam Bumi Property",
      date: "2024-12-10",
      readTime: "4 min read",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop",
      tags: ["lokasi", "investasi", "strategis"]
    },
    {
      id: 3,
      title: "Perbedaan SHM, SHGB, dan Girik dalam Properti",
      excerpt: "Memahami berbagai jenis sertifikat tanah dan bangunan di Indonesia untuk menghindari masalah legal.",
      content: "Dalam dunia properti Indonesia, terdapat beberapa jenis sertifikat yang perlu dipahami...",
      category: "Legal",
      author: "Salam Bumi Property",
      date: "2024-12-05",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=600&fit=crop",
      tags: ["SHM", "SHGB", "sertifikat", "legal"]
    },
    {
      id: 4,
      title: "Investasi Properti di Era Digital: Peluang dan Tantangan",
      excerpt: "Bagaimana teknologi digital mempengaruhi investasi properti dan peluang yang tersedia saat ini.",
      content: "Era digital telah mengubah banyak aspek kehidupan, termasuk dunia investasi properti...",
      category: "Investasi",
      author: "Salam Bumi Property",
      date: "2024-11-28",
      readTime: "7 min read",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop",
      tags: ["investasi", "digital", "teknologi"]
    },
    {
      id: 5,
      title: "Panduan Lengkap Proses KPR untuk Pembelian Rumah",
      excerpt: "Tahapan lengkap pengajuan KPR mulai dari persiapan dokumen hingga pencairan dana.",
      content: "KPR (Kredit Pemilikan Rumah) adalah salah satu cara paling populer untuk memiliki rumah...",
      category: "Panduan",
      author: "Salam Bumi Property",
      date: "2024-11-20",
      readTime: "8 min read",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop",
      tags: ["KPR", "pembelian", "bank"]
    },
    {
      id: 6,
      title: "Tips Renovasi Rumah agar Tetap Nyaman Tinggal",
      excerpt: "Panduan praktis merenovasi rumah agar tetap nyaman dan fungsional untuk keluarga.",
      content: "Renovasi rumah adalah investasi yang penting untuk menjaga kenyamanan hunian...",
      category: "Tips",
      author: "Salam Bumi Property",
      date: "2024-11-15",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&h=600&fit=crop",
      tags: ["renovasi", "rumah", "kenyamanan"]
    }
  ]

  const categories = Array.from(new Set(articles.map(article => article.category)))

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesCategory = categoryFilter === 'all' || article.category === categoryFilter

    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Property Blog</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Berita terbaru, tips, dan wawasan tentang properti di Indonesia
          </p>
        </div>

        {/* Search and Filter Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 bg-white p-6 rounded-lg shadow-sm">
          <Input
            type="text"
            placeholder="Cari artikel..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-[200px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Semua Kategori</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filteredArticles.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600 mb-2">Tidak ada artikel ditemukan</p>
              <p className="text-sm text-gray-500">
                {searchTerm || categoryFilter !== 'all'
                  ? 'Coba sesuaikan pencarian atau filter Anda'
                  : 'Artikel akan segera ditambahkan'}
              </p>
            </div>
          ) : (
            filteredArticles.map(article => (
              <Card key={article.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary" className="text-xs">
                      {article.category}
                    </Badge>
                    <span className="text-xs text-gray-500">{article.readTime}</span>
                  </div>

                  <h3 className="text-xl font-semibold mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {article.title}
                  </h3>

                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{article.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(article.date).toLocaleDateString('id-ID')}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {article.tags.slice(0, 3).map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <Button variant="outline" className="w-full group-hover:bg-blue-50 group-hover:border-blue-300">
                    Baca Selengkapnya
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Load More Button */}
        {filteredArticles.length > 0 && filteredArticles.length >= 6 && (
          <div className="text-center">
            <Button variant="outline" size="lg">
              Muat Artikel Lainnya
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}