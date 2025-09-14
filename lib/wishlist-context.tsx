"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

export interface WishlistItem {
  id: string
  name: string
  price: number
  originalPrice: number
  image: string
  inStock: boolean
}

interface WishlistState {
  items: WishlistItem[]
  itemCount: number
}

const initialWishlistItems: WishlistItem[] = [
  {
    id: "4",
    name: "Embroidered Lehenga Choli",
    price: 4999,
    originalPrice: 7999,
    image: "/placeholder.svg?height=400&width=300",
    inStock: true,
  },
  {
    id: "5",
    name: "Cotton Palazzo Set",
    price: 899,
    originalPrice: 1299,
    image: "/placeholder.svg?height=400&width=300",
    inStock: true,
  },
  {
    id: "6",
    name: "Banarasi Silk Dupatta",
    price: 1599,
    originalPrice: 2299,
    image: "/placeholder.svg?height=400&width=300",
    inStock: false,
  },
  {
    id: "7",
    name: "Georgette Party Wear Saree",
    price: 2799,
    originalPrice: 3999,
    image: "/placeholder.svg?height=400&width=300",
    inStock: true,
  },
]

const WishlistContext = createContext<{
  state: WishlistState
  addToWishlist: (item: WishlistItem) => void
  removeFromWishlist: (id: string) => void
  isInWishlist: (id: string) => boolean
  clearWishlist: () => void
} | null>(null)

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>(initialWishlistItems)

  const state: WishlistState = {
    items,
    itemCount: items.length,
  }

  const addToWishlist = (item: WishlistItem) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((wishlistItem) => wishlistItem.id === item.id)
      if (existingItem) {
        return prevItems // Item already in wishlist
      }
      return [...prevItems, item]
    })
  }

  const removeFromWishlist = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id))
  }

  const isInWishlist = (id: string) => {
    return items.some((item) => item.id === id)
  }

  const clearWishlist = () => {
    setItems([])
  }

  return (
    <WishlistContext.Provider
      value={{
        state,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider")
  }
  return context
}
