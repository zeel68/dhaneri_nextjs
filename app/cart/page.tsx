"use client"
import { CartItems } from "@/components/cart/cart-items"
import { CartSummary } from "@/components/cart/cart-summary"
import { RecommendedProducts } from "@/components/cart/recommended-products"
import { useCartStore } from "@/stores/cartStore"
import { useEffect } from "react";

export default function CartPage() {
  const { items, fetchCart } = useCartStore();
  useEffect(() => {
    fetchCart();
  }, [])
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
          <a href="/" className="hover:text-secondary transition-colors">
            Home
          </a>
          <span>/</span>
          <span className="text-foreground">Shopping Cart</span>
        </nav>

        {/* Page Title */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Shopping Cart</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <CartItems />
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <CartSummary />
          </div>
        </div>

        {/* Recommended Products */}
        <RecommendedProducts />
      </div>
    </div>
  )
}
