"use client"

import { use } from "react"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Package, MapPin, CreditCard, Truck, Download, Phone, Mail } from "lucide-react"

interface OrderDetails {
  id: string
  date: string
  status: "confirmed" | "processing" | "shipped" | "delivered" | "cancelled"
  items: Array<{
    id: number
    name: string
    image: string
    size: string
    color: string
    quantity: number
    price: number
  }>
  pricing: {
    subtotal: number
    shipping: number
    tax: number
    total: number
  }
  shipping: {
    method: string
    address: string
    estimatedDelivery: string
  }
  payment: {
    method: string
    transactionId: string
  }
  trackingNumber?: string
}

export default function OrderDetailsPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = use(params)

  // Mock order details - in real app, this would be fetched from API
  const orderDetails: OrderDetails = {
    id: orderId,
    date: "2024-01-15",
    status: "shipped",
    items: [
      {
        id: 1,
        name: "Floral Printed Cotton Kurti",
        image: "/placeholder.svg?height=120&width=96",
        size: "M",
        color: "Blue",
        quantity: 1,
        price: 1299,
      },
      {
        id: 2,
        name: "Embroidered Silk Saree",
        image: "/placeholder.svg?height=120&width=96",
        size: "Free Size",
        color: "Red",
        quantity: 2,
        price: 3499,
      },
    ],
    pricing: {
      subtotal: 8297,
      shipping: 0,
      tax: 1493,
      total: 9790,
    },
    shipping: {
      method: "Standard Delivery",
      address: "123 Main Street, Apartment 4B, Mumbai, Maharashtra 400001",
      estimatedDelivery: "2024-01-20",
    },
    payment: {
      method: "Credit Card",
      transactionId: "TXN789012345",
    },
    trackingNumber: "TRK789012345",
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "processing":
        return "bg-yellow-100 text-yellow-800"
      case "shipped":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
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
          <Link href="/orders" className="hover:text-foreground">
            My Orders
          </Link>
          <span>/</span>
          <span className="text-foreground">Order {orderId}</span>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Order Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">Order Details</h1>
              <p className="text-muted-foreground">Order {orderDetails.id}</p>
            </div>
            <Badge className={getStatusColor(orderDetails.status)}>
              {orderDetails.status.replace("-", " ").toUpperCase()}
            </Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Order Items
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orderDetails.items.map((item) => (
                      <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-4">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-24 h-30 object-cover rounded-md"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-lg">{item.name}</h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            Size: {item.size} | Color: {item.color}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Qty: {item.quantity}</span>
                            <span className="font-medium">₹{item.price * item.quantity}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Shipping Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Delivery Method</p>
                    <p className="font-medium">{orderDetails.shipping.method}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Shipping Address</p>
                    <p className="font-medium">{orderDetails.shipping.address}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Estimated Delivery</p>
                    <p className="font-medium">
                      {new Date(orderDetails.shipping.estimatedDelivery).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                  {orderDetails.trackingNumber && (
                    <div>
                      <p className="text-sm text-muted-foreground">Tracking Number</p>
                      <p className="font-medium">{orderDetails.trackingNumber}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Payment Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Payment Method</p>
                    <p className="font-medium">{orderDetails.payment.method}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Transaction ID</p>
                    <p className="font-medium">{orderDetails.payment.transactionId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Order Date</p>
                    <p className="font-medium">{new Date(orderDetails.date).toLocaleDateString("en-IN")}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{orderDetails.pricing.subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{orderDetails.pricing.shipping === 0 ? "Free" : `₹${orderDetails.pricing.shipping}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (GST)</span>
                    <span>₹{orderDetails.pricing.tax}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>₹{orderDetails.pricing.total}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="space-y-3">
                <Button className="w-full" asChild>
                  <Link href={`/track-order?orderId=${orderDetails.id}`}>
                    <Truck className="h-4 w-4 mr-2" />
                    Track Order
                  </Link>
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  <Download className="h-4 w-4 mr-2" />
                  Download Invoice
                </Button>
                {orderDetails.status === "delivered" && (
                  <Button variant="outline" className="w-full bg-transparent" asChild>
                    <Link href={`/returns?orderId=${orderDetails.id}`}>Return/Exchange</Link>
                  </Button>
                )}
              </div>

              {/* Support */}
              <Card>
                <CardHeader>
                  <CardTitle>Need Help?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4" />
                    <span>+91 1800-123-4567</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4" />
                    <span>support@yourstore.com</span>
                  </div>
                  <Button variant="outline" size="sm" className="w-full bg-transparent" asChild>
                    <Link href="/contact">Contact Support</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mt-8">
            <Button variant="outline" asChild>
              <Link href="/orders">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Orders
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
