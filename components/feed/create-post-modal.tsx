"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { UploadCloud, Sparkles, X, MapPin, Building2, Tag } from "lucide-react"

const FACULTIES = [
  "Ilmu Komputer",
  "Kedokteran Gigi",
  "Ilmu Administrasi",
  "Kesehatan Masyarakat",
  "Psikologi",
  "Ilmu Keperawatan",
  "Kedokteran",
  "Ekonomi dan Bisnis",
  "Hukum",
  "Ilmu Sosial dan Ilmu Politik",
  "Ilmu Pengetahuan Budaya",
  "Matematika dan Ilmu Pengetahuan Alam",
  "Teknik",
  "Farmasi",
]

const CATEGORIES = ["Elektronik", "Dokumen", "Tas & Dompet", "Kunci", "Pakaian", "Alat Tulis", "Lainnya"]

const LOCATIONS = ["Perpustakaan Pusat", "Auditorium", "Kantin", "Parkiran", "Ruang Kelas", "Laboratorium", "Masjid"]

interface CreatePostModalProps {
  onClose: () => void
  onPostCreated: () => void
}

export default function CreatePostModal({ onClose, onPostCreated }: CreatePostModalProps) {
  const [type, setType] = useState<"lost" | "found">("lost")
  const [formData, setFormData] = useState({
    itemName: "",
    description: "",
    category: "",
    faculty: "",
    location: "",
    image: "",
  })
  const [loading, setLoading] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    processFile(file)
  }

  const processFile = (file: File) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, image: reader.result as string }))
    }
    reader.readAsDataURL(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      processFile(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (
        !formData.itemName ||
        !formData.description ||
        !formData.category ||
        !formData.faculty ||
        !formData.location ||
        !formData.image
      ) {
        throw new Error("Semua field harus diisi")
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          ...formData,
          type,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Gagal membuat post")
      }

      toast({
        title: "Berhasil",
        description: "Laporan berhasil dipublikasikan!",
      })

      onPostCreated()
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err instanceof Error ? err.message : "Gagal membuat post",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-3xl w-full overflow-y-auto shadow-2xl flex flex-col md:flex-row overflow-hidden border border-gray-100">

        {/* Left Side: Visual/Type */}
        <div className={`p-8 md:w-1/3 flex flex-col justify-between text-white ${type === 'lost' ? 'bg-gradient-to-br from-red-500 to-rose-600' : 'bg-gradient-to-br from-emerald-500 to-teal-600'}`}>
          <div>
            <div className="bg-white/20 w-fit px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md mb-6">
              Laporan Baru
            </div>
            <h2 className="text-3xl font-bold mb-4">{type === 'lost' ? 'Barang Hilang' : 'Barang Ditemukan'}</h2>
            <p className="text-white/80 text-sm leading-relaxed">
              {type === 'lost'
                ? "Bantu kami menemukan barangmu dengan memberikan informasi sedetail mungkin."
                : "Terima kasih orang baik! Laporanmu akan sangat membantu pemilik barang."}
            </p>
          </div>

          <div className="space-y-3 mt-8">
            <p className="text-xs font-bold uppercase tracking-widest opacity-70">Ganti Tipe Laporan</p>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setType('lost')}
                className={`px-4 py-3 rounded-xl text-left text-sm font-bold transition-all ${type === 'lost' ? 'bg-white text-red-600 shadow-lg' : 'bg-black/20 text-white hover:bg-black/30'}`}
              >
                🔍 Saya Kehilangan Barang
              </button>
              <button
                onClick={() => setType('found')}
                className={`px-4 py-3 rounded-xl text-left text-sm font-bold transition-all ${type === 'found' ? 'bg-white text-emerald-600 shadow-lg' : 'bg-black/20 text-white hover:bg-black/30'}`}
              >
                🎁 Saya Menemukan Barang
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="flex-1 bg-white flex flex-col h-full max-h-[90vh] overflow-y-auto md:w-2/3">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
            <h3 className="font-bold text-gray-900">Detail Informasi</h3>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition">
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Image Upload Area */}
            <div
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${isDragOver ? 'border-yellow-400 bg-yellow-50 scale-[0.99]' : 'border-gray-200 hover:border-yellow-400 hover:bg-gray-50'}`}
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
            >
              {formData.image ? (
                <div className="relative group w-fit mx-auto">
                  <img src={formData.image} alt="Preview" className="h-48 rounded-lg shadow-md object-cover" />
                  <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg cursor-pointer">
                    <span className="text-white font-bold text-sm">Ganti Foto</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center">
                  <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mb-4">
                    <UploadCloud className="w-8 h-8" />
                  </div>
                  <span className="font-bold text-gray-900 text-lg">Upload Foto Barang</span>
                  <span className="text-gray-500 text-sm mt-1">Drag & drop atau klik untuk browse</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Nama Barang</label>
                <Input
                  value={formData.itemName}
                  onChange={handleChange}
                  name="itemName"
                  placeholder="Contoh: iPhone 13 Pro Max"
                  className="h-12 rounded-xl border-gray-200 focus:border-yellow-400 focus:ring-yellow-400/20"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Deskripsi</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Ciri-ciri, warna, kondisi..."
                  className="w-full p-4 rounded-xl border border-gray-200 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/10 outline-none transition-all resize-none h-32 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    Kategori
                  </label>
                  <Select value={formData.category} onValueChange={(val) => handleSelectChange("category", val)}>
                    <SelectTrigger className="h-12 rounded-xl border-gray-200">
                      <SelectValue placeholder="Pilih..." />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                    <Building2 className="w-3 h-3" />
                    Fakultas
                  </label>
                  <Select value={formData.faculty} onValueChange={(val) => handleSelectChange("faculty", val)}>
                    <SelectTrigger className="h-12 rounded-xl border-gray-200">
                      <SelectValue placeholder="Pilih..." />
                    </SelectTrigger>
                    <SelectContent>
                      {FACULTIES.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  Lokasi
                </label>
                <Select value={formData.location} onValueChange={(val) => handleSelectChange("location", val)}>
                  <SelectTrigger className="h-12 rounded-xl border-gray-200">
                    <SelectValue placeholder="Pilih lokasi..." />
                  </SelectTrigger>
                  <SelectContent>
                    {LOCATIONS.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-indigo-500 mt-0.5" />
              <div className="text-sm text-indigo-900">
                <span className="font-bold block mb-1">AI Powered Match</span>
                Deskripsi yang detail membantu AI kami mencocokkan barangmu secara otomatis.
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex gap-4">
              <Button type="button" onClick={onClose} variant="ghost" className="flex-1 rounded-xl h-12 font-bold text-gray-500 hover:text-gray-900">
                Batal
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-[2] rounded-xl h-12 font-bold text-base bg-yellow-400 hover:bg-yellow-500 text-gray-900 shadow-lg shadow-yellow-400/20"
              >
                {loading ? "Memproses..." : "Publikasikan Sekarang"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
