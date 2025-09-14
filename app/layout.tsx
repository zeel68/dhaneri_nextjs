import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"

import { Suspense } from "react"
import { Toaster } from "@/components/ui/toaster"
import { CartProvider } from "@/lib/cart-context"
import { WishlistProvider } from "@/lib/wishlist-context"
import { AuthProvider } from "@/lib/auth-context"
import { ReviewsProvider } from "@/lib/reviews-context"
import { SearchProvider } from "@/lib/search-context"
import Navbar from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
})

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Dhaneri - Modern Indian Fashion for Women",
  description:
    "Discover exquisite kurtis and ethnic wear for the modern Indian woman. Shop premium quality traditional clothing with contemporary designs.",
  generator: "v0.app",
  keywords: "Indian fashion, kurtis, ethnic wear, women clothing, traditional wear, modern Indian style",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable} ${playfairDisplay.variable} antialiased`}>
        <AuthProvider>
          <ReviewsProvider>
            <CartProvider>
              <WishlistProvider>
                <SearchProvider>
                  <Navbar />
                  <main>
                    <Suspense fallback={null}>{children}</Suspense>
                  </main>
                  <Footer />
                  {/* <Toaster /> */}
                  {/* <Analytics /> */}
                </SearchProvider>
              </WishlistProvider>
            </CartProvider>
          </ReviewsProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
