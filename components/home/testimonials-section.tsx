import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    location: "Mumbai",
    rating: 5,
    comment:
      "Amazing quality kurtis! The fabric is so comfortable and the designs are beautiful. I've ordered multiple times and never been disappointed.",
    image: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 2,
    name: "Anita Patel",
    location: "Delhi",
    rating: 5,
    comment:
      "Love the variety and authentic designs. The embroidery work is exquisite and the fit is perfect. Highly recommend!",
    image: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 3,
    name: "Meera Reddy",
    location: "Bangalore",
    rating: 5,
    comment:
      "Fast delivery and excellent customer service. The kurtis are exactly as shown in pictures. Great shopping experience!",
    image: "/placeholder.svg?height=60&width=60",
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">What Our Customers Say</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-pretty">
            Join thousands of satisfied customers who love our collection
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 text-pretty leading-relaxed">"{testimonial.comment}"</p>
                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.location}</p>
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
