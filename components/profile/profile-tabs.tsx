"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Package, Heart, MapPin, CreditCard, Bell, Shield, Eye, Truck, ShoppingBag, ExternalLink, Plus, X, Edit, Trash2 } from "lucide-react"
import { useUserStore } from "@/stores/userStore"
import { useRouter } from "next/navigation"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import apiClient from "@/lib/apiCalling"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function ProfileTabs() {
  const [activeTab, setActiveTab] = useState("orders")
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState(null)
  const [addresses, setAddresses] = useState([])
  const [addressForm, setAddressForm] = useState({
    type: 'home',
    street: '',
    city: '',
    state: '',
    country: 'India',
    pincode: '',
    isDefault: false
  })

  const { user, updateUser } = useUserStore();

  // Initialize addresses from user data
  useEffect(() => {
    if (user?.address) {
      setAddresses(user.address);
    }
  }, [user]);

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Get status badge variant
  const getStatusVariant = (status) => {
    switch (status) {
      case "confirmed":
        return "default";
      case "pending":
        return "outline";
      case "shipped":
        return "secondary";
      case "delivered":
        return "default";
      case "cancelled":
        return "destructive";
      default:
        return "secondary";
    }
  }

  // Get payment status badge variant
  const getPaymentStatusVariant = (status) => {
    switch (status) {
      case "paid":
        return "default";
      case "pending":
        return "outline";
      case "failed":
        return "destructive";
      case "refunded":
        return "secondary";
      default:
        return "secondary";
    }
  }

  // Handle view items click
  const handleViewItems = (order) => {
    setSelectedOrder(order)
    setIsDialogOpen(true)
  }

  // Handle product navigation
  const handleProductNavigation = (productSlug) => {
    setIsDialogOpen(false)
    window.location.href = `/products/${productSlug}`
  }

  // Address management functions
  const handleAddAddress = () => {
    setEditingAddress(null)
    setAddressForm({
      type: 'home',
      street: '',
      city: '',
      state: '',
      country: 'India',
      pincode: '',
      isDefault: false
    })
    setIsAddressDialogOpen(true)
  }

  const handleEditAddress = (address, index) => {
    setEditingAddress(index)
    setAddressForm({ ...address })
    setIsAddressDialogOpen(true)
  }

  const handleAddressSubmit = async (e) => {
    e.preventDefault()

    try {
      // If editing an existing address
      if (editingAddress !== null) {
        const response = await apiClient.put("/auth/updateAddress", {
          addressId: addresses[editingAddress]._id,
          address: addressForm
        });

        if (response.success) {
          toast.success("Address updated successfully");
          // Update local state
          const updatedAddresses = [...addresses];
          updatedAddresses[editingAddress] = { ...addressForm, _id: addresses[editingAddress]._id };
          setAddresses(updatedAddresses);

          // Update user store
          updateUser({ ...user, address: updatedAddresses });
        } else {
          toast.error(response.error?.message || "Failed to update address");
        }
      } else {
        // Adding a new address
        const response = await apiClient.post("/auth/addAddress", { address: addressForm });

        if (response.success) {
          toast.success("Address added successfully");
          // Update local state
          const newAddress = { ...addressForm, _id: response.data._id };
          const updatedAddresses = [...addresses, newAddress];
          setAddresses(updatedAddresses);

          // Update user store
          updateUser({ ...user, address: updatedAddresses });
        } else {
          toast.error(response.error?.message || "Failed to add address");
        }
      }

      setIsAddressDialogOpen(false);
      setEditingAddress(null);
    } catch (error) {
      console.error("Address operation failed:", error);
      toast.error("An error occurred. Please try again.");
    }
  }

  const handleDeleteAddress = async (index) => {
    try {
      const addressId = addresses[index]._id;
      const response = await apiClient.delete("/auth/deleteAddress", { addressId });

      if (response.success) {
        toast.success("Address deleted successfully");
        // Update local state
        const updatedAddresses = addresses.filter((_, i) => i !== index);
        setAddresses(updatedAddresses);

        // Update user store
        updateUser({ ...user, address: updatedAddresses });
      } else {
        toast.error(response.error?.message || "Failed to delete address");
      }
    } catch (error) {
      console.error("Delete address failed:", error);
      toast.error("An error occurred. Please try again.");
    }
  }

  // Get unique order addresses
  const getOrderAddresses = () => {
    if (!user?.orders) return [];

    const addressesMap = new Map();
    user.orders.forEach(order => {
      const key = `${order.shipping_address.street}-${order.shipping_address.city}-${order.shipping_address.state}-${order.shipping_address.country}`;
      if (!addressesMap.has(key)) {
        addressesMap.set(key, order.shipping_address);
      }
    });

    return Array.from(addressesMap.values());
  }

  // Get order status text with icon
  const getOrderStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Pending";
      case "confirmed":
        return "Confirmed";
      case "shipped":
        return "Shipped";
      case "delivered":
        return "Delivered";
      case "cancelled":
        return "Cancelled";
      default:
        return status;
    }
  }

  return (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 mb-6">
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            <span className="hidden sm:inline">Orders</span>
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
        <TabsContent value="orders" className="mt-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-xl">Order History</CardTitle>
              <p className="text-sm text-muted-foreground">View and manage your orders</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {user?.orders?.length > 0 ? (
                  user.orders.map((order) => (
                    <div key={order.order_number} className="flex flex-col p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
                        <div>
                          <h3 className="font-medium text-foreground">{order.order_number}</h3>
                          <p className="text-sm text-muted-foreground mt-1">Placed on {formatDate(order.created_at)}</p>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          <Badge variant={getStatusVariant(order.status)} className="capitalize">
                            {getOrderStatusText(order.status)}
                          </Badge>
                          <Badge variant={getPaymentStatusVariant(order.payment_status)} className="capitalize">
                            {order.payment_status}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="text-sm">
                          <p className="font-medium text-muted-foreground">Items</p>
                          <p>{order.items_count} product{order.items_count !== 1 ? 's' : ''}</p>
                        </div>
                        <div className="text-sm">
                          <p className="font-medium text-muted-foreground">Total Amount</p>
                          <p>{user.preferences?.currency || '₹'} {order.total}</p>
                        </div>
                        <div className="text-sm">
                          <p className="font-medium text-muted-foreground">Shipping to</p>
                          <p>{order.shipping_address.city}, {order.shipping_address.country}</p>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div className="flex items-center gap-2">
                          {order.items?.slice(0, 3).map((item, index) => (
                            <div key={index} className="w-8 h-8 bg-muted rounded-md flex items-center justify-center">
                              <Package className="h-4 w-4 text-muted-foreground" />
                            </div>
                          ))}
                          {order.items_count > 3 && (
                            <span className="text-xs text-muted-foreground">+{order.items_count - 3} more</span>
                          )}
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewItems(order)}
                            className="flex items-center gap-1"
                          >
                            <Eye className="h-4 w-4" />
                            View Details
                          </Button>
                          {order.status === "confirmed" && (
                            <Button variant="outline" size="sm" className="flex items-center gap-1">
                              <Truck className="h-4 w-4" />
                              Track Order
                            </Button>
                          )}
                          {order.status === "delivered" && (
                            <Button variant="outline" size="sm" className="flex items-center gap-1">
                              <ShoppingBag className="h-4 w-4" />
                              Buy Again
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No orders yet</h3>
                    <p className="text-muted-foreground mb-4">When you place orders, they'll appear here.</p>
                    <Button onClick={() => window.location.href = "/products"}>
                      Start Shopping
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Addresses Tab */}
        <TabsContent value="addresses" className="mt-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-xl">Saved Addresses</CardTitle>
                <p className="text-sm text-muted-foreground">Manage your shipping addresses</p>
              </div>
              <Button onClick={handleAddAddress} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add New Address
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* User's saved addresses */}
                {addresses.length > 0 ? (
                  addresses.map((address, index) => (
                    <div key={index} className="p-4 border rounded-lg relative group">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="capitalize">
                            {address.type || 'home'}
                          </Badge>
                          {address.isDefault && <Badge variant="secondary">Default</Badge>}
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditAddress(address, index)}
                            className="h-8 w-8"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteAddress(index)}
                            className="h-8 w-8 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-1 text-sm">
                        <p className="font-medium">{address.street}</p>
                        <p className="text-muted-foreground">
                          {address.city}, {address.state} {address.pincode && `- ${address.pincode}`}
                        </p>
                        <p className="text-muted-foreground">{address.country}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8">
                    <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No addresses saved</h3>
                    <p className="text-muted-foreground">Add your first address to get started.</p>
                  </div>
                )}

                {/* Addresses from orders */}
                {getOrderAddresses().length > 0 && (
                  <>
                    <div className="col-span-full mt-6 mb-4">
                      <h3 className="text-lg font-medium">Addresses from Orders</h3>
                      <p className="text-sm text-muted-foreground">These addresses were used in previous orders</p>
                    </div>
                    {getOrderAddresses().map((address, index) => (
                      <div key={index} className="p-4 border rounded-lg opacity-75">
                        <Badge variant="outline" className="mb-2">From Order</Badge>
                        <div className="space-y-1 text-sm">
                          <p className="font-medium">{address.street}</p>
                          <p className="text-muted-foreground">
                            {address.city}, {address.state}, {address.country}
                          </p>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Other tabs remain similar with improved UI */}
        <TabsContent value="payments" className="mt-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Payment Methods</CardTitle>
              <p className="text-sm text-muted-foreground">Manage your payment preferences</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {user?.orders?.some(order => order.payment_status === "paid") ? (
                  <>
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <CreditCard className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">Crypto Payments</h4>
                          <p className="text-sm text-muted-foreground">Secure cryptocurrency transactions</p>
                        </div>
                      </div>
                      <div className="text-sm">
                        <p>You've successfully made payments using cryptocurrency for your orders.</p>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Payment History</h4>
                      <div className="space-y-2">
                        {user.orders
                          .filter(order => order.payment_status === "paid")
                          .slice(0, 3)
                          .map(order => (
                            <div key={order._id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                              <div>
                                <p className="text-sm font-medium">{order.order_number}</p>
                                <p className="text-xs text-muted-foreground">{formatDate(order.created_at)}</p>
                              </div>
                              <p className="text-sm font-medium">{user.preferences?.currency || '₹'} {order.total}</p>
                            </div>
                          ))
                        }
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No payment methods</h3>
                    <p className="text-muted-foreground">Your payment methods will appear here after your first order.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Notification Preferences</CardTitle>
              <p className="text-sm text-muted-foreground">Manage how we contact you</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Bell className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Email Notifications</h4>
                      <p className="text-sm text-muted-foreground">Receive updates via email</p>
                    </div>
                  </div>
                  <Badge variant={user?.preferences?.notifications?.email ? "default" : "outline"}>
                    {user?.preferences?.notifications?.email ? "Enabled" : "Disabled"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Bell className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">SMS Notifications</h4>
                      <p className="text-sm text-muted-foreground">Receive updates via SMS</p>
                    </div>
                  </div>
                  <Badge variant={user?.preferences?.notifications?.sms ? "default" : "outline"}>
                    {user?.preferences?.notifications?.sms ? "Enabled" : "Disabled"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Bell className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Push Notifications</h4>
                      <p className="text-sm text-muted-foreground">Receive push notifications</p>
                    </div>
                  </div>
                  <Badge variant={user?.preferences?.notifications?.push ? "default" : "outline"}>
                    {user?.preferences?.notifications?.push ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Security Settings</CardTitle>
              <p className="text-sm text-muted-foreground">Manage your account security</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Shield className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Two-Factor Authentication</h4>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                    </div>
                  </div>
                  <Badge variant={user?.two_factor?.enabled ? "default" : "outline"}>
                    {user?.two_factor?.enabled ? "Enabled" : "Disabled"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Shield className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Email Verification</h4>
                      <p className="text-sm text-muted-foreground">Verify your email address</p>
                    </div>
                  </div>
                  <Badge variant={user?.email_verified ? "default" : "outline"}>
                    {user?.email_verified ? "Verified" : "Not Verified"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Shield className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Phone Verification</h4>
                      <p className="text-sm text-muted-foreground">Verify your phone number</p>
                    </div>
                  </div>
                  <Badge variant={user?.phone_verified ? "default" : "outline"}>
                    {user?.phone_verified ? "Verified" : "Not Verified"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Order Items Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Order Details - {selectedOrder?.order_number}
            </DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Order Date</p>
                    <p className="font-medium">{formatDate(selectedOrder.created_at)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total Amount</p>
                    <p className="font-medium">{user.preferences?.currency || '₹'} {selectedOrder.total}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <Badge variant={getStatusVariant(selectedOrder.status)} className="capitalize">
                      {getOrderStatusText(selectedOrder.status)}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Payment</p>
                    <Badge variant={getPaymentStatusVariant(selectedOrder.payment_status)} className="capitalize">
                      {selectedOrder.payment_status}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-lg">Order Items ({selectedOrder.items_count})</h4>
                {selectedOrder.items?.map((item, index) => (
                  <div
                    key={item.id || index}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center">
                          <Package className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">{item.product_id?.name || `Product ${index + 1}`}</p>
                          <p className="text-sm text-muted-foreground">
                            Quantity: {item.quantity} • Price: {user.preferences?.currency || '₹'} {item.price}
                          </p>
                          <p className="text-sm font-medium">
                            Subtotal: {user.preferences?.currency || '₹'} {item.price * item.quantity}
                          </p>
                        </div>
                      </div>
                    </div>
                    {item.product_id?.slug && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleProductNavigation(item.product_id.slug)}
                        className="flex items-center gap-2"
                      >
                        View Product
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Shipping Address
                  </h4>
                  <p className="text-sm">
                    {selectedOrder.shipping_address.street}<br />
                    {selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state}<br />
                    {selectedOrder.shipping_address.country}
                    {selectedOrder.shipping_address.pincode && `, ${selectedOrder.shipping_address.pincode}`}
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Billing Address
                  </h4>
                  <p className="text-sm">
                    {selectedOrder.billing_address.street}<br />
                    {selectedOrder.billing_address.city}, {selectedOrder.billing_address.state}<br />
                    {selectedOrder.billing_address.country}
                    {selectedOrder.billing_address.pincode && `, ${selectedOrder.billing_address.pincode}`}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add/Edit Address Dialog */}
      <Dialog open={isAddressDialogOpen} onOpenChange={setIsAddressDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingAddress !== null ? 'Edit Address' : 'Add New Address'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddressSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="type">Address Type</Label>
              <Select
                value={addressForm.type}
                onValueChange={(value) => setAddressForm(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select address type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="home">Home</SelectItem>
                  <SelectItem value="work">Work</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="street">Street Address</Label>
              <Textarea
                id="street"
                value={addressForm.street}
                onChange={(e) => setAddressForm(prev => ({ ...prev, street: e.target.value }))}
                placeholder="Enter your street address"
                required
                className="min-h-20"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={addressForm.city}
                  onChange={(e) => setAddressForm(prev => ({ ...prev, city: e.target.value }))}
                  placeholder="City"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={addressForm.state}
                  onChange={(e) => setAddressForm(prev => ({ ...prev, state: e.target.value }))}
                  placeholder="State"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="pincode">ZIP Code</Label>
                <Input
                  id="pincode"
                  value={addressForm.pincode}
                  onChange={(e) => setAddressForm(prev => ({ ...prev, pincode: e.target.value }))}
                  placeholder="ZIP Code"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={addressForm.country}
                  onChange={(e) => setAddressForm(prev => ({ ...prev, country: e.target.value }))}
                  placeholder="Country"
                  required
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isDefault"
                checked={addressForm.isDefault}
                onChange={(e) => setAddressForm(prev => ({ ...prev, isDefault: e.target.checked }))}
                className="w-4 h-4"
              />
              <Label htmlFor="isDefault" className="cursor-pointer">Make this my default address</Label>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsAddressDialogOpen(false)
                  setEditingAddress(null)
                }}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingAddress !== null ? 'Update Address' : 'Add Address'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}