import Link from "next/link"
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Footer() {
  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-accent"></div>
              <span className="text-xl font-bold text-foreground">Dhaneri</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Discover the finest collection of Indian women's clothing. From traditional kurtis to contemporary
              designs, we bring you the best of Indian fashion.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Youtube className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Quick Links</h3>
            <div className="space-y-2">
              <Link href="/shop" className="block text-muted-foreground hover:text-secondary transition-colors text-sm">
                Shop All
              </Link>
              <Link
                href="/new-arrivals"
                className="block text-muted-foreground hover:text-secondary transition-colors text-sm"
              >
                New Arrivals
              </Link>
              <Link
                href="/collections"
                className="block text-muted-foreground hover:text-secondary transition-colors text-sm"
              >
                Collections
              </Link>
              <Link href="/sale" className="block text-muted-foreground hover:text-secondary transition-colors text-sm">
                Sale
              </Link>
              <Link
                href="/size-guide"
                className="block text-muted-foreground hover:text-secondary transition-colors text-sm"
              >
                Size Guide
              </Link>
            </div>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Customer Service</h3>
            <div className="space-y-2">
              <Link
                href="/contact"
                className="block text-muted-foreground hover:text-secondary transition-colors text-sm"
              >
                Contact Us
              </Link>
              <Link
                href="/shipping"
                className="block text-muted-foreground hover:text-secondary transition-colors text-sm"
              >
                Shipping Info
              </Link>
              <Link
                href="/returns"
                className="block text-muted-foreground hover:text-secondary transition-colors text-sm"
              >
                Returns & Exchanges
              </Link>
              <Link href="/faq" className="block text-muted-foreground hover:text-secondary transition-colors text-sm">
                FAQ
              </Link>
              <Link
                href="/track-order"
                className="block text-muted-foreground hover:text-secondary transition-colors text-sm"
              >
                Track Your Order
              </Link>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Stay Updated</h3>
            <p className="text-muted-foreground text-sm">
              Subscribe to get special offers, free giveaways, and exclusive deals.
            </p>
            <div className="space-y-2">
              <Input placeholder="Enter your email" className="bg-muted/50 border-0" />
              <Button className="w-full bg-secondary hover:bg-secondary/90">Subscribe</Button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-secondary transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-secondary transition-colors">
              Terms & Conditions
            </Link>
            <Link href="/cookies" className="hover:text-secondary transition-colors">
              Cookie Policy
            </Link>
          </div>
          <p className="text-sm text-muted-foreground">© 2024 Dhaneri. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
