import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp } from "lucide-react"
import { getTrendingProducts } from "@/lib/mock-data"

export function TrendingSection() {
  const trendingProducts = getTrendingProducts().slice(0, 3)

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <TrendingUp className="h-6 w-6 text-secondary" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground text-balance">Trending Now</h2>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-pretty">
            Stay ahead of fashion with our most popular styles this season
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {trendingProducts.map((product) => (
            <Card
              key={product.id}
              className="group overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <CardContent className="p-0">
                <div className="aspect-[3/2] relative overflow-hidden">
                  <img
                    src={product.images[0] || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <h3 className="text-xl font-semibold mb-2 text-balance">{product.name}</h3>
                    <p className="text-sm opacity-90 mb-4 text-pretty">{product.description.slice(0, 80)}...</p>
                    <Button variant="secondary" size="sm" asChild>
                      <Link href={`/product/${product.slug}`}>Shop Now</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
