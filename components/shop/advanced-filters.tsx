"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Star, Loader2, Filter, Search, SlidersHorizontal } from "lucide-react"
import { useProductStore } from "@/stores/productStore"
import { useCategoryStore } from "@/stores/categoryStore"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface AdvancedFilters {
  category?: string
  subcategory?: string
  priceRange: [number, number]
  inStock?: boolean
  rating?: number
  tags: string[]
  sortBy: string
  searchQuery: string
}

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "popular", label: "Most Popular" },
  { value: "name", label: "Name A-Z" },
]

const sizes = [
  { id: "xs", name: "XS" },
  { id: "s", name: "S" },
  { id: "m", name: "M" },
  { id: "l", name: "L" },
  { id: "xl", name: "XL" },
  { id: "xxl", name: "XXL" },
]

const colors = [
  { id: "black", name: "Black", hex: "#000000" },
  { id: "white", name: "White", hex: "#FFFFFF" },
  { id: "red", name: "Red", hex: "#DC2626" },
  { id: "blue", name: "Blue", hex: "#2563EB" },
  { id: "green", name: "Green", hex: "#16A34A" },
  { id: "pink", name: "Pink", hex: "#EC4899" },
  { id: "yellow", name: "Yellow", hex: "#EAB308" },
  { id: "purple", name: "Purple", hex: "#9333EA" },
  { id: "orange", name: "Orange", hex: "#EA580C" },
  { id: "gray", name: "Gray", hex: "#6B7280" },
]

