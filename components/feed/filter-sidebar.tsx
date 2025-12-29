"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronDown, ChevronUp, Search, FilterX } from "lucide-react"

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

interface FilterState {
    search: string
    faculty: string // comma separate
    category: string
    type: string
    status: string
}

interface Props {
    filters: FilterState
    onFilterChange: (key: string, value: string) => void
}

export default function FilterSidebar({ filters, onFilterChange }: Props) {
    const selectedFaculties = filters.faculty ? filters.faculty.split(",") : []
    const selectedCategories = filters.category ? filters.category.split(",") : []
    const selectedTypes = filters.type ? filters.type.split(",") : []
    const selectedStatus = filters.status ? filters.status.split(",") : []

    const [openSections, setOpenSections] = useState({
        status: true,
        type: true,
        faculty: true,
        category: true,
    })

    const toggleSection = (key: keyof typeof openSections) => {
        setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }))
    }

    const toggleItem = (list: string[], item: string) => {
        if (list.includes(item)) {
            return list.filter((i) => i !== item)
        } else {
            return [...list, item]
        }
    }

    const handleTypeChange = (val: string) => {
        const newList = toggleItem(selectedTypes, val)
        onFilterChange("type", newList.join(","))
    }

    const handleStatusChange = (val: string) => {
        const newList = toggleItem(selectedStatus, val)
        onFilterChange("status", newList.join(","))
    }

    const handleFacultyChange = (val: string) => {
        const newList = toggleItem(selectedFaculties, val)
        onFilterChange("faculty", newList.join(","))
    }

    const handleCategoryChange = (val: string) => {
        const newList = toggleItem(selectedCategories, val)
        onFilterChange("category", newList.join(","))
    }

    const hasActiveFilters = filters.faculty || filters.category || filters.type

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-yellow-50 rounded-lg text-yellow-600">
                        <Search className="w-4 h-4" />
                    </div>
                    <h2 className="font-bold text-gray-900 text-lg">Filter</h2>
                </div>
                {hasActiveFilters && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-500 hover:text-red-500 hover:bg-red-50 h-8 px-2"
                        onClick={() => {
                            onFilterChange("faculty", "")
                            onFilterChange("category", "")
                            onFilterChange("type", "")
                            onFilterChange("status", "")
                        }}
                    >
                        <FilterX className="w-3.5 h-3.5 mr-1" />
                        Reset
                    </Button>
                )}
            </div>

            {/* Status Section */}
            <div className="group">
                <button
                    onClick={() => toggleSection("status")}
                    className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-gray-50 transition-colors mb-2"
                >
                    <span className="font-bold text-gray-800 text-sm uppercase tracking-wide">Status Barang</span>
                    {openSections.status ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </button>
                {openSections.status && (
                    <div className="space-y-1 pl-2">
                        {[{ value: "active", label: "Masih Tersedia" }, { value: "claimed", label: "Sedang Diklaim" }].map((option) => (
                            <label key={option.value} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group/item">
                                <Checkbox
                                    checked={selectedStatus.includes(option.value)}
                                    onCheckedChange={() => handleStatusChange(option.value)}
                                    className="data-[state=checked]:bg-yellow-400 data-[state=checked]:border-yellow-400"
                                />
                                <span className={`text-sm ${selectedStatus.includes(option.value) ? 'font-semibold text-gray-900' : 'text-gray-600 group-hover/item:text-gray-900'}`}>{option.label}</span>
                            </label>
                        ))}
                    </div>
                )}
            </div>

            {/* separator */}
            <div className="h-px bg-gray-100 w-full" />

            {/* Type Section */}
            <div className="group">
                <button
                    onClick={() => toggleSection("type")}
                    className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-gray-50 transition-colors mb-2"
                >
                    <span className="font-bold text-gray-800 text-sm uppercase tracking-wide">Tipe Barang</span>
                    {openSections.type ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </button>
                {openSections.type && (
                    <div className="space-y-1 pl-2">
                        {[{ value: "lost", label: "Barang Hilang" }, { value: "found", label: "Barang Ditemukan" }].map((option) => (
                            <label key={option.value} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group/item">
                                <Checkbox
                                    checked={selectedTypes.includes(option.value)}
                                    onCheckedChange={() => handleTypeChange(option.value)}
                                    className="data-[state=checked]:bg-yellow-400 data-[state=checked]:border-yellow-400"
                                />
                                <span className={`text-sm ${selectedTypes.includes(option.value) ? 'font-semibold text-gray-900' : 'text-gray-600 group-hover/item:text-gray-900'}`}>{option.label}</span>
                            </label>
                        ))}
                    </div>
                )}
            </div>

            {/* separator */}
            <div className="h-px bg-gray-100 w-full" />

            {/* Faculty Section */}
            <div>
                <button
                    onClick={() => toggleSection("faculty")}
                    className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-gray-50 transition-colors mb-2"
                >
                    <span className="font-bold text-gray-800 text-sm uppercase tracking-wide">Fakultas</span>
                    {openSections.faculty ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </button>
                {openSections.faculty && (
                    <div className="space-y-1 mt-1 max-h-60 overflow-y-auto pl-2 pr-1 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                        {FACULTIES.map((f) => (
                            <label key={f} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group/item">
                                <Checkbox
                                    checked={selectedFaculties.includes(f)}
                                    onCheckedChange={() => handleFacultyChange(f)}
                                    className="data-[state=checked]:bg-yellow-400 data-[state=checked]:border-yellow-400"
                                />
                                <span className={`text-sm ${selectedFaculties.includes(f) ? 'font-semibold text-gray-900' : 'text-gray-600 group-hover/item:text-gray-900'}`}>{f}</span>
                            </label>
                        ))}
                    </div>
                )}
            </div>

            {/* separator */}
            <div className="h-px bg-gray-100 w-full" />

            {/* Category Section */}
            <div>
                <button
                    onClick={() => toggleSection("category")}
                    className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-gray-50 transition-colors mb-2"
                >
                    <span className="font-bold text-gray-800 text-sm uppercase tracking-wide">Kategori</span>
                    {openSections.category ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </button>
                {openSections.category && (
                    <div className="space-y-1 pl-2">
                        {CATEGORIES.map((c) => (
                            <label key={c} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group/item">
                                <Checkbox
                                    checked={selectedCategories.includes(c)}
                                    onCheckedChange={() => handleCategoryChange(c)}
                                    className="data-[state=checked]:bg-yellow-400 data-[state=checked]:border-yellow-400"
                                />
                                <span className={`text-sm ${selectedCategories.includes(c) ? 'font-semibold text-gray-900' : 'text-gray-600 group-hover/item:text-gray-900'}`}>{c}</span>
                            </label>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
