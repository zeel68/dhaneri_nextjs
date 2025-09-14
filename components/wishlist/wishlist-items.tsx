"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, ShoppingBag, X, Eye } from "lucide-react"
import { useWishlist } from "@/lib/wishlist-context"
import { useCart } from "@/lib/cart-context"
import { useToast } from "@/hooks/use-toast"

export function WishlistItems() {
  const { state: wishlistState, removeFromWishlist, clearWishlist } = useWishlist()
  const { addToCart } = useCart()
  const { toast } = useToast()

  const handleRemoveFromWishlist = (id: string, name: string) => {
    removeFromWishlist(id)
    toast({
      title: "Removed from Wishlist",
      description: `${name} has been removed from your wishlist.`,
    })
  }

  const handleAddToCart = (item: any) => {
    // Convert wishlist item to cart item format
    addToCart({
      id: `${item.id}-default-M`, // Add default variant
      name: item.name,
      price: item.price,
      originalPrice: item.originalPrice,
      image: item.image,
      color: "Default",
      size: "M",
      inStock: item.inStock,
    })

    toast({
      title: "Added to Cart",
      description: `${item.name} has been added to your cart.`,
    })
  }

  const moveAllToCart = () => {
    const inStockItems = wishlistState.items.filter((item) => item.inStock)

    inStockItems.forEach((item) => {
      addToCart({
        id: `${item.id}-default-M`,
        name: item.name,
        price: item.price,
        originalPrice: item.originalPrice,
        image: item.image,
        color: "Default",
        size: "M",
        inStock: item.inStock,
      })
    })

    if (inStockItems.length > 0) {
      toast({
        title: "Items Added to Cart",
        description: `${inStockItems.length} items have been added to your cart.`,
      })
    } else {
      toast({
        title: "No Items Available",
        description: "All items in your wishlist are currently out of stock.",
        variant: "destructive",
      })
    }
  }

  const shareWishlist = () => {
    if (navigator.share) {
      navigator.share({
        title: "My Dhaneri Wishlist",
        text: "Check out my favorite items from Dhaneri!",
        url: window.location.href,
      })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link Copied",
        description: "Wishlist link has been copied to clipboard.",
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Actions Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={moveAllToCart}>
            <ShoppingBag className="h-4 w-4 mr-2" />
            Move All to Cart
          </Button>
          <Button variant="outline" onClick={shareWishlist}>
            <Heart className="h-4 w-4 mr-2" />
            Share Wishlist
          </Button>
        </div>
        <Button variant="ghost" onClick={clearWishlist} className="text-destructive hover:text-destructive">
          Clear All
        </Button>
      </div>

      {/* Wishlist Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlistState.items.map((item) => (
          <Card
            key={item.id}
            className={`group overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300 ${
              !item.inStock ? "opacity-75" : ""
            }`}
          >
            <CardContent className="p-0">
              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  src={item.image || "/placeholder.svg?height=400&width=300"}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  {!item.inStock && <Badge variant="destructive">Out of Stock</Badge>}
                  {item.originalPrice > item.price && (
                    <Badge className="bg-red-600 text-white font-semibold">
                      {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF
                    </Badge>
                  )}
                </div>

                {/* Remove Button */}
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute top-3 right-3 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  onClick={() => handleRemoveFromWishlist(item.id, item.name)}
                >
                  <X className="h-4 w-4" />
                </Button>

                {/* Quick Actions */}
                <div className="absolute bottom-3 left-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button size="sm" className="flex-1 bg-secondary hover:bg-secondary/90" asChild>
                    <Link href={`/product/${item.id}`}>
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 bg-background/90"
                    onClick={() => handleAddToCart(item)}
                    disabled={!item.inStock}
                  >
                    <ShoppingBag className="h-4 w-4 mr-1" />
                    {item.inStock ? "Add to Cart" : "Notify Me"}
                  </Button>
                </div>
              </div>

              <div className="p-4 space-y-3">
                <Link href={`/product/${item.id}`}>
                  <h3 className="font-medium text-foreground hover:text-secondary transition-colors text-balance line-clamp-2">
                    {item.name}
                  </h3>
                </Link>

                {/* Price */}
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold text-foreground">₹{item.price.toLocaleString()}</span>
                  {item.originalPrice > item.price && (
                    <span className="text-sm text-muted-foreground line-through">
                      ₹{item.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Stock Status */}
                <p className={`text-sm ${item.inStock ? "text-green-600" : "text-red-600"}`}>
                  {item.inStock ? "In Stock" : "Out of Stock"}
                </p>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    className="flex-1 bg-secondary hover:bg-secondary/90"
                    onClick={() => handleAddToCart(item)}
                    disabled={!item.inStock}
                  >
                    <ShoppingBag className="h-4 w-4 mr-1" />
                    {item.inStock ? "Add to Cart" : "Notify Me"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRemoveFromWishlist(item.id, item.name)}
                    className="bg-transparent"
                  >
                    <Heart className="h-4 w-4 fill-current text-red-500" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
