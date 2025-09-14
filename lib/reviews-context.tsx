"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

export interface Review {
  id: string
  productId: string
  userId: string
  userName: string
  userAvatar?: string
  rating: number
  title: string
  comment: string
  date: string
  verified: boolean
  helpful: number
  images?: string[]
  size?: string
  color?: string
}

interface ReviewsState {
  reviews: Review[]
  isLoading: boolean
}

const mockReviews: Review[] = [
  {
    id: "review_1",
    productId: "1",
    userId: "user_1",
    userName: "Priya Sharma",
    userAvatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    title: "Excellent Quality!",
    comment:
      "Beautiful kurti! The fabric quality is excellent and the embroidery work is very detailed. Fits perfectly and looks exactly like the pictures.",
    date: "2024-01-15",
    verified: true,
    helpful: 12,
    size: "M",
    color: "Blue",
  },
  {
    id: "review_2",
    productId: "1",
    userId: "user_2",
    userName: "Anita Patel",
    rating: 4,
    title: "Good quality, slightly long",
    comment:
      "Good quality kurti. The color is vibrant and the material is comfortable. Only issue is it's slightly longer than expected.",
    date: "2024-01-10",
    verified: true,
    helpful: 8,
    size: "L",
    color: "Blue",
  },
  {
    id: "review_3",
    productId: "1",
    userId: "user_3",
    userName: "Meera Reddy",
    rating: 5,
    title: "Perfect for office wear",
    comment:
      "Absolutely love this kurti! Perfect for office wear and the embroidery adds a nice touch. Will definitely order more.",
    date: "2024-01-05",
    verified: true,
    helpful: 15,
    size: "S",
    color: "Black",
  },
  {
    id: "review_4",
    productId: "2",
    userId: "user_4",
    userName: "Kavya Singh",
    rating: 4,
    title: "Beautiful design",
    comment: "Love the floral print and the fit is great. Fast delivery too!",
    date: "2024-01-12",
    verified: true,
    helpful: 6,
    size: "M",
    color: "Pink",
  },
]

const ReviewsContext = createContext<{
  state: ReviewsState
  addReview: (review: Omit<Review, "id" | "date" | "helpful">) => void
  getProductReviews: (productId: string) => Review[]
  markHelpful: (reviewId: string) => void
  getAverageRating: (productId: string) => number
  getRatingDistribution: (productId: string) => { [key: number]: number }
} | null>(null)

export function ReviewsProvider({ children }: { children: React.ReactNode }) {
  const [reviews, setReviews] = useState<Review[]>(mockReviews)
  const [isLoading, setIsLoading] = useState(false)

  const state: ReviewsState = {
    reviews,
    isLoading,
  }

  const addReview = (reviewData: Omit<Review, "id" | "date" | "helpful">) => {
    const newReview: Review = {
      ...reviewData,
      id: `review_${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      helpful: 0,
    }
    setReviews((prevReviews) => [...prevReviews, newReview])
  }

  const getProductReviews = (productId: string): Review[] => {
    return reviews.filter((review) => review.productId === productId)
  }

  const markHelpful = (reviewId: string) => {
    setReviews((prevReviews) =>
      prevReviews.map((review) => (review.id === reviewId ? { ...review, helpful: review.helpful + 1 } : review)),
    )
  }

  const getAverageRating = (productId: string): number => {
    const productReviews = getProductReviews(productId)
    if (productReviews.length === 0) return 0

    const totalRating = productReviews.reduce((sum, review) => sum + review.rating, 0)
    return Math.round((totalRating / productReviews.length) * 10) / 10
  }

  const getRatingDistribution = (productId: string): { [key: number]: number } => {
    const productReviews = getProductReviews(productId)
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }

    productReviews.forEach((review) => {
      distribution[review.rating as keyof typeof distribution]++
    })

    return distribution
  }

  return (
    <ReviewsContext.Provider
      value={{
        state,
        addReview,
        getProductReviews,
        markHelpful,
        getAverageRating,
        getRatingDistribution,
      }}
    >
      {children}
    </ReviewsContext.Provider>
  )
}

export function useReviews() {
  const context = useContext(ReviewsContext)
  if (!context) {
    throw new Error("useReviews must be used within a ReviewsProvider")
  }
  return context
}
