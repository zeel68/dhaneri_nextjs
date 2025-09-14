import Link from "next/link"
import { ChevronRight } from "lucide-react"

interface ProductBreadcrumbProps {
  product: {
    name: string
  }
}

export function ProductBreadcrumb({ product }: ProductBreadcrumbProps) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
      <Link href="/" className="hover:text-secondary transition-colors">
        Home
      </Link>
      <ChevronRight className="h-4 w-4" />
      <Link href="/shop" className="hover:text-secondary transition-colors">
        Shop
      </Link>
      <ChevronRight className="h-4 w-4" />
      <Link href="/shop/kurtis" className="hover:text-secondary transition-colors">
        Kurtis
      </Link>
      <ChevronRight className="h-4 w-4" />
      <span className="text-foreground text-balance">{product.name}</span>
    </nav>
  )
}
