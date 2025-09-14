"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, Heart, Plus, Minus } from "lucide-react"
import Link from "next/link"
import { useCart } from "@/lib/cart-context"
import { useWishlist } from "@/lib/wishlist-context"
import { useToast } from "@/hooks/use-toast"
import { useCartStore } from "@/stores/cartStore"

interface CartItemsProp {
  items: any
}
export function CartItems() {
  const originalPrice = 1999;
  const { items, fetchCart, updateCartItem, removeFromCart, clearCart } = useCartStore();
  // const { state: cartState, updateQuantity, removeFromCart } = useCart()
  const { addToWishlist } = useWishlist()
  const { toast } = useToast()

  const moveToWishlist = (item: any) => {
    addToWishlist({
      id: item.id.split("-")[0], // Remove variant suffix for wishlist
      name: item.name,
      price: item.price,
      originalPrice: item.originalPrice,
      image: item.image,
      inStock: item.inStock,
    })

    removeFromCart(item.id)

    toast({
      title: "Moved to Wishlist",
      description: `${item.name} has been moved to your wishlist.`,
    })
  }

  const handleQuantityChange = async (itemId: string, newQuantity: number, variant_id: string, size_id: string) => {
    if (newQuantity < 1) return
    await updateCartItem(itemId, newQuantity, variant_id, size_id)
  }

  const handleRemoveItem = async (itemId: string, variant_id: string) => {
    await removeFromCart(itemId, variant_id)
  }

  const handleClearCart = async () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      await clearCart()
    }
  }

  return (
    <div className="space-y-4">
      {items.map((item: any) => (
        <Card key={item.id} className={`${!item.inStock ? "opacity-75" : ""}`}>
          <CardContent className="p-6">
            <div className="flex gap-4">
              {/* Product Image */}
              <div className="flex-shrink-0">
                <img
                  src={item.product_id.images[0] || "/placeholder.svg?height=128&width=96"}
                  alt={item.product_id.name}
                  className="w-24 h-32 object-cover rounded-md"
                />
              </div>

              {/* Product Details */}
              <div className="flex-1 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-foreground text-balance">
                      <Link
                        href={`/product/${item.product_id.name.replace(" ", "-")}`}
                        className="hover:text-secondary transition-colors"
                      >
                        {item.product_id.name}
                      </Link>
                    </h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <span>Color: {item.variant_id.color}</span>
                      <span>Size: {item.size_id.size}</span>
                    </div>
                  </div>
                  {/* {!item.inStock && <Badge variant="destructive">Out of Stock</Badge>} */}
                </div>

                {/* Price */}
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold text-foreground">₹{item.product_id.price.toLocaleString()}</span>
                  {originalPrice > item.product_id.price && (
                    <span className="text-sm text-muted-foreground line-through">
                      ₹{originalPrice.toLocaleString()}
                    </span>
                  )}
                  <span className="text-sm text-secondary">
                    Save ₹{((originalPrice - item.product_id.price) * item.quantity).toLocaleString()}
                  </span>
                </div>

                {/* Quantity and Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">Qty:</span>
                    <div className="flex items-center border rounded-md">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleQuantityChange(item.product_id._id, item.quantity - 1, item.variant_id._id, item.size_id?._id)}
                      // disabled={item.quantity <= 1 || !item.inStock}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="px-3 py-1 text-sm font-medium">{item.quantity}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleQuantityChange(item.product_id._id, item.quantity + 1, item.variant_id._id, item.size_id?._id)}
                      // disabled={!item.inStock}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveToWishlist(item)}
                      className="text-muted-foreground hover:text-secondary"
                    >
                      <Heart className="h-4 w-4 mr-1" />
                      Save for Later
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveItem(item.product_id._id, item.variant_id._id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Remove
                    </Button>
                  </div>
                </div>

                {/* Subtotal */}
                {/* <div className="text-right">
                  <span className="text-lg font-semibold text-foreground">
                    Subtotal: ₹{(item.price * item.quantity).toLocaleString()}
                  </span>
                </div> */}
              </div>
            </div>
          </CardContent>
        </Card>
      ))
      }
    </div >
  )
}
