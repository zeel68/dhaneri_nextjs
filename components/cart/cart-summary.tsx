"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Truck, Shield, RotateCcw, Tag } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useCartStore } from "@/stores/cartStore"
import Link from "next/link"

export function CartSummary() {
  const { items, coupon, subtotal, shipping_fee, total, discount } = useCartStore();
  const [promoCode, setPromoCode] = useState("")
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null)



  // Calculate totals

  const originalTotal = items.reduce((sum, item) => sum + subtotal * item.quantity, 0)
  const savings = originalTotal - subtotal
  const shipping = 0
  const promoDiscount = appliedPromo ? Math.floor(subtotal * 0.1) : 0 // 10% discount


  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === "welcome10") {
      setAppliedPromo(promoCode)
      setPromoCode("")
    } else {
      alert("Invalid promo code")
    }
  }

  const removePromoCode = () => {
    setAppliedPromo(null)
  }

  return (
    <div className="space-y-6">
      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal ({items.length} items)</span>
            <span className="font-medium">₹{subtotal.toLocaleString()}</span>
          </div>

          {savings > 0 && (
            <div className="flex justify-between text-secondary">
              <span>You Save</span>
              <span>-₹{savings.toLocaleString()}</span>
            </div>
          )}

          <div className="flex justify-between">
            <span className="text-muted-foreground">Shipping</span>
            <span className="font-medium">
              {shipping === 0 ? <span className="text-secondary">FREE</span> : `₹${shipping}`}
            </span>
          </div>

          {appliedPromo && (
            <div className="flex justify-between text-secondary">
              <span>Promo Code ({appliedPromo})</span>
              <div className="flex items-center gap-2">
                <span>-₹{promoDiscount}</span>
                <Button variant="ghost" size="sm" onClick={removePromoCode} className="h-auto p-0 text-xs">
                  Remove
                </Button>
              </div>
            </div>
          )}

          <Separator />

          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span>₹{total.toLocaleString()}</span>
          </div>

          {shipping === 0 && (
            <div className="flex items-center gap-2 text-sm text-secondary">
              <Truck className="h-4 w-4" />
              <span>Free shipping applied!</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Promo Code */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Promo Code</CardTitle>
        </CardHeader>
        <CardContent>
          {!appliedPromo ? (
            <div className="flex gap-2">
              <Input placeholder="Enter promo code" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} />
              <Button variant="outline" onClick={applyPromoCode} disabled={!promoCode}>
                Apply
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Tag className="h-3 w-3" />
                {appliedPromo}
              </Badge>
              <Button variant="ghost" size="sm" onClick={removePromoCode}>
                Remove
              </Button>
            </div>
          )}
          <p className="text-xs text-muted-foreground mt-2">Try: WELCOME10 for 10% off</p>
        </CardContent>
      </Card>

      {/* Checkout Button */}
      <Link href="/checkout">
        <Button size="lg" className="w-full bg-secondary hover:bg-secondary/90">
          Proceed to Checkout
        </Button>
      </Link>

      {/* Features */}
      <div className="space-y-3 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Truck className="h-4 w-4 text-secondary" />
          <span>Free shipping on orders above ₹999</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <RotateCcw className="h-4 w-4 text-secondary" />
          <span>Easy 30-day returns</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Shield className="h-4 w-4 text-secondary" />
          <span>Secure payment guaranteed</span>
        </div>
      </div>
    </div>
  )
}
