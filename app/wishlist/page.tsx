"use client"

import { WishlistItems } from "@/components/wishlist/wishlist-items"
import { Card, CardContent } from "@/components/ui/card"
import { Heart } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useWishlist } from "@/lib/wishlist-context"

export default function WishlistPage() {
  const { state: wishlistState } = useWishlist()

  const isEmpty = wishlistState.items.length === 0

  if (isEmpty) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-md mx-auto text-center">
            <CardContent className="p-8">
              <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h1 className="text-xl font-bold mb-2">Your wishlist is empty</h1>
              <p className="text-muted-foreground mb-6">
                Save your favorite items to your wishlist and shop them later.
              </p>
              <Button asChild>
                <Link href="/shop">Start Shopping</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-secondary transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-foreground">Wishlist</span>
        </nav>

        {/* Page Title */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">My Wishlist</h1>
          <p className="text-muted-foreground">{wishlistState.itemCount} items</p>
        </div>

        <WishlistItems />
      </div>
    </div>
  )
}
