"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useToast } from "@/hooks/use-toast"
import { ShoppingBag, Plus, Minus, Truck } from "lucide-react"

// Define CartDrawerProps and CartItem types
type CartDrawerProps = {
  items: CartItem[]
}

type CartItem = {
  id: number
  name: string
  price: number
  originalPrice: number
  image: string
  size: string
  color: string
  quantity: number
}

export function CartDrawer({ items: propItems }: CartDrawerProps) {
  const { toast } = useToast()

  // Mock cart items
  const mockItems: CartItem[] = [
    {
      id: 1,
      name: "Floral Printed Cotton Kurti",
      price: 1299,
      originalPrice: 1899,
      image: "/placeholder.svg?height=100&width=80",
      size: "M",
      color: "Blue",
      quantity: 1,
    },
    {
      id: 2,
      name: "Embroidered Silk Saree",
      price: 3499,
      originalPrice: 4999,
      image: "/placeholder.svg?height=100&width=80",
      size: "Free Size",
      color: "Red",
      quantity: 2,
    },
  ]

  const [cartItems, setCartItems] = useState<CartItem[]>(propItems || mockItems)
  const [isOpen, setIsOpen] = useState(false)
  const [shipping, setShipping] = useState<number>(0)
  const [subtotal, setSubtotal] = useState<number>(0)

  // Calculate subtotal and shipping
  const calculateTotal = () => {
    const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
    setSubtotal(total)
    setShipping(total < 999 ? 999 - total : 0)
  }

  // Update state on cart items change
  useState(() => {
    calculateTotal()
  }, [cartItems])

  const updateQuantity = (id: number, newQuantity: number) => {
    const item = cartItems.find((item) => item.id === id)
    if (!item) return

    if (newQuantity === 0) {
      setCartItems((items) => items.filter((item) => item.id !== id))
      toast({
        title: "Item removed",
        description: `${item.name} has been removed from your cart.`,
      })
    } else {
      setCartItems((items) => items.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
      toast({
        title: "Quantity updated",
        description: `${item.name} quantity updated to ${newQuantity}.`,
      })
    }
    calculateTotal()
  }

  const removeItem = (id: number) => {
    const item = cartItems.find((item) => item.id === id)
    if (!item) return

    setCartItems((items) => items.filter((item) => item.id !== id))
    toast({
      title: "Item removed",
      description: `${item.name} has been removed from your cart.`,
    })
    calculateTotal()
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <ShoppingBag className="h-5 w-5" />
          <Badge className="ml-2" variant="secondary">
            {cartItems.length}
          </Badge>
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col gap-4">
        <SheetHeader>
          <SheetTitle>Your Cart</SheetTitle>
        </SheetHeader>
        <div className="space-y-4">
          {cartItems.length === 0 ? (
            <p>Your cart is empty</p>
          ) : (
            <>
              <div className="grid gap-4">
                <div className="grid-cols-2">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <img src={item.image || "/placeholder.svg"} alt={item.name} className="h-16 w-16 rounded" />
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Size: {item.size}, Color: {item.color}
                          </p>
                          <p className="text-sm font-medium">₹{item.price}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6 bg-transparent"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6 bg-transparent"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cart Summary */}
              <div className="border-t pt-4 space-y-4">
                {/* Shipping Info */}
                {shipping > 0 ? (
                  <div className="bg-muted/50 p-3 rounded-md">
                    <div className="flex items-center gap-2 text-sm">
                      <Truck className="h-4 w-4" />
                      <span>Add ₹{shipping} more for free shipping</span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-green-50 p-3 rounded-md">
                    <div className="flex items-center gap-2 text-sm text-green-700">
                      <Truck className="h-4 w-4" />
                      <span>Congratulations! You get free shipping</span>
                    </div>
                  </div>
                )}

                {/* Subtotal */}
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Subtotal</p>
                  <p className="text-sm font-medium">₹{subtotal}</p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Button className="w-full" size="lg" asChild>
                    <Link href="/checkout" onClick={() => setIsOpen(false)}>
                      Proceed to Checkout
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent" asChild onClick={() => setIsOpen(false)}>
                    <Link href="/cart">View Full Cart</Link>
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
