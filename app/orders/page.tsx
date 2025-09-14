// "use client"

// import { useState } from "react"
// import Link from "next/link"
// import { Header } from "@/components/layout/header"
// import { Footer } from "@/components/layout/footer"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Input } from "@/components/ui/input"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Separator } from "@/components/ui/separator"
// import { Search, Package, Truck, Eye, Download, Filter } from "lucide-react"
// import { mockOrders, type Order } from "@/lib/mock-data"

// export default function OrdersPage() {
//   const [searchTerm, setSearchTerm] = useState("")
//   const [statusFilter, setStatusFilter] = useState("all")
//   const [sortBy, setSortBy] = useState("newest")

//   const orders: Order[] = mockOrders

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "pending":
//         return "bg-blue-100 text-blue-800"
//       case "processing":
//         return "bg-yellow-100 text-yellow-800"
//       case "shipped":
//         return "bg-purple-100 text-purple-800"
//       case "delivered":
//         return "bg-green-100 text-green-800"
//       case "cancelled":
//         return "bg-red-100 text-red-800"
//       default:
//         return "bg-gray-100 text-gray-800"
//     }
//   }

//   const filteredOrders = orders
//     .filter((order) => {
//       const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase())
//       const matchesStatus = statusFilter === "all" || order.status === statusFilter
//       return matchesSearch && matchesStatus
//     })
//     .sort((a, b) => {
//       switch (sortBy) {
//         case "newest":
//           return new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
//         case "oldest":
//           return new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime()
//         case "amount-high":
//           return b.total - a.total
//         case "amount-low":
//           return a.total - b.total
//         default:
//           return 0
//       }
//     })

//   return (
//     <div className="min-h-screen">
//       <Header />
//       <main className="container mx-auto px-4 py-8">
//         {/* Breadcrumb */}
//         <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
//           <Link href="/" className="hover:text-foreground">
//             Home
//           </Link>
//           <span>/</span>
//           <Link href="/profile" className="hover:text-foreground">
//             Profile
//           </Link>
//           <span>/</span>
//           <span className="text-foreground">My Orders</span>
//         </div>

//         <div className="max-w-6xl mx-auto">
//           <div className="flex items-center justify-between mb-6">
//             <h1 className="text-3xl font-bold">My Orders</h1>
//             <div className="text-sm text-muted-foreground">
//               {filteredOrders.length} order{filteredOrders.length !== 1 ? "s" : ""}
//             </div>
//           </div>

//           {/* Filters */}
//           <Card className="mb-6">
//             <CardContent className="p-4">
//               <div className="flex flex-col md:flex-row gap-4">
//                 <div className="flex-1">
//                   <div className="relative">
//                     <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                     <Input
//                       placeholder="Search by order ID..."
//                       value={searchTerm}
//                       onChange={(e) => setSearchTerm(e.target.value)}
//                       className="pl-10"
//                     />
//                   </div>
//                 </div>
//                 <div className="flex gap-2">
//                   <Select value={statusFilter} onValueChange={setStatusFilter}>
//                     <SelectTrigger className="w-40">
//                       <Filter className="h-4 w-4 mr-2" />
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="all">All Status</SelectItem>
//                       <SelectItem value="pending">Pending</SelectItem>
//                       <SelectItem value="processing">Processing</SelectItem>
//                       <SelectItem value="shipped">Shipped</SelectItem>
//                       <SelectItem value="delivered">Delivered</SelectItem>
//                       <SelectItem value="cancelled">Cancelled</SelectItem>
//                     </SelectContent>
//                   </Select>
//                   <Select value={sortBy} onValueChange={setSortBy}>
//                     <SelectTrigger className="w-40">
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="newest">Newest First</SelectItem>
//                       <SelectItem value="oldest">Oldest First</SelectItem>
//                       <SelectItem value="amount-high">Amount: High to Low</SelectItem>
//                       <SelectItem value="amount-low">Amount: Low to High</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Orders List */}
//           {filteredOrders.length === 0 ? (
//             <Card>
//               <CardContent className="p-12 text-center">
//                 <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
//                 <h3 className="text-lg font-medium mb-2">No orders found</h3>
//                 <p className="text-muted-foreground mb-4">
//                   {searchTerm || statusFilter !== "all"
//                     ? "Try adjusting your search or filter criteria."
//                     : "You haven't placed any orders yet."}
//                 </p>
//                 <Button asChild>
//                   <Link href="/shop">Start Shopping</Link>
//                 </Button>
//               </CardContent>
//             </Card>
//           ) : (
//             <div className="space-y-4">
//               {filteredOrders.map((order) => (
//                 <Card key={order.id}>
//                   <CardContent className="p-6">
//                     <div className="flex flex-col lg:flex-row gap-6">
//                       {/* Order Info */}
//                       <div className="flex-1">
//                         <div className="flex items-center justify-between mb-4">
//                           <div>
//                             <h3 className="font-semibold text-lg">Order {order.id}</h3>
//                             <p className="text-sm text-muted-foreground">
//                               Placed on {new Date(order.orderDate).toLocaleDateString("en-IN")}
//                             </p>
//                           </div>
//                           <Badge className={getStatusColor(order.status)}>
//                             {order.status.replace("-", " ").toUpperCase()}
//                           </Badge>
//                         </div>

