"use client"

import type React from "react"
import { useState } from "react"
import { ItemStatus } from "@/types"
import { CATEGORIES, FACULTIES, LOCATIONS } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, Upload, X } from "lucide-react"

interface CreateItemModalProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onSubmit?: (data: any) => void
}

export function CreateItemModal({ open = false, onOpenChange, onSubmit }: CreateItemModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: ItemStatus.LOST,
    category: "",
    location: "",
    faculty: "",
    images: [] as File[],
  })

  const [preview, setPreview] = useState<string[]>([])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      setFormData((prev) => ({ ...prev, images: [...prev.images, ...files] }))

      files.forEach((file) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          setPreview((prev) => [...prev, reader.result as string])
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
    setPreview((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.category || !formData.location) {
      alert("Mohon isi semua field yang diperlukan")
      return
    }
    onSubmit?.(formData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Lapor Barang Hilang/Ditemukan</DialogTitle>
          <DialogDescription>Berikan detail lengkap tentang barang untuk membantu pencarian</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Jenis Laporan</label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value as ItemStatus }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ItemStatus.LOST}>Barang Hilang</SelectItem>
                  <SelectItem value={ItemStatus.FOUND}>Barang Ditemukan</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Kategori</label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Nama Barang</label>
            <Input
              placeholder="Contoh: iPhone 13 Pro Max warna hitam"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Deskripsi Detail</label>
            <Textarea
              placeholder="Berikan detail tentang barang, termasuk ciri khas, warna, merek, dan kondisi..."
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              rows={4}
            />
          </div>

          {/* Location & Faculty */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Lokasi</label>
              <Select
                value={formData.location}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, location: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih lokasi" />
                </SelectTrigger>
                <SelectContent>
                  {LOCATIONS.map((loc) => (
                    <SelectItem key={loc} value={loc}>
                      {loc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Fakultas</label>
              <Select
                value={formData.faculty}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, faculty: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih fakultas" />
                </SelectTrigger>
                <SelectContent>
                  {FACULTIES.map((fac) => (
                    <SelectItem key={fac} value={fac}>
                      {fac}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Images */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Foto Barang</label>
            <div className="border-2 border-dashed border-slate-700/50 rounded-lg p-6">
              <label className="cursor-pointer">
                <div className="flex flex-col items-center justify-center">
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Klik untuk upload atau drag & drop</p>
                  <p className="text-xs text-muted-foreground mt-1">JPG, PNG, max 5MB</p>
                </div>
                <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            </div>

            {/* Image Preview */}
            {preview.length > 0 && (
              <div className="grid grid-cols-3 gap-4 mt-4">
                {preview.map((src, idx) => (
                  <div key={idx} className="relative group">
                    <img src={src || "/placeholder.svg"} alt="preview" className="h-24 w-24 object-cover rounded-lg" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute -top-2 -right-2 bg-destructive rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* AI Tips */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <p className="font-semibold mb-1">Tips AI Assistant:</p>
              <p>
                Sertakan detail spesifik seperti merek, warna, ciri khas unik untuk meningkatkan peluang menemukan
                barang Anda.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange?.(false)} className="flex-1">
              Batal
            </Button>
            <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90 text-slate-900">
              Publikasikan Laporan
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
