"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, ChevronLeft, ChevronRight, Play, Pause } from "lucide-react"

const heroSlides = [
  {
    id: 1,
    title: "Embrace Your",
    highlight: "Heritage",
    subtitle: "with Modern Style",
    description:
      "Discover exquisite kurtis, sarees, and ethnic wear crafted for the contemporary Indian woman. Where tradition meets innovation.",
    image: "/placeholder.svg?height=600&width=450",
    badge: "New Arrivals",
    primaryCTA: "Shop New Collection",
    secondaryCTA: "Explore Kurtis",
    bgGradient: "from-primary via-secondary to-primary",
  },
  {
    id: 2,
    title: "Festive",
    highlight: "Elegance",
    subtitle: "for Every Celebration",
    description:
      "From Diwali to weddings, find the perfect ethnic wear that makes every moment special. Handcrafted designs with contemporary flair.",
    image: "/placeholder.svg?height=600&width=450",
    badge: "Festive Collection",
    primaryCTA: "Shop Festive Wear",
    secondaryCTA: "View Sarees",
    bgGradient: "from-accent via-primary to-secondary",
  },
  {
    id: 3,
    title: "Everyday",
    highlight: "Comfort",
    subtitle: "meets Style",
    description:
      "Comfortable cotton kurtis and casual ethnic wear perfect for daily wear. Look effortlessly elegant every day.",
    image: "/placeholder.svg?height=600&width=450",
    badge: "Comfort Wear",
    primaryCTA: "Shop Daily Wear",
    secondaryCTA: "Cotton Collection",
    bgGradient: "from-secondary via-accent to-primary",
  },
]

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const currentSlideData = heroSlides[currentSlide]

  return (
    <section className="relative overflow-hidden">
      <div className={`hero-gradient bg-gradient-to-br ${currentSlideData.bgGradient} transition-all duration-1000`}>
        <div className="hero-overlay">
          <div className="container mx-auto px-4 py-20 lg:py-32">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="text-center lg:text-left animate-fade-in-up">
                <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 text-balance">
                  {currentSlideData.title}
                  <span className="block text-accent font-serif"> {currentSlideData.highlight}</span>
                  {currentSlideData.subtitle}
                </h1>
                <p className="text-xl text-white/90 mb-8 text-pretty leading-relaxed">{currentSlideData.description}</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Button size="lg" className="btn-primary-hover bg-white text-secondary hover:bg-white/90 shadow-lg">
                    {currentSlideData.primaryCTA}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-secondary bg-transparent backdrop-blur-sm"
                  >
                    {currentSlideData.secondaryCTA}
                  </Button>
                </div>
              </div>

              <div className="relative">
                <div className="aspect-[3/4] rounded-2xl overflow-hidden relative">
                  {/* Slideshow Images */}
                  <div className="relative w-full h-full">
                    {heroSlides.map((slide, index) => (
                      <div
                        key={slide.id}
                        className={`absolute inset-0 transition-all duration-700 ${
                          index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-105"
                        }`}
                      >
                        <img
                          src={slide.image || "/placeholder.svg"}
                          alt={`${slide.title} ${slide.highlight} collection`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-all"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-all"
                    aria-label="Next slide"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>

                  <div className="absolute top-4 right-4 bg-accent text-accent-foreground px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                    {currentSlideData.badge}
                  </div>

                  <button
                    onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                    className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-all"
                    aria-label={isAutoPlaying ? "Pause slideshow" : "Play slideshow"}
                  >
                    {isAutoPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </button>
                </div>

                <div className="flex justify-center mt-6 gap-2">
                  {heroSlides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        index === currentSlide ? "bg-accent scale-125" : "bg-white/50 hover:bg-white/70"
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-background py-12 border-b pattern-bg">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="group">
              <div className="text-3xl font-bold text-primary mb-2 group-hover:text-accent transition-colors">10K+</div>
              <div className="text-sm text-muted-foreground font-medium">Happy Customers</div>
            </div>
            <div className="group">
              <div className="text-3xl font-bold text-primary mb-2 group-hover:text-accent transition-colors">500+</div>
              <div className="text-sm text-muted-foreground font-medium">Unique Designs</div>
            </div>
            <div className="group">
              <div className="text-3xl font-bold text-primary mb-2 group-hover:text-accent transition-colors">
                30 Days
              </div>
              <div className="text-sm text-muted-foreground font-medium">Easy Returns</div>
            </div>
            <div className="group">
              <div className="text-3xl font-bold text-primary mb-2 group-hover:text-accent transition-colors">Free</div>
              <div className="text-sm text-muted-foreground font-medium">Shipping ₹999+</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