//                         {/* Order Items */}
//                         <div className="space-y-3 mb-4">
//                           {order.items.slice(0, 2).map((item, index) => (
//                             <div key={index} className="flex gap-3">
//                               <img
//                                 src={item.productImage || "/placeholder.svg"}
//                                 alt={item.productName}
//                                 className="w-16 h-20 object-cover rounded-md"
//                               />
//                               <div className="flex-1">
//                                 <h4 className="font-medium">{item.productName}</h4>
//                                 <p className="text-sm text-muted-foreground">
//                                   Size: {item.size} | Color: {item.color} | Qty: {item.quantity}
//                                 </p>
//                                 <p className="font-medium">₹{item.price * item.quantity}</p>
//                               </div>
//                             </div>
//                           ))}
//                           {order.items.length > 2 && (
//                             <p className="text-sm text-muted-foreground">
//                               +{order.items.length - 2} more item{order.items.length - 2 !== 1 ? "s" : ""}
//                             </p>
//                           )}
//                         </div>

//                         <Separator className="my-4" />

//                         <div className="flex items-center justify-between">
//                           <div>
//                             <p className="text-sm text-muted-foreground">Total Amount</p>
//                             <p className="text-xl font-bold">₹{order.total}</p>
//                           </div>
//                           {order.trackingNumber && (
//                             <div className="text-right">
//                               <p className="text-sm text-muted-foreground">Tracking Number</p>
//                               <p className="font-medium">{order.trackingNumber}</p>
//                             </div>
//                           )}
//                         </div>
//                       </div>

//                       {/* Actions */}
//                       <div className="flex flex-col gap-2 lg:w-48">
//                         <Button asChild>
//                           <Link href={`/track-order?orderId=${order.id}`}>
//                             <Truck className="h-4 w-4 mr-2" />
//                             Track Order
//                           </Link>
//                         </Button>
//                         <Button variant="outline" asChild>
//                           <Link href={`/order/${order.id}`}>
//                             <Eye className="h-4 w-4 mr-2" />
//                             View Details
//                           </Link>
//                         </Button>
//                         <Button variant="outline">
//                           <Download className="h-4 w-4 mr-2" />
//                           Download Invoice
//                         </Button>
//                         {order.status === "delivered" && (
//                           <Button variant="outline" asChild>
//                             <Link href={`/returns?orderId=${order.id}`}>Return/Exchange</Link>
//                           </Button>
//                         )}
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           )}
//         </div>
//       </main>
//       <Footer />
//     </div>
//   )
// }
import React from 'react'

export default function page() {
  return (
    <div>page</div>
  )
}
