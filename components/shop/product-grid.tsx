"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, ShoppingBag, Eye, Star, Loader2 } from "lucide-react"
import { useCartStore } from "@/stores/cartStore"
import { useWishlistStore } from "@/stores/wishlistStore"
import { useState } from "react"

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

interface ProductGridProps {
  products: Product[];
  loading: boolean;
  error: string | undefined;
}

export function ProductGrid({ products, loading, error }: ProductGridProps) {
  const { addToCart } = useCartStore()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore()
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})

  const toggleWishlist = async (product: Product) => {
    if (isInWishlist(product._id)) {
      await removeFromWishlist(product._id)
    } else {
      await addToWishlist(product._id)
    }
  }

  const handleQuickAdd = async (product: Product) => {
    await addToCart(product._id, 1)
  }

  const handleImageError = (productId: string) => {
    setImageErrors(prev => ({ ...prev, [productId]: true }))
  }

  const isInStock = (product: Product) => {
    return product.stock.quantity - product.stock.reserved > 0
  }

  const availableStock = (product: Product) => {
    return product.stock.quantity - product.stock.reserved
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Loading products...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <h3 className="text-lg font-medium text-foreground mb-2">Error loading products</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Try again
          </Button>
        </div>
      </div>
    )
  }

  if (products.length === 0 && !loading) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <h3 className="text-lg font-medium text-foreground mb-2">No products found</h3>
          <p className="text-muted-foreground mb-4">No products match your current filters</p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Clear all filters
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card
            key={product._id}
            className="group overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300 relative"
          >
            {/* Inactive overlay */}
            {!product.is_active && (
              <div className="absolute inset-0 bg-black/40 z-10 flex items-center justify-center">
                <Badge variant="secondary" className="py-1 px-3 bg-gray-800 text-white">
                  Unavailable
                </Badge>
              </div>
            )}

            <CardContent className="p-0">
              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  src={imageErrors[product._id]
                    ? "/placeholder.svg?height=400&width=300"
                    : product.images?.[0] || "/placeholder.svg?height=400&width=300"
                  }
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={() => handleImageError(product._id)}
                />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  {product.tags && product.tags.length > 0 && (
                    <Badge className="bg-primary text-white font-semibold capitalize">
                      {product.tags[0]}
                    </Badge>
                  )}
                  {!isInStock(product) && (
                    <Badge className="bg-gray-600 text-white font-semibold">Out of Stock</Badge>
                  )}
                </div>

                {/* Action buttons */}
                <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-9 w-9 rounded-full bg-white/90 backdrop-blur-sm shadow-md"
                    onClick={() => toggleWishlist(product)}
                  >
                    <Heart className={`h-4 w-4 ${isInWishlist(product._id) ? "fill-current text-red-500" : ""}`} />
                  </Button>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-9 w-9 rounded-full bg-white/90 backdrop-blur-sm shadow-md"
                    asChild
                  >
                    <Link href={`/product/${product.slug}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>

                {/* Quick add to cart */}
                {isInStock(product) && (
                  <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                      size="sm"
                      className="w-full bg-black text-white hover:bg-gray-800 rounded-md font-medium py-2"
                      onClick={() => handleQuickAdd(product)}
                    >
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Quick Add
                    </Button>
                  </div>
                )}
              </div>

              <div className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <Link href={`/product/${product.slug}`}>
                    <h3 className="font-medium text-foreground hover:text-primary transition-colors text-balance line-clamp-2 leading-tight">
                      {product.name}
                    </h3>
                  </Link>
                </div>

                {/* Brand */}
                {product.brand && (
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">{product.brand}</p>
                )}

                {/* Rating */}
                {product.ratings && product.ratings.count > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-medium text-foreground">{product.ratings.average.toFixed(1)}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">({product.ratings.count} reviews)</span>
                  </div>
                )}

                {/* Price */}
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-foreground">₹{product.price.toLocaleString()}</span>
                  {product.GST && (
                    <span className="text-xs text-muted-foreground">+ GST</span>
                  )}
                </div>

                {/* Stock Status */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="capitalize">{product.category}</span>
                  <span>•</span>
                  <span className={isInStock(product) ? "text-green-600 font-medium" : "text-red-600"}>
                    {isInStock(product) ? `${availableStock(product)} in stock` : "Out of Stock"}
                  </span>
                </div>

                {/* Variants indicator */}
                {product.variants && product.variants.length > 0 && (
                  <div className="pt-2">
                    <p className="text-xs text-muted-foreground">
                      {product.variants.length} {product.variants.length === 1 ? 'variant' : 'variants'} available
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      {products.length > 0 && (
        <div className="text-center pt-8">
          <p className="text-sm text-muted-foreground">Showing {products.length} products</p>
        </div>
      )}
    </div>
  )
}