"use client"
import { CartItems } from "@/components/cart/cart-items"
import { CartSummary } from "@/components/cart/cart-summary"
import { RecommendedProducts } from "@/components/cart/recommended-products"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/stores/cartStore"
import Link from "next/link"

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
        {items.length > 0 ? (
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
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-16">
            <svg
              className="w-20 h-20 text-muted-foreground mb-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 6h13l-1.5-6M7 13H5.4M17 13l1.5 6m-13-6l1.5 6m12-6l-1.5 6M9 21a1 1 0 100-2 1 1 0 000 2zm6 0a1 1 0 100-2 1 1 0 000 2z"
              ></path>
            </svg>
            <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Looks like you haven't added anything to your cart yet.
            </p>
            {/* <Link href="/">
              <Button variant="default">
                Continue Shopping
              </Button>
            </Link> */}
            <Link href="/">
              <Button> Continue Shopping</Button>
            </Link>
          </div>
        )}


        {/* Recommended Products */}
        <RecommendedProducts />
      </div>
    </div >
  )
}
