import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { mockCategories } from "@/lib/mock-data"

export function CategoryShowcase() {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">Shop by Category</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-pretty">
            Discover our carefully curated collections designed for every occasion and style preference
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockCategories.slice(0, 4).map((category) => (
            <Link key={category.id} href={`/shop?category=${category.slug}`} className="group">
              <Card className="overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                <CardContent className="p-0">
                  <div className="aspect-[4/5] relative overflow-hidden">
                    <img
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="font-semibold text-lg mb-1 text-balance">{category.name}</h3>
                      <p className="text-sm opacity-90 text-pretty">{category.description}</p>
                      <p className="text-xs opacity-75 mt-1">{category.productCount} products</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
