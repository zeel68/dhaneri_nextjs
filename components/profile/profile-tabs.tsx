"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Package, Heart, MapPin, CreditCard, Bell, Shield, Eye, Truck } from "lucide-react"

// Mock data
const orders = [
  {
    id: "ORD-001",
    date: "2024-01-15",
    status: "Delivered",
    total: 1299,
    items: 2,
    image: "/placeholder.svg?height=60&width=60",
  },
  {
    id: "ORD-002",
    date: "2024-01-10",
    status: "Shipped",
    total: 2199,
    items: 1,
    image: "/placeholder.svg?height=60&width=60",
  },
  {
    id: "ORD-003",
    date: "2024-01-05",
    status: "Processing",
    total: 899,
    items: 3,
    image: "/placeholder.svg?height=60&width=60",
  },
]

const wishlistItems = [
  {
    id: 1,
    name: "Silk Blend Festive Kurti",
    price: 2199,
    originalPrice: 2799,
    image: "/placeholder.svg?height=100&width=100",
    inStock: true,
  },
  {
    id: 2,
    name: "Block Print Palazzo Set",
    price: 1599,
    originalPrice: 1999,
    image: "/placeholder.svg?height=100&width=100",
    inStock: false,
  },
]

const addresses = [
  {
    id: 1,
    type: "Home",
    name: "Priya Sharma",
    address: "123 MG Road, Bandra West, Mumbai, Maharashtra 400050",
    phone: "+91 98765 43210",
    isDefault: true,
  },
  {
    id: 2,
    type: "Office",
    name: "Priya Sharma",
    address: "456 Business Park, Andheri East, Mumbai, Maharashtra 400069",
    phone: "+91 98765 43210",
    isDefault: false,
  },
]

export function ProfileTabs() {
  const [activeTab, setActiveTab] = useState("orders")

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6">
        <TabsTrigger value="orders" className="flex items-center gap-2">
          <Package className="h-4 w-4" />
          <span className="hidden sm:inline">Orders</span>
        </TabsTrigger>
        <TabsTrigger value="wishlist" className="flex items-center gap-2">
          <Heart className="h-4 w-4" />
          <span className="hidden sm:inline">Wishlist</span>
        </TabsTrigger>
        <TabsTrigger value="addresses" className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          <span className="hidden sm:inline">Addresses</span>
        </TabsTrigger>
        <TabsTrigger value="payments" className="flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          <span className="hidden sm:inline">Payments</span>
        </TabsTrigger>
        <TabsTrigger value="notifications" className="flex items-center gap-2">
          <Bell className="h-4 w-4" />
          <span className="hidden sm:inline">Notifications</span>
        </TabsTrigger>
        <TabsTrigger value="security" className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          <span className="hidden sm:inline">Security</span>
        </TabsTrigger>
      </TabsList>

      {/* Orders Tab */}
      <TabsContent value="orders" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Order History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <img
                    src={order.image || "/placeholder.svg"}
                    alt="Order"
                    className="w-16 h-16 rounded-md object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-foreground">Order {order.id}</h3>
                      <Badge
                        variant={
                          order.status === "Delivered"
                            ? "default"
                            : order.status === "Shipped"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {order.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>Date: {order.date}</p>
                      <p>
                        Items: {order.items} • Total: ₹{order.total}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    {order.status === "Shipped" && (
                      <Button variant="outline" size="sm">
                        <Truck className="h-4 w-4 mr-1" />
                        Track
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Wishlist Tab */}
      <TabsContent value="wishlist" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>My Wishlist</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {wishlistItems.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="w-20 h-20 rounded-md object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground text-balance">{item.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-semibold text-foreground">₹{item.price}</span>
                      <span className="text-sm text-muted-foreground line-through">₹{item.originalPrice}</span>
                    </div>
                    <p className={`text-sm mt-1 ${item.inStock ? "text-green-600" : "text-red-600"}`}>
                      {item.inStock ? "In Stock" : "Out of Stock"}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button size="sm" disabled={!item.inStock}>
                      Add to Cart
                    </Button>
                    <Button variant="outline" size="sm">
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Addresses Tab */}
      <TabsContent value="addresses" className="mt-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Saved Addresses</CardTitle>
            <Button>Add New Address</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {addresses.map((address) => (
                <div key={address.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium text-foreground">{address.type}</h3>
                        {address.isDefault && <Badge variant="secondary">Default</Badge>}
                      </div>
                      <p className="text-sm text-foreground">{address.name}</p>
                      <p className="text-sm text-muted-foreground">{address.address}</p>
                      <p className="text-sm text-muted-foreground">{address.phone}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Other tabs would be implemented similarly */}
      <TabsContent value="payments" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Manage your saved payment methods and billing information.</p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="notifications" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Configure how you want to receive notifications.</p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="security" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Manage your password and security preferences.</p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
