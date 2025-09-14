"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Heart, ShoppingBag, Star } from "lucide-react"

interface ProductCardProps {
  id: number
  name: string
  price: number
  originalPrice?: number
  image: string
  rating: number
  reviews: number
  isNew?: boolean
  isSale?: boolean
  href: string
}

export function ProductCard({
  id,
  name,
  price,
  originalPrice,
  image,
  rating,
  reviews,
  isNew,
  isSale,
  href,
}: ProductCardProps) {
  const { toast } = useToast()
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    setIsAddingToCart(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    toast({
      title: "Added to cart!",
      description: `${name} has been added to your cart.`,
    })

    setIsAddingToCart(false)
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    setIsWishlisted(!isWishlisted)

    if (!isWishlisted) {
      toast({
        title: "Added to wishlist!",
        description: `${name} has been saved to your wishlist.`,
      })
    } else {
      toast({
        title: "Removed from wishlist",
        description: `${name} has been removed from your wishlist.`,
      })
    }
  }

  const discountPercentage = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0

  return (
    <Link href={href} className="group block">
      <div className="product-card-hover bg-card rounded-lg overflow-hidden border">
        {/* Product Image */}
        <div className="relative aspect-[3/4] overflow-hidden">
          <img
            src={image || "/placeholder.svg"}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {isNew && <Badge className="bg-blue-600 text-white font-semibold">New</Badge>}
            {isSale && discountPercentage > 0 && (
              <Badge className="bg-red-600 text-white font-semibold">{discountPercentage}% OFF</Badge>
            )}
          </div>

          {/* Wishlist Button */}
          <Button
            variant="ghost"
            size="icon"
            className={`absolute top-3 right-3 bg-white/80 backdrop-blur-sm hover:bg-white ${
              isWishlisted ? "text-red-500" : "text-muted-foreground"
            }`}
            onClick={handleWishlist}
          >
            <Heart className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`} />
          </Button>

          {/* Quick Add to Cart */}
          <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={handleAddToCart}
              disabled={isAddingToCart}
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              {isAddingToCart ? "Adding..." : "Add to Cart"}
            </Button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="font-medium text-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors">{name}</h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-muted-foreground"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">({reviews})</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-primary">₹{price}</span>
            {originalPrice && <span className="text-sm text-muted-foreground line-through">₹{originalPrice}</span>}
          </div>
        </div>
      </div>
    </Link>
  )
}
