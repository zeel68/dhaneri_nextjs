"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, ShoppingBag, Eye, Star, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/components/ui/use-toast"
import { useCartStore } from "@/stores/cartStore"

// --- Types ---
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
  compare_price?: number
}

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

// --- Sample fallback products ---
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
  const originalPrice = p.compare_price ? Math.round(p.compare_price) : Math.max(price, Math.round(price * 1.2))
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
  const { toast } = useToast()
  // Wishlist uses string ids (product._id)
  const [wishlist, setWishlist] = useState<string[]>([])
  // Cart state (you can replace this with your own logic)
  const [cart, setCart] = useState<any[]>([])
  const { addToCart } = useCartStore();
  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null)
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [quantity, setQuantity] = useState(1)

  // Pagination / Load more
  const PAGE_SIZE = 12
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  const incomingGridProducts = useMemo(() => {
    if (!products || products.length === 0) return []
    return products.map(transformToGridProduct)
  }, [products])

  // Combine sample products + incoming without mutating SAMPLE_PRODUCTS
  const combinedProducts = useMemo(() => {
    // If there are incoming products use them as primary; otherwise show sample
    if (incomingGridProducts.length > 0) return [...incomingGridProducts]
    return [...SAMPLE_PRODUCTS]
  }, [incomingGridProducts])

  // Paginated slice used for rendering
  const paginated = useMemo(() => combinedProducts.slice(0, visibleCount), [combinedProducts, visibleCount])

  // Toggle wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]))

    toast({
      title: wishlist.includes(productId) ? "Removed from wishlist" : "Added to wishlist",
      description: wishlist.includes(productId)
        ? "Item has been removed from your wishlist."
        : "Item has been added to your wishlist.",
    })
  }

  // Open product dialog
  const openProductDialog = (productId: string) => {
    const originalProduct = products?.find(p => p._id === productId)
    if (originalProduct) {
      setSelectedProduct(originalProduct)
      setSelectedVariant(originalProduct.variants[0] || null)
      setSelectedSize("")
      setQuantity(1)
      setDialogOpen(true)
    }
  }

  // Add to cart function
  const handleAddToCart = () => {
    console.log("Hello");
    if (!selectedProduct || !selectedVariant || !selectedSize) {
      toast({
        title: "Selection incomplete",
        description: "Please select a color and size before adding to cart.",
        variant: "destructive"
      })
      return
    }

    // Find the selected size object
    const sizeObj = selectedVariant.sizes.find(s => s.size === selectedSize)

    if (!sizeObj) {
      toast({
        title: "Invalid selection",
        description: "The selected size is not available.",
        variant: "destructive"
      })
      return
    }

    // Calculate final price
    const finalPrice = selectedProduct.price + sizeObj.priceModifier

    // Add to cart (replace with your own cart logic)
    const cartItem = {
      productId: selectedProduct._id,
      name: selectedProduct.name,
      variant: selectedVariant.color,
      size: selectedSize,
      price: finalPrice,
      quantity,
      image: selectedVariant.images[0] || selectedProduct.images[0],
      sku: sizeObj.sku || `${selectedProduct._id}-${selectedVariant.color}-${selectedSize}`
    }
    console.log(selectedProduct._id);
    console.log(selectedVariant.color);
    console.log(selectedSize);
    console.log("Hello");


    setCart(prev => [...prev, cartItem])

    toast({
      title: "Added to cart",
      description: `${quantity} x ${selectedProduct.name} (${selectedVariant.color}, ${selectedSize}) has been added to your cart.`,
    })

    setDialogOpen(false)
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
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-8 w-8"
                    onClick={() => toggleWishlist(product.id)}
                  >
                    <Heart className={`h-4 w-4 ${wishlist.includes(product.id) ? "fill-current text-red-500" : ""}`} />
                  </Button>

                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-8 w-8"
                    onClick={() => openProductDialog(product.id)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-8 w-8"
                    onClick={() => openProductDialog(product.id)}
                  >
                    <ShoppingBag className="h-4 w-4" />
                  </Button>
                </div>

                <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button
                    size="sm"
                    className="w-full bg-secondary hover:bg-secondary/90"
                    onClick={() => openProductDialog(product.id)}
                  >
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
                      <div
                        key={index}
                        className="w-4 h-4 rounded-full border border-border"
                        style={{ backgroundColor: color }}
                      />
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
                  <Button
                    size="sm"
                    className="w-full bg-secondary hover:bg-secondary/90"
                    onClick={() => openProductDialog(product.id)}
                  >
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

      {/* Product Selection Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[625px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedProduct?.name}</DialogTitle>
            <DialogDescription>
              Select your preferred options before adding to cart
            </DialogDescription>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4"
              onClick={() => setDialogOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>

          {selectedProduct && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <img
                    src={selectedVariant?.images[0] || selectedProduct.images[0] || "/placeholder.svg"}
                    alt={selectedProduct.name}
                    className="w-full h-auto rounded-lg object-cover"
                  />
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold">₹{selectedProduct.price}</h3>
                    {selectedProduct.compare_price && selectedProduct.compare_price > selectedProduct.price && (
                      <p className="text-sm text-muted-foreground line-through">
                        ₹{selectedProduct.compare_price}
                      </p>
                    )}
                  </div>

                  {/* Color Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="color">Color</Label>
                    <RadioGroup
                      value={selectedVariant?.color || ""}
                      onValueChange={(value) => {
                        const variant = selectedProduct.variants.find(v => v.color === value)
                        if (variant) setSelectedVariant(variant)
                      }}
                      className="flex flex-wrap gap-2"
                    >
                      {selectedProduct.variants.map((variant) => (
                        <div key={variant.id} className="flex items-center space-x-2">
                          <RadioGroupItem
                            value={variant.color}
                            id={`color-${variant.id}`}
                            className="sr-only"
                          />
                          <Label
                            htmlFor={`color-${variant.id}`}
                            className={`border-2 rounded-md p-2 cursor-pointer flex items-center gap-2 ${selectedVariant?.color === variant.color ? "border-primary" : "border-muted"
                              }`}
                          >
                            <div
                              className="w-6 h-6 rounded-full"
                              style={{
                                backgroundColor: variant.color.toLowerCase()
                              }}
                            />
                            <span>{variant.color}</span>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  {/* Size Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="size">Size</Label>
                    <Select value={selectedSize} onValueChange={setSelectedSize}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a size" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedVariant?.sizes.map((sizeOption) => (
                          <SelectItem
                            key={sizeOption.id}
                            value={sizeOption.id}
                          // disabled={sizeOption.stock === 0}
                          >
                            {sizeOption.size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Quantity Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                      >
                        -
                      </Button>
                      <span className="w-10 text-center">{quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setQuantity(quantity + 1)}
                      // disabled={selectedVariant && quantity >= (selectedVariant.stock_quantity || 10)}
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleAddToCart}
                    disabled={!selectedSize}
                  >
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ProductGrid