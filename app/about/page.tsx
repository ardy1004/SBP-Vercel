export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">Tentang Salam Bumi Property</h1>
          <div className="prose prose-lg mx-auto">
            <p className="text-center text-gray-600 mb-8">
              Platform properti terpercaya di Yogyakarta dengan pengalaman lebih dari 5 tahun
              melayani kebutuhan properti masyarakat Yogyakarta dan sekitarnya.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mt-12">
              <div>
                <h2 className="text-2xl font-semibold mb-4">Visi Kami</h2>
                <p className="text-gray-700">
                  Menjadi platform properti terdepan di Yogyakarta yang menghubungkan
                  penjual dan pembeli properti dengan transparan dan profesional.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-4">Misi Kami</h2>
                <ul className="text-gray-700 space-y-2">
                  <li>• Memberikan pelayanan prima kepada setiap klien</li>
                  <li>• Menyediakan informasi properti yang akurat dan terkini</li>
                  <li>• Membangun kepercayaan melalui transparansi</li>
                  <li>• Berkontribusi pada kemajuan properti di Yogyakarta</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}