const fabrics = [
  { id: "cotton", name: "Cotton" },
  { id: "silk", name: "Silk" },
  { id: "chiffon", name: "Chiffon" },
  { id: "georgette", name: "Georgette" },
  { id: "rayon", name: "Rayon" },
  { id: "linen", name: "Linen" },
  { id: "polyester", name: "Polyester" },
  { id: "wool", name: "Wool" },
]
interface FilterOption {
  name: string;
  type: string;
  options: string[];
  is_required: boolean;
}
interface AdvanceFiltersProps {
  filters: FilterOption[];
  showFilters: boolean;
  selectedFilters: Record<string, string[]>;
  clearFilters: () => void;
  handleFilterChange: (filterName: string, value: string) => void;

}
export function AdvancedFilters() {
  const { fetchProducts, loading, pagination } = useProductStore()
  const { categories, loading: categoriesLoading, fetchCategories } = useCategoryStore()

  const [filters, setFilters] = useState<AdvancedFilters>({
    priceRange: [100, 5000],
    tags: [],
    sortBy: "newest",
    searchQuery: "",
  })

  const [isOpen, setIsOpen] = useState({
    price: true,
    category: true,
    rating: false,
    size: false,
    color: false,
    fabric: false,
    availability: false,
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      applyFilters()
    }, 300)

    return () => clearTimeout(timer)
  }, [filters])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  const applyFilters = async () => {
    const apiFilters: any = {}

    if (filters.category) apiFilters.category = filters.category
    if (filters.priceRange) {
      apiFilters.priceRange = filters.priceRange
    }
    if (filters.inStock) apiFilters.inStock = filters.inStock
    if (filters.rating) apiFilters.rating = filters.rating
    if (filters.tags.length > 0) apiFilters.tags = filters.tags

    await fetchProducts(1, apiFilters)
  }

  const handleFilterChange = (key: keyof AdvancedFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleTagToggle = (tag: string) => {
    setFilters((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags.filter((t) => t !== tag) : [...prev.tags, tag],
    }))
  }

  const clearAllFilters = () => {
    setFilters({
      priceRange: [100, 5000],
      tags: [],
      sortBy: "newest",
      searchQuery: "",
    })
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.category) count++
    if (filters.subcategory) count++
    if (filters.rating) count++
    if (filters.inStock) count++
    count += filters.tags.length
    return count
  }

  const activeFiltersCount = getActiveFiltersCount()

  return (
    <div className="space-y-4">
      {/* Search and Sort Header */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={filters.searchQuery}
                onChange={(e) => handleFilterChange("searchQuery", e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Sort Dropdown */}
            <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange("sortBy", value)}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Active Filters */}
      {activeFiltersCount > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Active Filters ({activeFiltersCount})
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-xs">
                Clear All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-2">
              {filters.category && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Category: {categories.find((c) => c._id === filters.category)?.name}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => handleFilterChange("category", undefined)} />
                </Badge>
              )}
              {filters.rating && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {filters.rating}+ Stars
                  <X className="h-3 w-3 cursor-pointer" onClick={() => handleFilterChange("rating", undefined)} />
                </Badge>
              )}
              {filters.inStock && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  In Stock
                  <X className="h-3 w-3 cursor-pointer" onClick={() => handleFilterChange("inStock", false)} />
                </Badge>
              )}
              {filters.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => handleTagToggle(tag)} />
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Price Range Filter */}
      <Collapsible open={isOpen.price} onOpenChange={(open) => setIsOpen((prev) => ({ ...prev, price: open }))}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardTitle className="text-sm flex items-center justify-between">
                Price Range
                <SlidersHorizontal className="h-4 w-4" />
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              <Slider
                value={filters.priceRange}
                onValueChange={(value) => handleFilterChange("priceRange", value as [number, number])}
                max={10000}
                min={50}
                step={50}
                className="w-full"
              />
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>₹{filters.priceRange[0]}</span>
                <span>₹{filters.priceRange[1]}</span>
              </div>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.priceRange[0]}
                  onChange={(e) => {
                    const value = Number.parseInt(e.target.value) || 0
                    handleFilterChange("priceRange", [value, filters.priceRange[1]])
                  }}
                  className="text-xs"
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.priceRange[1]}
                  onChange={(e) => {
                    const value = Number.parseInt(e.target.value) || 10000
                    handleFilterChange("priceRange", [filters.priceRange[0], value])
                  }}
                  className="text-xs"
                />
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Categories Filter */}
      <Collapsible open={isOpen.category} onOpenChange={(open) => setIsOpen((prev) => ({ ...prev, category: open }))}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardTitle className="text-sm flex items-center justify-between">
                Categories
                <SlidersHorizontal className="h-4 w-4" />
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-3">
              {categoriesLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="ml-2 text-sm text-muted-foreground">Loading categories...</span>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="all-categories"
                      checked={!filters.category}
                      onCheckedChange={(checked) => {
                        if (checked) handleFilterChange("category", undefined)
                      }}
                    />
                    <label htmlFor="all-categories" className="text-sm cursor-pointer font-medium">
                      All Categories
                    </label>
                  </div>
                  {categories.map((category) => (
                    <div key={category._id} className="flex items-center space-x-2 ml-4">
                      <Checkbox
                        id={category._id}
                        checked={filters.category === category._id}
                        onCheckedChange={(checked) => {
                          handleFilterChange("category", checked ? category._id : undefined)
                        }}
                      />
                      <label htmlFor={category._id} className="text-sm cursor-pointer">
                        {category.name}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Rating Filter */}
      <Collapsible open={isOpen.rating} onOpenChange={(open) => setIsOpen((prev) => ({ ...prev, rating: open }))}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardTitle className="text-sm flex items-center justify-between">
                Customer Rating
                <SlidersHorizontal className="h-4 w-4" />
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-3">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center space-x-2">
                  <Checkbox
                    id={`rating-${rating}`}
                    checked={filters.rating === rating}
                    onCheckedChange={(checked) => {
                      handleFilterChange("rating", checked ? rating : undefined)
                    }}
                  />
                  <label htmlFor={`rating-${rating}`} className="text-sm cursor-pointer flex items-center gap-1">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${i < rating ? "fill-accent text-accent" : "text-muted-foreground"}`}
                        />
                      ))}
                    </div>
                    <span>& Up</span>
                  </label>
                </div>
              ))}
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Size Filter */}
      <Collapsible open={isOpen.size} onOpenChange={(open) => setIsOpen((prev) => ({ ...prev, size: open }))}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardTitle className="text-sm flex items-center justify-between">
                Sizes
                <SlidersHorizontal className="h-4 w-4" />
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
              <div className="grid grid-cols-3 gap-2">
                {sizes.map((size) => (
                  <Button
                    key={size.id}
                    variant={filters.tags.includes(size.name) ? "default" : "outline"}
                    size="sm"
                    className="h-8"
                    onClick={() => handleTagToggle(size.name)}
                  >
                    {size.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Color Filter */}
      <Collapsible open={isOpen.color} onOpenChange={(open) => setIsOpen((prev) => ({ ...prev, color: open }))}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardTitle className="text-sm flex items-center justify-between">
                Colors
                <SlidersHorizontal className="h-4 w-4" />
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
              <div className="grid grid-cols-5 gap-3">
                {colors.map((color) => (
                  <div
                    key={color.id}
                    className={`w-8 h-8 rounded-full border-2 cursor-pointer transition-all relative ${filters.tags.includes(color.name)
                      ? "border-foreground scale-110 ring-2 ring-offset-2 ring-foreground"
                      : "border-border hover:border-muted-foreground hover:scale-105"
                      }`}
                    style={{ backgroundColor: color.hex }}
                    onClick={() => handleTagToggle(color.name)}
                    title={color.name}
                  >
                    {color.hex === "#FFFFFF" && (
                      <div className="absolute inset-0 rounded-full border border-gray-200" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Fabric Filter */}
      <Collapsible open={isOpen.fabric} onOpenChange={(open) => setIsOpen((prev) => ({ ...prev, fabric: open }))}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardTitle className="text-sm flex items-center justify-between">
                Fabric
                <SlidersHorizontal className="h-4 w-4" />
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-3">
              {fabrics.map((fabric) => (
                <div key={fabric.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={fabric.id}
                    checked={filters.tags.includes(fabric.name)}
                    onCheckedChange={() => handleTagToggle(fabric.name)}
                  />
                  <label htmlFor={fabric.id} className="text-sm cursor-pointer">
                    {fabric.name}
                  </label>
                </div>
              ))}
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Availability Filter */}
      <Collapsible
        open={isOpen.availability}
        onOpenChange={(open) => setIsOpen((prev) => ({ ...prev, availability: open }))}
      >
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardTitle className="text-sm flex items-center justify-between">
                Availability
                <SlidersHorizontal className="h-4 w-4" />
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="in-stock"
                  checked={filters.inStock || false}
                  onCheckedChange={(checked) => handleFilterChange("inStock", checked)}
                />
                <label htmlFor="in-stock" className="text-sm cursor-pointer">
                  In Stock Only
                </label>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Apply Filters Button */}
      <Button onClick={applyFilters} className="w-full" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Applying Filters...
          </>
        ) : (
          <>
            <Filter className="h-4 w-4 mr-2" />
            Apply Filters
          </>
        )}
      </Button>
    </div>
  )
}
