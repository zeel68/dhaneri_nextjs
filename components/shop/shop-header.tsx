"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Grid, List, SlidersHorizontal } from "lucide-react"
import { useSearch } from "@/lib/search-context"

export function ShopHeader() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)
  const { state, setSortBy } = useSearch()

  const handleSortChange = (value: string) => {
    setSortBy(value)
  }

  return (
    <div className="bg-card border-b">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col space-y-4">
          {/* Breadcrumb */}
          <nav className="text-sm text-muted-foreground">
            <span>Home</span> <span className="mx-2">/</span> <span className="text-foreground">Shop</span>
          </nav>

          {/* Page Title */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground text-balance">Women's Indian Clothing</h1>
              <p className="text-muted-foreground mt-1">
                Discover our complete collection of kurtis and traditional wear
              </p>
            </div>

            {/* View Controls */}
            <div className="flex items-center gap-4">
              {/* Mobile Filter Toggle */}
              <Button
                variant="outline"
                size="sm"
                className="lg:hidden bg-transparent"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
              </Button>

              {/* Sort Dropdown */}
              <Select value={state.sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>

              {/* View Mode Toggle */}
              <div className="hidden sm:flex border rounded-md">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              {state.isLoading ? "Loading..." : `Showing ${state.results.length} products`}
              {state.query && ` for "${state.query}"`}
            </span>
            <span>Free shipping on orders above ₹999</span>
          </div>
        </div>
      </div>
    </div>
  )
}
