"use client"

// Custom hook for feed data management
import { useCallback, useState } from "react"
import type { Item, ItemStatus, PaginatedResponse } from "@/types"
import { apiClient } from "@/lib/api-client"

export interface FeedFilters {
  status?: ItemStatus
  category?: string
  faculty?: string
  search?: string
  page?: number
  pageSize?: number
}

export const useFeed = () => {
  const [items, setItems] = useState<Item[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    hasMore: false,
  })

  const fetchItems = useCallback(async (filters: FeedFilters = {}) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.get<PaginatedResponse<Item>>("/items", {
        params: {
          ...filters,
          page: filters.page || 1,
          pageSize: filters.pageSize || 10,
        },
      })

      setItems(response.data)
      setPagination({
        page: response.page,
        pageSize: response.pageSize,
        total: response.total,
        hasMore: response.hasMore,
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch items"
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const createItem = useCallback(async (itemData: Omit<Item, "id" | "createdAt" | "updatedAt" | "userId">) => {
    try {
      const newItem = await apiClient.post<Item>("/items", itemData)
      setItems((prev) => [newItem, ...prev])
      return newItem
    } catch (err) {
      throw err
    }
  }, [])

  return {
    items,
    isLoading,
    error,
    pagination,
    fetchItems,
    createItem,
  }
}
