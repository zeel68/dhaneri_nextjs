"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, ShoppingBag, Eye, Star } from "lucide-react"

// --- Types (kept minimal / relevant to the grid logic) ---
interface SizeOption {
  id: string
  size: string
  stock: number
  priceModifier: number
  sku: string
}

interface Variant {
  id: string
  color: string
  images: string[]
  primaryIndex: number
  sizes: SizeOption[]
  option: string
  price: number
  sku: string
  stock_quantity: number
}

interface Product {
  _id: string
  name: string
  description?: string
  price: number
  images: string[]
  variants: Variant[]
  ratings?: { average: number; count: number }
  createdAt?: string
  slug?: string
}

// A lightweight grid-friendly product shape we use for rendering
interface GridProduct {
  id: string
  name: string
  price: number
  originalPrice: number
  image: string
  href: string
  isNew: boolean
  discount: number
  rating: number
  reviews: number
  colors: string[]
  sizes: string[]
}

// --- Sample fallback products (keeps UI working if no products passed in) ---
const SAMPLE_PRODUCTS: GridProduct[] = [
  {
    id: "sample-1",
    name: "Embroidered Cotton Kurti",
    price: 1299,
    originalPrice: 1599,
    image: "/placeholder.svg?height=400&width=300",
    href: "/product/embroidered-cotton-kurti",
    isNew: true,
    discount: 19,
    rating: 4.5,
    reviews: 23,
    colors: ["#000000", "#DC2626", "#2563EB"],
    sizes: ["S", "M", "L", "XL"],
  },
]

// Utility: mark product as new if created within `days` days
const isRecentlyCreated = (createdAt?: string, days = 30) => {
  if (!createdAt) return false
  const created = new Date(createdAt).getTime()
  if (Number.isNaN(created)) return false
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000
  return created >= cutoff
}

// Transform server product -> GridProduct
const transformToGridProduct = (p: Product): GridProduct => {
  const id = p._id || Math.random().toString(36).slice(2, 9)
  const price = Math.round(p.price ?? 0)
  // If incoming data doesn't provide an original price, estimate one (20% higher)
  const originalPrice = Math.max(price, Math.round(price * 1.2))
  const image = (p.images && p.images.length && p.images[0]) || "/placeholder.svg"
  const href = p.slug ? `/product/${p.slug.replace(/^\//, "")}` : `/product/${id}`

  // Flatten unique colors and sizes from variants safely
  const colors = Array.from(new Set((p.variants || []).flatMap((v) => (v.color ? [v.color] : []))))
  const sizes = Array.from(
    new Set(
      (p.variants || []).flatMap((v) => (v.sizes || []).map((s) => s.size).filter(Boolean as any))
    )
  )

  // rating and review count fallbacks
  const rating = p.ratings?.average ?? 4
  const reviews = p.ratings?.count ?? Math.floor(Math.random() * 100) + 5

  // discount derived from difference between originalPrice and price
  const discount = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0

  return {
    id,
    name: p.name,
    price,
    originalPrice,
    image,
    href,
    isNew: isRecentlyCreated(p.createdAt, 30),
    discount,
    rating,
    reviews,
    colors,
    sizes,
  }
}

// --- Component ---
export function ProductGrid({ products }: { products: Product[] | undefined }) {
  // Wishlist uses string ids (product._id). Keeps consistent regardless of numeric/string ids.
  const [wishlist, setWishlist] = useState<string[]>([])

  // Pagination / Load more
  const PAGE_SIZE = 12
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  const incomingGridProducts = useMemo(() => {
    if (!products || products.length === 0) return []
    return products.map(transformToGridProduct)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products])

  // Combine sample products + incoming without mutating SAMPLE_PRODUCTS
  const combinedProducts = useMemo(() => {
    // If there are incoming products use them as primary; otherwise show sample
    if (incomingGridProducts.length > 0) return [...incomingGridProducts]
    return [...SAMPLE_PRODUCTS]
  }, [incomingGridProducts])

  // Paginated slice used for rendering
  const paginated = useMemo(() => combinedProducts.slice(0, visibleCount), [combinedProducts, visibleCount])

  // Toggle wishlist (string-aware)
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]))
  }

  const loadMore = () => setVisibleCount((v) => v + PAGE_SIZE)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {paginated.map((product) => (
          <Card
            key={product.id}
            className="group overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300 font-mono"
          >
            <CardContent className="p-0">
              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  {product.isNew && <Badge className="bg-accent text-accent-foreground">New</Badge>}
                  {product.discount > 0 && (
                    <Badge className="bg-secondary text-secondary-foreground">{product.discount}% OFF</Badge>
                  )}
                </div>

                <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button size="icon" variant="secondary" className="h-8 w-8" onClick={() => toggleWishlist(product.id)}>
                    {/* fixed class names for icon sizing */}
                    <Heart className={`h-4 w-4 ${wishlist.includes(product.id) ? "fill-current text-red-500" : ""}`} />
                  </Button>

                  <Button size="icon" variant="secondary" className="h-8 w-8">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="secondary" className="h-8 w-8">
                    <ShoppingBag className="h-4 w-4" />
                  </Button>
                </div>

                <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button size="sm" className="w-full bg-secondary hover:bg-secondary/90">
                    Quick Add
                  </Button>
                </div>
              </div>

              <div className="p-4 space-y-3">
                <Link href={product.href}>
                  <h3 className="font-medium text-foreground hover:text-secondary transition-colors text-balance line-clamp-2">
                    {product.name}
                  </h3>
                </Link>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-accent text-accent" />
                    <span className="text-xs text-muted-foreground">{product.rating}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">({product.reviews} reviews)</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold text-foreground">₹{product.price}</span>
                  {product.originalPrice > product.price && (
                    <span className="text-sm text-muted-foreground line-through">₹{product.originalPrice}</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Colors:</span>
                  <div className="flex gap-1">
                    {product.colors.map((color, index) => (
                      <div key={index} className="w-4 h-4 rounded-full border border-border" style={{ backgroundColor: color }} />
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Sizes:</span>
                  <div className="flex gap-1">
                    {product.sizes.map((size) => (
                      <span key={size} className="text-xs px-1 py-0.5 bg-muted rounded">
                        {size}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button size="sm" className="w-full bg-secondary hover:bg-secondary/90">
                    Buy Now
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      {combinedProducts.length > paginated.length && (
        <div className="text-center pt-8">
          <Button variant="outline" size="lg" onClick={loadMore}>
            Load More Products
          </Button>
        </div>
      )}
    </div>
  )
}

export default ProductGrid
