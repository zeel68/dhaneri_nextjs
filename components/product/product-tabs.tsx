"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ReviewsList } from "./reviews-list"
import { AddReviewForm } from "./add-review-form"
import { useReviews } from "@/lib/reviews-context"
import { useAuth } from "@/lib/auth-context"
import { Star, Plus } from "lucide-react"

interface ProductTabsProps {
  product: any
}

export function ProductTabs({ product }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState("description")
  const [showAddReview, setShowAddReview] = useState(false)
  const { getProductReviews, getAverageRating, getRatingDistribution } = useReviews()
  const { state: authState } = useAuth()

  const reviews = getProductReviews(product?.id)
  const averageRating = getAverageRating(product?.id)
  const ratingDistribution = getRatingDistribution(product?.id)

  return (
    <div className="mt-12">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="specifications">Specifications</TabsTrigger>
          <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">product Description</h3>
                <p className="text-muted-foreground leading-relaxed text-pretty">{product?.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Care Instructions</h4>
                    <p className="text-sm text-muted-foreground">{product?.details?.care}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Origin</h4>
                    <p className="text-sm text-muted-foreground">{product.details?.origin}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="specifications" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Product Specifications</h3>
              <div className="space-y-3">
                {product?.specifications?.map((spec: any, index: any) => (
                  <div key={index} className="flex justify-between py-2 border-b border-border last:border-b-0">
                    <span className="text-muted-foreground">{spec.label}</span>
                    <span className="text-foreground font-medium">{spec.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="mt-6">
          <div className="space-y-6">
            {/* Reviews Summary */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-foreground">Customer Reviews</h3>
                  {authState.isAuthenticated && (
                    <Button onClick={() => setShowAddReview(!showAddReview)} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Write Review
                    </Button>
                  )}
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-foreground">{averageRating || "0.0"}</div>
                    <div className="flex items-center gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < Math.floor(averageRating) ? "fill-accent text-accent" : "text-muted-foreground"}`}
                        />
                      ))}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">Based on {reviews.length} reviews</div>
                  </div>
                  <div className="flex-1">
                    <div className="space-y-2">
                      {[5, 4, 3, 2, 1].map((rating) => {
                        const count = ratingDistribution[rating] || 0
                        const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0
                        return (
                          <div key={rating} className="flex items-center gap-2">
                            <span className="text-sm w-8">{rating}★</span>
                            <div className="flex-1 h-2 bg-muted rounded-full">
                              <div
                                className="h-full bg-accent rounded-full transition-all duration-300"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-sm text-muted-foreground w-12">
                              {count} ({Math.round(percentage)}%)
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Add Review Form */}
            {showAddReview && authState.isAuthenticated && (
              <AddReviewForm
                productId={product.id}
                onSuccess={() => setShowAddReview(false)}
                onCancel={() => setShowAddReview(false)}
              />
            )}

            {/* Reviews List */}
            <ReviewsList productId={product.id} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
