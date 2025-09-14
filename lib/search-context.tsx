"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { mockProducts, type Product } from "./mock-data"

interface SearchState {
  query: string
  filters: {
    categories: string[]
    sizes: string[]
    colors: string[]
    fabrics: string[]
    priceRange: [number, number]
    rating: number
  }
  sortBy: string
  results: Product[]
  isLoading: boolean
}

const SearchContext = createContext<{
  state: SearchState
  setQuery: (query: string) => void
  addFilter: (key: keyof SearchState["filters"], value: string) => void
  removeFilter: (key: keyof SearchState["filters"], value: string) => void
  setFilter: (key: keyof SearchState["filters"], value: any) => void
  clearFilters: () => void
  setSortBy: (sortBy: string) => void
  searchProducts: () => void
} | null>(null)

export function SearchProvider({ children }: { children: ReactNode }) {
  const [query, setQueryState] = useState("")
  const [filters, setFilters] = useState({
    categories: [] as string[],
    sizes: [] as string[],
    colors: [] as string[],
    fabrics: [] as string[],
    priceRange: [500, 8000] as [number, number], // Updated price range to match product prices
    rating: 0,
  })
  const [sortBy, setSortByState] = useState("featured")
  const [results, setResults] = useState<Product[]>(mockProducts)
  const [isLoading, setIsLoading] = useState(false)

  const state: SearchState = {
    query,
    filters,
    sortBy,
    results,
    isLoading,
  }

  const setQuery = (newQuery: string) => {
    setQueryState(newQuery)
    if (newQuery.trim()) {
      searchProducts()
    } else {
      setResults(mockProducts)
    }
  }

  const addFilter = (key: keyof SearchState["filters"], value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: [...(prev[key] as string[]), value],
    }))
    setTimeout(() => searchProducts(), 100)
  }

  const removeFilter = (key: keyof SearchState["filters"], value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: (prev[key] as string[]).filter((item) => item !== value),
    }))
    setTimeout(() => searchProducts(), 100)
  }

  const setFilter = (key: keyof SearchState["filters"], value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
    setTimeout(() => searchProducts(), 100)
  }

  const clearFilters = () => {
    setFilters({
      categories: [],
      sizes: [],
      colors: [],
      fabrics: [],
      priceRange: [500, 8000],
      rating: 0,
    })
    setResults(mockProducts)
  }

  const setSortBy = (newSortBy: string) => {
    setSortByState(newSortBy)
    setTimeout(() => searchProducts(), 100)
  }

  const searchProducts = () => {
    setIsLoading(true)

    // Simulate API delay
    setTimeout(() => {
      let filteredProducts = [...mockProducts]

      // Filter by search query
      if (query.trim()) {
        const lowercaseQuery = query.toLowerCase()
        filteredProducts = filteredProducts.filter(
          (product) =>
            product.name.toLowerCase().includes(lowercaseQuery) ||
            product.description.toLowerCase().includes(lowercaseQuery) ||
            product.category.toLowerCase().includes(lowercaseQuery) ||
            product.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery)),
        )
      }

      // Filter by categories
      if (filters.categories.length > 0) {
        filteredProducts = filteredProducts.filter((product) =>
          filters.categories.some((cat) => product.category.toLowerCase().includes(cat.toLowerCase())),
        )
      }

      // Filter by sizes
      if (filters.sizes.length > 0) {
        filteredProducts = filteredProducts.filter((product) =>
          filters.sizes.some((size) => product.sizes.includes(size)),
        )
      }

      // Filter by colors
      if (filters.colors.length > 0) {
        filteredProducts = filteredProducts.filter((product) =>
          filters.colors.some((color) =>
            product.colors.some((productColor) => productColor.toLowerCase().includes(color.toLowerCase())),
          ),
        )
      }

      // Filter by price range
      filteredProducts = filteredProducts.filter(
        (product) => product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1],
      )

      // Filter by rating
      if (filters.rating > 0) {
        filteredProducts = filteredProducts.filter((product) => product.rating >= filters.rating)
      }

      // Sort products
      switch (sortBy) {
        case "price-low":
          filteredProducts.sort((a, b) => a.price - b.price)
          break
        case "price-high":
          filteredProducts.sort((a, b) => b.price - a.price)
          break
        case "rating":
          filteredProducts.sort((a, b) => b.rating - a.rating)
          break
        case "newest":
          filteredProducts.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
          break
        case "popular":
          filteredProducts.sort((a, b) => b.reviewCount - a.reviewCount)
          break
        default: // featured
          filteredProducts.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0))
      }

      setResults(filteredProducts)
      setIsLoading(false)
    }, 300)
  }

  return (
    <SearchContext.Provider
      value={{
        state,
        setQuery,
        addFilter,
        removeFilter,
        setFilter,
        clearFilters,
        setSortBy,
        searchProducts,
      }}
    >
      {children}
    </SearchContext.Provider>
  )
}

export function useSearch() {
  const context = useContext(SearchContext)
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider")
  }
  return context
}
