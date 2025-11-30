"use client"

import { useCallback, useState } from "react"
import type { Item, ItemStatus, PaginatedResponse } from "@/types"
import { apiClient } from "@/lib/api-client"

export interface FeedFilters {
  status?: ItemStatus | ""
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
  const [currentFilters, setCurrentFilters] = useState<FeedFilters>({})
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    hasMore: false,
  })

  const fetchItems = useCallback(async (filters: FeedFilters = {}) => {
    setIsLoading(true)
    setError(null)
    const page = filters.page || 1

    try {
      // Build query params, exclude empty strings
      const params = {
        page,
        pageSize: filters.pageSize || 10,
        ...(filters.status && filters.status !== "" && { status: filters.status }),
        ...(filters.category && filters.category !== "" && { category: filters.category }),
        ...(filters.faculty && filters.faculty !== "" && { faculty: filters.faculty }),
        ...(filters.search && { search: filters.search }),
      }

      const response = await apiClient.get<PaginatedResponse<Item>>("/items", { params })

      setItems(response.data || [])
      setCurrentFilters(filters)
      setPagination({
        page: response.page || 1,
        pageSize: response.pageSize || 10,
        total: response.total || 0,
        hasMore: response.hasMore || false,
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch items"
      setError(message)
      setItems([])
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

  const toggleLike = useCallback(async (itemId: string) => {
    try {
      await apiClient.post(`/items/${itemId}/like`, {})
      setItems((prev) =>
        prev.map((item) =>
          item.id === itemId
            ? {
                ...item,
                likes: (item.likes || 0) + (item.liked ? -1 : 1),
                liked: !item.liked,
              }
            : item,
        ),
      )
    } catch (err) {
      throw err
    }
  }, [])

  const claimItem = useCallback(async (itemId: string, reason: string) => {
    try {
      const response = await apiClient.post(`/items/${itemId}/claim`, { reason })
      // Item status changes to "pending_verification", not removed
      setItems((prev) => prev.map((item) => (item.id === itemId ? { ...item, status: "pending_verification" } : item)))
      return response
    } catch (err) {
      throw err
    }
  }, [])

  return {
    items,
    isLoading,
    error,
    pagination,
    currentFilters,
    fetchItems,
    createItem,
    toggleLike,
    claimItem,
  }
}
