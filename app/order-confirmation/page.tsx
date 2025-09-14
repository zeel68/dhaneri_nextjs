"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Package, Truck, MapPin, Download } from "lucide-react"
import { useOrderStore } from "@/stores/orderStore"
import { useEffect } from "react"

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderid") || "ORD123456"
  const { fetchOrderDetails, orders, currentOrder: orderDetails } = useOrderStore();

  const fetchOrder = () => {
    fetchOrderDetails(orderId);
  }
  useEffect(() => {
    fetchOrder();
  }, [])

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
            <p className="text-muted-foreground">
              Thank you for your purchase. Your order has been successfully placed.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Order Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Order Number</p>
                      <p className="font-medium">{orderDetails?.order_number}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Order Date</p>
                      <p className="font-medium">{orderDetails?.created_at}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {orderDetails?.status}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Amount</p>
                      <p className="font-medium">₹{orderDetails?.total}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button asChild>
                      <Link href={`/track-order?orderId=${orderId}`}>
                        <Truck className="h-4 w-4 mr-2" />
                        Track Order
                      </Link>
                    </Button>
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Download Invoice
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orderDetails?.items.map((item) => (
                      <div key={`${item._id}-${item.size_id?.size}-${item.variant_id?.color}`} className="flex gap-4">
                        <img
                          src={item.product_id.images[0] || "/placeholder.svg"}
                          alt={item.product_id.name}
                          className="w-20 h-24 object-cover rounded-md"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium">{item.product_id.name}</h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            Size: {item.size_id?.size} | Color: {item.variant_id?.color} | Qty: {item.quantity}
                          </p>
                          <p className="font-medium">₹{item.product_id.price * item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Shipping Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* <div>
                      <p className="text-sm text-muted-foreground">Delivery Method</p>
                      <p className="font-medium">{orderDetails?.shipping_address?.method}</p>
                    </div> */}
                    <div>
                      <p className="text-sm text-muted-foreground">Shipping Address</p>
                      <p className="font-medium">{orderDetails?.shipping_address?.street + "," + orderDetails?.shipping_address?.city}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Estimated Delivery</p>
                      <p className="font-medium">{orderDetails?.shipping?.estimatedDelivery}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Next Steps */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>What's Next?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
                        1
                      </div>
                      <div>
                        <p className="font-medium text-sm">Order Confirmation</p>
                        <p className="text-xs text-muted-foreground">You'll receive an email confirmation shortly</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-muted text-muted-foreground rounded-full flex items-center justify-center text-xs font-medium">
                        2
                      </div>
                      <div>
                        <p className="font-medium text-sm">Processing</p>
                        <p className="text-xs text-muted-foreground">We'll prepare your order for shipment</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-muted text-muted-foreground rounded-full flex items-center justify-center text-xs font-medium">
                        3
                      </div>
                      <div>
                        <p className="font-medium text-sm">Shipped</p>
                        <p className="text-xs text-muted-foreground">You'll get tracking details via email & SMS</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-muted text-muted-foreground rounded-full flex items-center justify-center text-xs font-medium">
                        4
                      </div>
                      <div>
                        <p className="font-medium text-sm">Delivered</p>
                        <p className="text-xs text-muted-foreground">Enjoy your new ethnic wear!</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Button variant="outline" className="w-full bg-transparent" asChild>
                      <Link href="/shop">Continue Shopping</Link>
                    </Button>
                    <Button variant="outline" className="w-full bg-transparent" asChild>
                      <Link href="/profile">View All Orders</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

    </div>
  )
}
