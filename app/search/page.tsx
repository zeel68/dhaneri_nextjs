"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { ProductGrid } from "@/components/shop/product-grid"
import { AdvancedFilters } from "@/components/shop/advanced-filters"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, X, Loader2 } from "lucide-react"
import { useProductStore } from "@/stores/productStore"
import { useCategoryStore } from "@/stores/categoryStore"
import { useUserStore } from "@/stores/userStore"

function SearchPageContent() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""

  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [showFilters, setShowFilters] = useState(false)
  const [searchHistory, setSearchHistory] = useState<string[]>([])

  const { products, loading, error, searchProducts, pagination } = useProductStore()
  const { fetchCategories } = useCategoryStore()
  const { startSession } = useUserStore()

  useEffect(() => {
    const initializeSearch = async () => {
      try {
        await startSession()
        await fetchCategories()

        if (initialQuery) {
          await searchProducts(initialQuery)
          // Add to search history
          const history = JSON.parse(localStorage.getItem("searchHistory") || "[]")
          const updatedHistory = [initialQuery, ...history.filter((item: string) => item !== initialQuery)].slice(0, 10)
          localStorage.setItem("searchHistory", JSON.stringify(updatedHistory))
          setSearchHistory(updatedHistory)
        }
      } catch (error) {
        console.error("Failed to initialize search:", error)
      }
    }

    initializeSearch()
  }, [initialQuery, searchProducts, fetchCategories, startSession])

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem("searchHistory") || "[]")
    setSearchHistory(history)
  }, [])

  const handleSearch = async (query: string) => {
    if (query.trim()) {
      setSearchQuery(query)
      await searchProducts(query)

      // Update search history
      const history = JSON.parse(localStorage.getItem("searchHistory") || "[]")
      const updatedHistory = [query, ...history.filter((item: string) => item !== query)].slice(0, 10)
      localStorage.setItem("searchHistory", JSON.stringify(updatedHistory))
      setSearchHistory(updatedHistory)
    }
  }

  const clearSearchHistory = () => {
    localStorage.removeItem("searchHistory")
    setSearchHistory([])
  }

  const removeFromHistory = (query: string) => {
    const updatedHistory = searchHistory.filter((item) => item !== query)
    localStorage.setItem("searchHistory", JSON.stringify(updatedHistory))
    setSearchHistory(updatedHistory)
  }

  const trendingSearches = [
    "Cotton Kurtis",
    "Festive Wear",
    "Palazzo Sets",
    "Anarkali Dresses",
    "Silk Kurtis",
    "Casual Wear",
    "Party Wear",
    "Embroidered Dress",
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-1 max-w-2xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search for products, categories, brands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch(searchQuery)}
                className="pl-12 h-12 text-lg"
              />
              <Button
                onClick={() => handleSearch(searchQuery)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                size="sm"
              >
                Search
              </Button>
            </div>

            <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>

          {/* Search Results Summary */}
          {searchQuery && (
            <div className="mt-4 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Search Results</h1>
                <p className="text-muted-foreground">
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Searching...
                    </span>
                  ) : (
                    `${products.length} results for "${searchQuery}"`
                  )}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Search Suggestions - Show when no search query */}
        {!searchQuery && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Trending Searches */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Trending Searches
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {trendingSearches.map((search) => (
                    <Badge
                      key={search}
                      variant="secondary"
                      className="cursor-pointer hover:bg-secondary/80 transition-colors"
                      onClick={() => handleSearch(search)}
                    >
                      {search}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Search History */}
            {searchHistory.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Search className="h-5 w-5" />
                      Recent Searches
                    </CardTitle>
                    <Button variant="ghost" size="sm" onClick={clearSearchHistory} className="text-xs">
                      Clear All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {searchHistory.map((search) => (
                      <div key={search} className="flex items-center justify-between group">
                        <button
                          className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                          onClick={() => handleSearch(search)}
                        >
                          {search}
                        </button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                          onClick={() => removeFromHistory(search)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <aside className="lg:w-80 flex-shrink-0">
              <div className="sticky top-4">
                <AdvancedFilters />
              </div>
            </aside>
          )}

          {/* Search Results */}
          <main className="flex-1">
            {error ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <h3 className="text-lg font-medium text-foreground mb-2">Search Error</h3>
                  <p className="text-muted-foreground mb-4">{error}</p>
                  <Button variant="outline" onClick={() => window.location.reload()}>
                    Try Again
                  </Button>
                </CardContent>
              </Card>
            ) : searchQuery ? (
              <ProductGrid />
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">Start Your Search</h3>
                  <p className="text-muted-foreground">
                    Enter a search term above or click on trending searches to get started
                  </p>
                </CardContent>
              </Card>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading search...</div>}>
      <SearchPageContent />
    </Suspense>
  )
}
