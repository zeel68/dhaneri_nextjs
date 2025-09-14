"use client"

import type React from "react"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Search, Package, Truck, CheckCircle, MapPin, Phone, Mail, ArrowLeft } from "lucide-react"

interface TrackingEvent {
  id: string
  status: string
  description: string
  location: string
  timestamp: string
  isCompleted: boolean
}

interface OrderTracking {
  orderId: string
  status: "confirmed" | "processing" | "shipped" | "out-for-delivery" | "delivered" | "cancelled"
  orderDate: string
  estimatedDelivery: string
  currentLocation: string
  trackingNumber: string
  events: TrackingEvent[]
  items: Array<{
    id: number
    name: string
    image: string
    quantity: number
    price: number
  }>
  shippingAddress: string
  contact: {
    phone: string
    email: string
  }
}

export default function TrackOrderPage() {
  const searchParams = useSearchParams()
  const initialOrderId = searchParams.get("orderId") || ""
  const [orderId, setOrderId] = useState(initialOrderId)
  const [trackingData, setTrackingData] = useState<OrderTracking | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Mock tracking data
  const mockTrackingData: OrderTracking = {
    orderId: "ORD123456",
    status: "shipped",
    orderDate: "2024-01-15",
    estimatedDelivery: "2024-01-20",
    currentLocation: "Mumbai Distribution Center",
    trackingNumber: "TRK789012345",
    events: [
      {
        id: "1",
        status: "Order Confirmed",
        description: "Your order has been confirmed and is being prepared",
        location: "Mumbai Warehouse",
        timestamp: "2024-01-15T10:30:00Z",
        isCompleted: true,
      },
      {
        id: "2",
        status: "Processing",
        description: "Your order is being packed and prepared for shipment",
        location: "Mumbai Warehouse",
        timestamp: "2024-01-15T14:20:00Z",
        isCompleted: true,
      },
      {
        id: "3",
        status: "Shipped",
        description: "Your order has been shipped and is on its way",
        location: "Mumbai Distribution Center",
        timestamp: "2024-01-16T09:15:00Z",
        isCompleted: true,
      },
      {
        id: "4",
        status: "In Transit",
        description: "Your package is currently in transit",
        location: "Mumbai Distribution Center",
        timestamp: "2024-01-16T18:45:00Z",
        isCompleted: true,
      },
      {
        id: "5",
        status: "Out for Delivery",
        description: "Your package is out for delivery and will arrive today",
        location: "Local Delivery Hub",
        timestamp: "",
        isCompleted: false,
      },
      {
        id: "6",
        status: "Delivered",
        description: "Your package has been delivered successfully",
        location: "Your Address",
        timestamp: "",
        isCompleted: false,
      },
    ],
    items: [
      {
        id: 1,
        name: "Floral Printed Cotton Kurti",
        image: "/placeholder.svg?height=80&width=64",
        quantity: 1,
        price: 1299,
      },
      {
        id: 2,
        name: "Embroidered Silk Saree",
        image: "/placeholder.svg?height=80&width=64",
        quantity: 2,
        price: 3499,
      },
    ],
    shippingAddress: "123 Main Street, Apartment 4B, Mumbai, Maharashtra 400001",
    contact: {
      phone: "+91 98765 43210",
      email: "customer@example.com",
    },
  }

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!orderId.trim()) {
      toast({
        title: "Order ID required",
        description: "Please enter your order ID to track your order.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      if (orderId === "ORD123456") {
        setTrackingData(mockTrackingData)
        toast({
          title: "Order found!",
          description: "Your order tracking information has been loaded.",
        })
      } else {
        setTrackingData(null)
        toast({
          title: "Order not found",
          description: "Please check your order ID and try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch order details. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "processing":
        return "bg-yellow-100 text-yellow-800"
      case "shipped":
      case "in transit":
        return "bg-purple-100 text-purple-800"
      case "out-for-delivery":
        return "bg-orange-100 text-orange-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    return new Date(dateString).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <span>/</span>
          <span className="text-foreground">Track Order</span>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Track Order Form */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Track Your Order
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleTrackOrder} className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="orderId">Order ID</Label>
                  <Input
                    id="orderId"
                    placeholder="Enter your order ID (e.g., ORD123456)"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                  />
                </div>
                <div className="flex items-end">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Tracking..." : "Track Order"}
                  </Button>
                </div>
              </form>
              <p className="text-sm text-muted-foreground mt-2">
                You can find your order ID in the confirmation email or on your order confirmation page.
              </p>
            </CardContent>
          </Card>

          {/* Tracking Results */}
          {trackingData && (
            <div className="space-y-6">
              {/* Order Status Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Order {trackingData.orderId}
                    </span>
                    <Badge className={getStatusColor(trackingData.status)}>
                      {trackingData.status.replace("-", " ").toUpperCase()}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Order Date</p>
                      <p className="font-medium">{new Date(trackingData.orderDate).toLocaleDateString("en-IN")}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Estimated Delivery</p>
                      <p className="font-medium">
                        {new Date(trackingData.estimatedDelivery).toLocaleDateString("en-IN")}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Current Location</p>
                      <p className="font-medium">{trackingData.currentLocation}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Tracking Number</p>
                      <p className="font-medium">{trackingData.trackingNumber}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Tracking Timeline */}
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Truck className="h-5 w-5" />
                        Tracking Timeline
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {trackingData.events.map((event, index) => (
                          <div key={event.id} className="flex gap-4">
                            <div className="flex flex-col items-center">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                  event.isCompleted
                                    ? "bg-green-100 text-green-600"
                                    : index === trackingData.events.findIndex((e) => !e.isCompleted)
                                      ? "bg-blue-100 text-blue-600"
                                      : "bg-gray-100 text-gray-400"
                                }`}
                              >
                                {event.isCompleted ? (
                                  <CheckCircle className="h-4 w-4" />
                                ) : (
                                  <div className="w-2 h-2 rounded-full bg-current" />
                                )}
                              </div>
                              {index < trackingData.events.length - 1 && (
                                <div className={`w-0.5 h-12 ${event.isCompleted ? "bg-green-200" : "bg-gray-200"}`} />
                              )}
                            </div>
                            <div className="flex-1 pb-8">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="font-medium">{event.status}</h4>
                                {event.timestamp && (
                                  <span className="text-sm text-muted-foreground">{formatDate(event.timestamp)}</span>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mb-1">{event.description}</p>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <MapPin className="h-3 w-3" />
                                {event.location}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Order Details Sidebar */}
                <div className="space-y-6">
                  {/* Order Items */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Order Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {trackingData.items.map((item) => (
                          <div key={item.id} className="flex gap-3">
                            <img
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              className="w-12 h-15 object-cover rounded-md"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium text-sm">{item.name}</h4>
                              <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                              <p className="text-sm font-medium">₹{item.price * item.quantity}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Delivery Address */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Delivery Address
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{trackingData.shippingAddress}</p>
                    </CardContent>
                  </Card>

                  {/* Contact Info */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4" />
                        {trackingData.contact.phone}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4" />
                        {trackingData.contact.email}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Actions */}
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full bg-transparent" asChild>
                      <Link href="/profile">View All Orders</Link>
                    </Button>
                    <Button variant="outline" className="w-full bg-transparent" asChild>
                      <Link href="/contact">Contact Support</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Help Section */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <Phone className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <h4 className="font-medium mb-1">Call Us</h4>
                  <p className="text-sm text-muted-foreground">+91 1800-123-4567</p>
                  <p className="text-xs text-muted-foreground">Mon-Sat, 9 AM - 6 PM</p>
                </div>
                <div className="text-center">
                  <Mail className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <h4 className="font-medium mb-1">Email Us</h4>
                  <p className="text-sm text-muted-foreground">support@yourstore.com</p>
                  <p className="text-xs text-muted-foreground">We'll respond within 24 hours</p>
                </div>
                <div className="text-center">
                  <Package className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <h4 className="font-medium mb-1">Order Issues</h4>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/returns">Return/Exchange</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6">
            <Button variant="outline" asChild>
              <Link href="/shop">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Continue Shopping
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
