import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, ShoppingBag } from "lucide-react"

const recommendedProducts = [
  {
    id: 5,
    name: "Block Print Palazzo Set",
    price: 1599,
    originalPrice: 1999,
    image: "/placeholder.svg?height=300&width=250",
    href: "/product/block-print-palazzo-set",
    discount: 20,
  },
  {
    id: 6,
    name: "Anarkali Style Kurti",
    price: 1899,
    originalPrice: 2399,
    image: "/placeholder.svg?height=300&width=250",
    href: "/product/anarkali-style-kurti",
    discount: 21,
  },
  {
    id: 7,
    name: "Cotton Straight Kurti",
    price: 799,
    originalPrice: 1099,
    image: "/placeholder.svg?height=300&width=250",
    href: "/product/cotton-straight-kurti",
    discount: 27,
  },
  {
    id: 8,
    name: "Printed Casual Kurti",
    price: 699,
    originalPrice: 999,
    image: "/placeholder.svg?height=300&width=250",
    href: "/product/printed-casual-kurti",
    discount: 30,
  },
]

export function RecommendedProducts() {
  return (
    <section className="mt-16">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2 text-balance">Complete Your Look</h2>
        <p className="text-muted-foreground">Customers who bought these items also purchased</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {recommendedProducts.map((product) => (
          <Card
            key={product.id}
            className="group overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300"
          >
            <CardContent className="p-0">
              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Discount Badge */}
                {product.discount > 0 && (
                  <Badge className="absolute top-3 left-3 bg-secondary text-secondary-foreground">
                    {product.discount}% OFF
                  </Badge>
                )}

                {/* Action buttons */}
                <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button size="icon" variant="secondary" className="h-8 w-8">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="secondary" className="h-8 w-8">
                    <ShoppingBag className="h-4 w-4" />
                  </Button>
                </div>

                {/* Quick add to cart */}
                <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button size="sm" className="w-full bg-secondary hover:bg-secondary/90">
                    Quick Add
                  </Button>
                </div>
              </div>

              <div className="p-4">
                <Link href={product.href}>
                  <h3 className="font-medium text-foreground mb-2 hover:text-secondary transition-colors text-balance line-clamp-2">
                    {product.name}
                  </h3>
                </Link>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold text-foreground">₹{product.price}</span>
                  {product.originalPrice > product.price && (
                    <span className="text-sm text-muted-foreground line-through">₹{product.originalPrice}</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
