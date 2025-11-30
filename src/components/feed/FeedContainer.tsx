"use client"

import { useEffect, useState } from "react"
import { ItemStatus } from "@/types"
import { useFeed } from "@/lib/hooks"
import { CATEGORIES, FACULTIES } from "@/lib/constants"
import { ItemCard, EmptyState, LoadingSpinner, FilterBar } from "@/components/shared"
import { Button } from "@/components/ui/button"
import { Plus, RefreshCw } from "lucide-react"

interface FeedContainerProps {
  onCreateNew?: () => void
  userRole?: string
}

export function FeedContainer({ onCreateNew, userRole }: FeedContainerProps) {
  const { items, isLoading, error, fetchItems, currentFilters } = useFeed()
  const [filters, setFilters] = useState({
    status: "",
    category: "",
    faculty: "",
    search: "",
  })
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchItems(filters)
  }, [filters, fetchItems])

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => {
      // If clicking the same filter value, reset it to show all
      if (prev[key as keyof typeof prev] === value) {
        return { ...prev, [key]: "" }
      }
      return { ...prev, [key]: value, page: 1 }
    })
  }

  const handleSearch = (query: string) => {
    setFilters((prev) => ({ ...prev, search: query, page: 1 }))
  }

  const handleClearFilters = () => {
    setFilters({
      status: "",
      category: "",
      faculty: "",
      search: "",
    })
  }

  const handleLike = (itemId: string) => {
    setLikedItems((prev) => {
      const updated = new Set(prev)
      if (updated.has(itemId)) {
        updated.delete(itemId)
      } else {
        updated.add(itemId)
      }
      return updated
    })
  }

  const filterOptions = [
    {
      name: "status",
      label: "Tipe",
      options: [
        { value: ItemStatus.LOST, label: "Hilang" },
        { value: ItemStatus.FOUND, label: "Ditemukan" },
      ],
      value: filters.status,
    },
    {
      name: "category",
      label: "Kategori",
      options: CATEGORIES.map((cat) => ({ value: cat, label: cat })),
      value: filters.category,
    },
    {
      name: "faculty",
      label: "Fakultas",
      options: FACULTIES.map((fac) => ({ value: fac, label: fac })),
      value: filters.faculty,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Feed</h1>
          <p className="text-slate-400 mt-1">Temukan atau laporkan barang hilang</p>
        </div>
        <Button onClick={onCreateNew} className="bg-primary hover:bg-primary/90 text-slate-900">
          <Plus className="h-4 w-4 mr-2" />
          Laporan Baru
        </Button>
      </div>

      {/* Filters */}
      <FilterBar
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        filters={filterOptions}
        onClearFilters={handleClearFilters}
        searchPlaceholder="Cari barang..."
      />

      {/* Content */}
      {isLoading ? (
        <LoadingSpinner text="Memuat item..." />
      ) : error ? (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-destructive">
          <p className="font-medium">Error: {error}</p>
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          title="Tidak ada item"
          description="Mulai laporan barang hilang atau temukan barang orang lain."
          icon="items"
          action={
            <Button onClick={onCreateNew} className="bg-primary hover:bg-primary/90 text-slate-900">
              <Plus className="h-4 w-4 mr-2" />
              Laporan Pertama
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} onLike={() => handleLike(item.id)} liked={likedItems.has(item.id)} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {items.length > 0 && (
        <div className="flex justify-center pt-6">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Muat Lebih Banyak
          </Button>
        </div>
      )}
    </div>
  )
}
