"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Star, Loader2, Filter, Search, SlidersHorizontal } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface FilterOption {
  name: string;
  type: string;
  options: string[];
  is_required: boolean;
}

interface AdvancedFiltersProps {
  filters: FilterOption[];
  selectedFilters: Record<string, string[]>;
  priceRange: [number, number];
  sortBy: string;
  searchQuery: string;
  handleFilterChange: (filterName: string, value: string) => void;
  handlePriceRangeChange: (min: number, max: number) => void;
  handleSortChange: (value: string) => void;
  handleSearchChange: (value: string) => void;
  clearFilters: () => void;
}

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
]

export function AdvancedFilters({
  filters,
  selectedFilters,
  priceRange,
  sortBy,
  searchQuery,
  handleFilterChange,
  handlePriceRangeChange,
  handleSortChange,
  handleSearchChange,
  clearFilters
}: AdvancedFiltersProps) {
  const [isOpen, setIsOpen] = useState({
    price: true,
    category: true,
    rating: false,
    size: false,
    color: false,
    type: false,
  })

  const getActiveFiltersCount = () => {
    let count = 0
    count += Object.values(selectedFilters).flat().length
    if (priceRange[0] > 0 || priceRange[1] < 10000) count++
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
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Sort Dropdown */}
            <Select value={sortBy} onValueChange={handleSortChange}>
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
              <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs">
                Clear All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-2">
              {Object.entries(selectedFilters).map(([filterName, values]) =>
                values.map(value => (
                  <Badge key={`${filterName}-${value}`} variant="secondary" className="flex items-center gap-1">
                    {filterName}: {value}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleFilterChange(filterName, value)}
                    />
                  </Badge>
                ))
              )}
              {(priceRange[0] > 0 || priceRange[1] < 10000) && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Price: ₹{priceRange[0]} - ₹{priceRange[1]}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => handlePriceRangeChange(0, 10000)}
                  />
                </Badge>
              )}
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
                value={priceRange}
                onValueChange={(value) => handlePriceRangeChange(value[0], value[1])}
                max={10000}
                min={0}
                step={100}
                className="w-full"
              />
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>₹{priceRange[0]}</span>
                <span>₹{priceRange[1]}</span>
              </div>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={priceRange[0]}
                  onChange={(e) => {
                    const value = Number.parseInt(e.target.value) || 0
                    handlePriceRangeChange(value, priceRange[1])
                  }}
                  className="text-xs"
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={priceRange[1]}
                  onChange={(e) => {
                    const value = Number.parseInt(e.target.value) || 10000
                    handlePriceRangeChange(priceRange[0], value)
                  }}
                  className="text-xs"
                />
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Dynamic Filters */}
      {filters.map((filter) => (
        <Collapsible
          key={filter.name}
          open={isOpen[filter.name.toLowerCase() as keyof typeof isOpen]}
          onOpenChange={(open) => setIsOpen((prev) => ({ ...prev, [filter.name.toLowerCase()]: open }))}
        >
          <Card>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <CardTitle className="text-sm flex items-center justify-between">
                  {filter.name}
                  <SlidersHorizontal className="h-4 w-4" />
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-3">
                {filter.options.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={`${filter.name}-${option}`}
                      checked={selectedFilters[filter.name]?.includes(option) || false}
                      onCheckedChange={() => handleFilterChange(filter.name, option)}
                    />
                    <label htmlFor={`${filter.name}-${option}`} className="text-sm cursor-pointer">
                      {option}
                    </label>
                  </div>
                ))}
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      ))}

      {/* Clear Filters Button */}
      <Button onClick={clearFilters} className="w-full">
        <X className="h-4 w-4 mr-2" />
        Clear All Filters
      </Button>
    </div>
  )
}