"use client"

import { useState, useEffect, use } from "react"
import { ProductGrid } from "@/components/shop/product-grid"
import { AdvancedFilters } from "@/components/shop/advanced-filters"
import { ShopHeader } from "@/components/shop/shop-header"
import { STORE_ID } from "@/data/Consts"
import ApiClient from "@/lib/apiCalling"
import apiClient from "@/lib/apiCalling"
import { Loader2 } from "lucide-react"

interface ShopPageProps {
  params: {
    id: string
  }
}

interface SizeOption {
  id: string;
  size: string;
  stock: number;
  priceModifier: number;
  sku: string;
}

interface Variant {
  id: string;
  color: string;
  images: string[];
  primaryIndex: number;
  sizes: SizeOption[];
  option: string;
  price: number;
  sku: string;
  stock_quantity: number;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  brand: string;
  sku: string;
  GST: number | null;
  HSNCode: string;
  images: string[];
  variants: Variant[];
  ratings: { average: number; count: number };
  stock: {
    quantity: number;
    reserved: number;
    track_inventory: boolean;
    allow_backorder: boolean;
    low_stock_threshold: number;
  };
  slug: string;
  category: string;
  is_active: boolean;
  tags: string[];
  availableTags: string[];
  reviews: any[];
  createdAt: string;
  updatedAt: string;
}

interface FilterOption {
  name: string;
  type: string;
  options: string[];
  is_required: boolean;
}

interface Category {
  _id: string;
  category_id: string;
  store_id: string;
  slug: string;
  is_primary: boolean;
  products: Product[];
  img_url: string;
  display_name: string;
  description: string;
  sort_order: number;
  is_active: boolean;
  config: {
    filters: FilterOption[];
    attributes: any[];
  };
  createdAt: string;
  updatedAt: string;
}

export default function ShopPage({ params }: ShopPageProps) {
  const param = use(params) as any;
  const [category, setCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({})
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000])
  const [sortBy, setSortBy] = useState('newest')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true)
        const response = await apiClient.get(`storefront/store/${STORE_ID}/category/${params.id}`) as any
        const categoryData = response.data.data[0]
        setCategory(categoryData)
      } catch (error) {
        console.error("Error fetching category:", error)
        setError("Failed to load category. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    if (param.id) {
      fetchCategory()
    }
  }, [param.id])

  const handleFilterChange = (filterName: string, value: string) => {
    setSelectedFilters(prev => {
      const current = prev[filterName] || []
      const newFilters = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value]

      return {
        ...prev,
        [filterName]: newFilters
      }
    })
  }

  const handlePriceRangeChange = (min: number, max: number) => {
    setPriceRange([min, max])
  }

  const handleSortChange = (value: string) => {
    setSortBy(value)
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
  }

  const clearFilters = () => {
    setSelectedFilters({})
    setPriceRange([0, 10000])
  }

  const getFilteredProducts = () => {
    if (!category?.products) return []

    let filtered = [...category.products]

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Apply filters
    Object.entries(selectedFilters).forEach(([filterName, values]) => {
      if (values.length > 0) {
        filtered = filtered.filter(product => {
          if (filterName === 'Size') {
            return product.variants.some(variant =>
              variant.sizes.some(size => values.includes(size.size)))
          } else if (filterName === 'Color') {
            return product.variants.some(variant => values.includes(variant.color))
          } else if (filterName === 'Type') {
            return product.tags.some(tag => values.includes(tag))
          }
          return true
        })
      }
    })

    // Apply price filter
    filtered = filtered.filter(product =>
      product.price >= priceRange[0] && product.price <= priceRange[1]
    )

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        filtered.sort((a, b) => b.ratings.average - a.ratings.average)
        break
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
    }

    return filtered
  }

  const filteredProducts = getFilteredProducts()

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="mt-2">Loading products...</p>
        </div>
      </div>
    )
  }

  if (error || !category) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
          <p className="text-muted-foreground">{error || "The category you're looking for doesn't exist."}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <ShopHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Advanced Filters Sidebar */}
          <aside className="lg:w-80 flex-shrink-0">
            <AdvancedFilters
              filters={category.config.filters}
              selectedFilters={selectedFilters}
              priceRange={priceRange}
              sortBy={sortBy}
              searchQuery={searchQuery}
              handleFilterChange={handleFilterChange}
              handlePriceRangeChange={handlePriceRangeChange}
              handleSortChange={handleSortChange}
              handleSearchChange={handleSearchChange}
              clearFilters={clearFilters}
            />
          </aside>

          {/* Product Grid */}
          <main className="flex-1">
            <ProductGrid
              products={filteredProducts}
              loading={loading}
              error={error}
            />
          </main>
        </div>
      </div>
    </div>
  )
}