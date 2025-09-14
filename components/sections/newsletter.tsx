"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { X } from "lucide-react"

export function Newsletter() {
  const { toast } = useToast()
  const [isVisible, setIsVisible] = useState(true)
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800))

      toast({
        title: "Successfully subscribed!",
        description: "Thank you for subscribing to our newsletter. You'll receive exclusive updates and offers.",
      })

      console.log("Newsletter signup:", email)
      setEmail("")
      setIsVisible(false)
    } catch (error) {
      toast({
        title: "Subscription failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
      console.error("Newsletter signup error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isVisible) return null

  return (
    <section className="py-16 bg-primary/5">
      <div className="container mx-auto px-4">
        <Card className="max-w-2xl mx-auto border-0 shadow-xl">
          <CardContent className="p-8 text-center relative">
            <Button variant="ghost" size="icon" className="absolute top-4 right-4" onClick={() => setIsVisible(false)}>
              <X className="h-4 w-4" />
            </Button>

            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2 text-balance">Stay in Style</h3>
              <p className="text-muted-foreground text-pretty">
                Get exclusive access to new collections, styling tips, and special offers delivered to your inbox.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1"
                disabled={isLoading}
              />
              <Button type="submit" className="sm:w-auto" disabled={isLoading}>
                {isLoading ? "Subscribing..." : "Subscribe"}
              </Button>
            </form>

            <p className="text-xs text-muted-foreground mt-4">
              By subscribing, you agree to our Privacy Policy. Unsubscribe at any time.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
