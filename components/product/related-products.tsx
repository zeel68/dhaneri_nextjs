import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, ShoppingBag } from "lucide-react"

const relatedProducts = [
  {
    id: 2,
    name: "Floral Print A-Line Kurti",
    price: 899,
    originalPrice: 1199,
    image: "/placeholder.svg?height=300&width=250",
    href: "/product/floral-print-kurti",
    discount: 25,
  },
  {
    id: 3,
    name: "Silk Blend Festive Kurti",
    price: 2199,
    originalPrice: 2799,
    image: "/placeholder.svg?height=300&width=250",
    href: "/product/silk-blend-kurti",
    discount: 21,
  },
  {
    id: 4,
    name: "Casual Straight Kurti",
    price: 699,
    originalPrice: 999,
    image: "/placeholder.svg?height=300&width=250",
    href: "/product/casual-straight-kurti",
    discount: 30,
  },
  {
    id: 5,
    name: "Block Print Palazzo Set",
    price: 1599,
    originalPrice: 1999,
    image: "/placeholder.svg?height=300&width=250",
    href: "/product/block-print-palazzo-set",
    discount: 20,
  },
]

interface RelatedProductsProps {
  currentProductId: number
}

export function RelatedProducts({ currentProductId }: RelatedProductsProps) {
  const filteredProducts = relatedProducts.filter((product) => product.id !== currentProductId)

  return (
    <section className="mt-16">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2 text-balance">You May Also Like</h2>
        <p className="text-muted-foreground">Discover more beautiful kurtis from our collection</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
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
