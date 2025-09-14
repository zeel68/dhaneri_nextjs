"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, TrendingUp, Clock } from "lucide-react"
// import { useSearch } from "@/lib/search-context"

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

interface SearchSuggestionsProps {
  query: string
  onSuggestionClick: (suggestion: string) => void
  isVisible: boolean
}

export function SearchSuggestions({ query, onSuggestionClick, isVisible }: SearchSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem("searchHistory") || "[]")
    setRecentSearches(history.slice(0, 5))
  }, [])

  useEffect(() => {
    if (query.length > 0) {
      // Filter trending searches based on query
      const filtered = trendingSearches.filter((search) => search.toLowerCase().includes(query.toLowerCase()))
      setSuggestions(filtered.slice(0, 5))
    } else {
      setSuggestions([])
    }
  }, [query])

  if (!isVisible) return null

  return (
    <Card className="absolute top-full left-0 right-0 mt-1 z-50 shadow-lg">
      <CardContent className="p-4 space-y-4">
        {/* Search Suggestions */}
        {suggestions.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
              <Search className="h-3 w-3" />
              Suggestions
            </h4>
            <div className="space-y-1">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  className="w-full text-left px-2 py-1 text-sm hover:bg-muted rounded transition-colors"
                  onClick={() => onSuggestionClick(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Trending Searches */}
        {query.length === 0 && (
          <>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                <TrendingUp className="h-3 w-3" />
                Trending
              </h4>
              <div className="flex flex-wrap gap-2">
                {trendingSearches.slice(0, 6).map((search) => (
                  <Badge
                    key={search}
                    variant="secondary"
                    className="cursor-pointer hover:bg-secondary/80"
                    onClick={() => onSuggestionClick(search)}
                  >
                    {search}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                  <Clock className="h-3 w-3" />
                  Recent
                </h4>
                <div className="space-y-1">
                  {recentSearches.map((search) => (
                    <button
                      key={search}
                      className="w-full text-left px-2 py-1 text-sm hover:bg-muted rounded transition-colors text-muted-foreground"
                      onClick={() => onSuggestionClick(search)}
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
