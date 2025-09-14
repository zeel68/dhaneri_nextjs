
import { FeaturedProducts } from "@/components/home/featured-products"
import { CategoryShowcase } from "@/components/home/category-showcase"
import { TrendingSection } from "@/components/home/trending-section"
import { NewsletterPopup } from "@/components/home/newsletter-popup"
import { TestimonialsSection } from "@/components/home/testimonials-section"
import BannerCarousel from "@/components/home/hero-section"

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <BannerCarousel />
      <CategoryShowcase />
      <FeaturedProducts />
      <TrendingSection />
      <TestimonialsSection />
      <NewsletterPopup />
    </div>
  )
}
