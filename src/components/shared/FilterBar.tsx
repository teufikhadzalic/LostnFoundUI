"use client"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"

interface FilterOption {
  value: string
  label: string
}

interface FilterBarProps {
  onSearch?: (query: string) => void
  onFilterChange?: (key: string, value: string) => void
  filters?: {
    name: string
    label: string
    options: FilterOption[]
    value?: string
  }[]
  onClearFilters?: () => void
  searchPlaceholder?: string
}

export function FilterBar({
  onSearch,
  onFilterChange,
  filters = [],
  onClearFilters,
  searchPlaceholder = "Cari...",
}: FilterBarProps) {
  return (
    <div className="space-y-4">
      {/* Search */}
      {onSearch && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder={searchPlaceholder} onChange={(e) => onSearch(e.target.value)} className="pl-10" />
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-end">
        {filters.map((filter) => (
          <div key={filter.name} className="flex-1 min-w-xs">
            <label className="text-xs font-medium text-muted-foreground">{filter.label}</label>
            <Select value={filter.value || ""} onValueChange={(value) => onFilterChange?.(filter.name, value)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder={`Pilih ${filter.label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {filter.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}

        {onClearFilters && (
          <Button variant="outline" size="sm" onClick={onClearFilters} className="mb-1 bg-transparent">
            <X className="h-4 w-4 mr-1" />
            Hapus Filter
          </Button>
        )}
      </div>
    </div>
  )
}
