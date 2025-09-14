"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

export interface CartItem {
  id: string
  name: string
  price: number
  originalPrice: number
  image: string
  color: string
  size: string
  quantity: number
  inStock: boolean
}

interface CartState {
  items: CartItem[]
  total: number
  itemCount: number
}

const initialCartItems: CartItem[] = [
  {
    id: "1-red-M",
    name: "Elegant Floral Print Kurti",
    price: 1299,
    originalPrice: 1899,
    image: "/placeholder.svg?height=400&width=300",
    color: "Red",
    size: "M",
    quantity: 1,
    inStock: true,
  },
  {
    id: "2-blue-L",
    name: "Traditional Silk Saree",
    price: 3499,
    originalPrice: 4999,
    image: "/placeholder.svg?height=400&width=300",
    color: "Blue",
    size: "L",
    quantity: 2,
    inStock: true,
  },
  {
    id: "3-green-S",
    name: "Designer Anarkali Dress",
    price: 2299,
    originalPrice: 2999,
    image: "/placeholder.svg?height=400&width=300",
    color: "Green",
    size: "S",
    quantity: 1,
    inStock: false,
  },
]

const CartContext = createContext<{
  state: CartState
  addToCart: (item: Omit<CartItem, "quantity">) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
} | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(initialCartItems)

  const state: CartState = {
    items,
    total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
  }

  const addToCart = (item: Omit<CartItem, "quantity">) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find(
        (cartItem) => cartItem.id === item.id && cartItem.color === item.color && cartItem.size === item.size,
      )

      if (existingItem) {
        return prevItems.map((cartItem) =>
          cartItem.id === existingItem.id &&
          cartItem.color === existingItem.color &&
          cartItem.size === existingItem.size
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem,
        )
      } else {
        return [...prevItems, { ...item, quantity: 1 }]
      }
    })
  }

  const removeFromCart = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }

    setItems((prevItems) => prevItems.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setItems([])
  }

  return (
    <CartContext.Provider
      value={{
        state,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
