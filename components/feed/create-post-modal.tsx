"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

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

    const reader = new FileReader()
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, image: reader.result as string }))
    }
    reader.readAsDataURL(file)
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
        description: "Post berhasil dibuat!",
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Buat Laporan Baru</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Type Selection */}
          <div>
            <label className="text-sm font-semibold text-gray-900 mb-3 block">Jenis Laporan</label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setType("lost")}
                className={`flex-1 py-3 rounded-lg border-2 font-semibold transition ${
                  type === "lost" ? "border-red-500 bg-red-50 text-red-700" : "border-gray-200 bg-white text-gray-700"
                }`}
              >
                Barang Hilang
              </button>
              <button
                type="button"
                onClick={() => setType("found")}
                className={`flex-1 py-3 rounded-lg border-2 font-semibold transition ${
                  type === "found"
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-gray-200 bg-white text-gray-700"
                }`}
              >
                Barang Ditemukan
              </button>
            </div>
          </div>

          {/* Item Name */}
          <div>
            <label className="text-sm font-semibold text-gray-900 mb-2 block">Nama Barang*</label>
            <Input
              type="text"
              name="itemName"
              placeholder="Contoh: iPhone 13 Pro Max, Dompet Kulit Coklat"
              value={formData.itemName}
              onChange={handleChange}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-semibold text-gray-900 mb-2 block">Deskripsi Detail*</label>
            <textarea
              name="description"
              placeholder="Berikan deskripsi yang detail tentang barang, termasuk ciri khas, warna, merk, dan kondisi..."
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 outline-none resize-none"
              rows={4}
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="text-sm font-semibold text-gray-900 mb-2 block">Foto Barang*</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              {formData.image ? (
                <div>
                  <img
                    src={formData.image || "/placeholder.svg"}
                    alt="Preview"
                    className="max-h-48 mx-auto mb-4 rounded"
                  />
                  <label className="cursor-pointer text-yellow-600 font-semibold hover:underline">
                    Ganti Foto
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
              ) : (
                <label className="cursor-pointer">
                  <span className="text-4xl mb-2 block">📸</span>
                  <span className="font-semibold text-gray-900">Klik untuk upload foto atau drag & drop</span>
                  <p className="text-sm text-gray-600 mt-2">Format: JPG, PNG, max 5MB</p>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              )}
            </div>
          </div>

          {/* Category & Faculty */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-900 mb-2 block">Kategori*</label>
              <Select value={formData.category} onValueChange={(val) => handleSelectChange("category", val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori..." />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-900 mb-2 block">Fakultas*</label>
              <Select value={formData.faculty} onValueChange={(val) => handleSelectChange("faculty", val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih fakultas..." />
                </SelectTrigger>
                <SelectContent>
                  {FACULTIES.map((f) => (
                    <SelectItem key={f} value={f}>
                      {f}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="text-sm font-semibold text-gray-900 mb-2 block">Lokasi Terakhir Dilihat*</label>
            <Select value={formData.location} onValueChange={(val) => handleSelectChange("location", val)}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih lokasi..." />
              </SelectTrigger>
              <SelectContent>
                {LOCATIONS.map((l) => (
                  <SelectItem key={l} value={l}>
                    {l}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tips */}
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm font-semibold text-gray-900 mb-2">💡 Tips AI Assistant</p>
            <p className="text-xs text-gray-700">
              Sertakan detail seperti merk, warna, ukuran, dan ciri khas untuk membantu AI mencokkan dengan laporan
              lain.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <Button type="button" onClick={onClose} variant="outline" className="flex-1 border-gray-300 bg-transparent">
              Batal
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold"
            >
              {loading ? "Memproses..." : "Publikasikan Laporan"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
