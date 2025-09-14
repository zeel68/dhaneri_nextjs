// "use client"

// import type React from "react"
// import { useState, useCallback } from "react"
// import Link from "next/link"
// import { useRouter } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Separator } from "@/components/ui/separator"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { useToast } from "@/hooks/use-toast"
// import { ArrowLeft, CreditCard, Truck, Shield, MapPin, ShoppingBag, AlertCircle } from "lucide-react"
// import { useCartStore } from "@/stores/cartStore"
// import { z } from "zod"
// import { useForm } from "react-hook-form"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { useUserStore } from "@/stores/userStore"
// import ApiClient from "@/lib/apiCalling"
// import { STORE_ID } from "@/data/Consts"

// // Environment variables - these should be in your .env file

// const RAZORPAY_KEY = process.env.NEXT_PUBLIC_RAZORPAY_KEY || "rzp_test_2TD6bdPgMvp803"


// // Types
// interface User {
//   id: string
//   accessToken: string
// }

// interface OrderStatus {
//   status: 'idle' | 'creating_order' | 'processing_payment' | 'completed'
//   orderId?: string
// }

// interface PaymentError {
//   type: 'payment' | 'server' | 'network' | 'user_cancelled'
//   message: string
//   details?: string
// }

// // Zod schemas
// const shippingAddressSchema = z.object({
//   firstName: z.string().min(1, "First name is required").max(50, "First name is too long"),
//   lastName: z.string().min(1, "Last name is required").max(50, "Last name is too long"),
//   email: z.string().email("Invalid email address"),
//   phone: z.string()
//     .min(10, "Phone number must be at least 10 digits")
//     .max(15, "Phone number is too long")
//     .regex(/^[0-9+\-\s\(\)]+$/, "Invalid phone number format"),
//   address: z.string().min(5, "Address must be at least 5 characters").max(200, "Address is too long"),
//   city: z.string().min(1, "City is required").max(50, "City name is too long"),
//   state: z.string().min(1, "State is required"),
//   pincode: z.string()
//     .regex(/^[0-9]{6}$/, "PIN code must be exactly 6 digits")
// })

// const billingAddressSchema = shippingAddressSchema.omit({ email: true, phone: true })

// const checkoutFormSchema = z.object({
//   shippingAddress: shippingAddressSchema,
//   billingAddress: billingAddressSchema.optional(),
//   sameAsShipping: z.boolean(),
//   shippingMethod: z.enum(['standard', 'express']),
//   paymentMethod: z.enum(['card', 'upi', 'netbanking', 'cod']),
// }).refine((data) => {
//   if (!data.sameAsShipping && !data.billingAddress) {
//     return false
//   }
//   return true
// }, {
//   message: "Billing address is required when different from shipping address",
//   path: ["billingAddress"]
// })

// type CheckoutFormData = z.infer<typeof checkoutFormSchema>




// export default function CheckoutPage() {
//   const router = useRouter()
//   const { toast } = useToast()
//   const { user } = useUserStore()
//   const { items, total, subtotal, shipping_fee, discount, coupon, clearCart } = useCartStore()

//   const [isProcessing, setIsProcessing] = useState(false)
//   const [orderStatus, setOrderStatus] = useState<OrderStatus>({ status: 'idle' })
//   const [error, setError] = useState<PaymentError | null>(null)

//   const form = useForm<CheckoutFormData>({
//     resolver: zodResolver(checkoutFormSchema),
//     defaultValues: {
//       shippingAddress: {
//         firstName: "",
//         lastName: "",
//         email: "",
//         phone: "",
//         address: "",
//         city: "",
//         state: "",
//         pincode: ""
//       },
//       sameAsShipping: true,
//       shippingMethod: "standard",
//       paymentMethod: "card"
//     }
//   })

//   const watchSameAsShipping = form.watch("sameAsShipping")
//   const watchShippingMethod = form.watch("shippingMethod")
//   const watchPaymentMethod = form.watch("paymentMethod")

//   // Calculate shipping cost based on method and subtotal
//   const calculateShippingCost = () => {
//     if (subtotal >= 999) return 0 // Free shipping for orders over ₹999
//     return watchShippingMethod === "express" ? 199 : 99
//   }

//   const shippingCost = calculateShippingCost()
//   const tax = Math.round(subtotal * 0.18) // 18% GST
//   const finalTotal = subtotal + shippingCost + tax - (discount || 0)

//   const cartItems = items

//   if (cartItems.length === 0) {
//     return (
//       <div className="min-h-screen bg-background">
//         <div className="container mx-auto px-4 py-16">
//           <Card className="max-w-md mx-auto text-center">
//             <CardContent className="p-8">
//               <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
//               <CardTitle className="text-xl mb-2">Your cart is empty</CardTitle>
//               <p className="text-muted-foreground mb-6">Add some items to your cart before checkout.</p>
//               <Button asChild>
//                 <Link href="/shop">Continue Shopping</Link>
//               </Button>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     )
//   }

//   const loadRazorpayScript = useCallback((): Promise<boolean> => {
//     return new Promise((resolve) => {
//       // Check if Razorpay is already loaded
//       if ((window as any).Razorpay) {
//         resolve(true)
//         return
//       }

//       const script = document.createElement("script")
//       script.src = "https://checkout.razorpay.com/v1/checkout.js"
//       script.onload = () => resolve(true)
//       script.onerror = () => resolve(false)
//       document.body.appendChild(script)
//     })
//   }, [])

//   const createOrder = async (formData: CheckoutFormData) => {
//     try {
//       const apiClient = new ApiClient({
//         headers: {
//           Authorization: `Bearer ${user?.accessToken}`,
//         },
//       })

//       if (!user?.id) {
//         throw new Error("Please log in to continue")
//       }

//       const shipping_address = {
//         street: formData.shippingAddress.address,
//         city: formData.shippingAddress.city,
//         state: formData.shippingAddress.state,
//         pincode: formData.shippingAddress.pincode,
//         country: "India"
//       }

//       const billing_address = formData.sameAsShipping
//         ? shipping_address
//         : {
//           street: formData.billingAddress!.address,
//           city: formData.billingAddress!.city,
//           state: formData.billingAddress!.state,
//           pincode: formData.billingAddress!.pincode,
//           country: "India"
//         }

//       const result = await apiClient.post(`/storefront/store/${STORE_ID}/orders`, {
//         shipping_address,
//         billing_address,
//         payment_method: formData.paymentMethod,
//         notes: "",
//         use_cart: false,
//         items,
//         customer_info: {
//           firstName: formData.shippingAddress.firstName,
//           lastName: formData.shippingAddress.lastName,
//           email: formData.shippingAddress.email,
//           phone: formData.shippingAddress.phone,
//         }
//       })

//       if (!result.success) {
//         throw new Error(result.data?.message || "Failed to create order")
//       }

//       return result.data
//     } catch (error: any) {
//       console.error('Order creation failed:', error)
//       throw error
//     }
//   }

//   const handlePaymentSuccess = async (response: any, orderId: string, payment_id: string) => {
//     try {
//       const apiClient = new ApiClient({
//         headers: {
//           Authorization: `Bearer ${user?.accessToken}`,
//         },
//       })

//       const res = await apiClient.post(`/storefront/store/${STORE_ID}/payment/callback`, {
//         payment_id: payment_id,
//         razorpay_payment_id: response.razorpay_payment_id,
//         status: "completed",
//         transaction_id: response.razorpay_order_id,
//         gateway_response: response.razorpay_signature,
//       })

//       if (res.success) {
//         clearCart()
//         setOrderStatus({ status: 'completed', orderId })

//         toast({
//           title: "Payment successful!",
//           description: "Your order has been placed successfully.",
//         })

//         setTimeout(() => {
//           router.push(`/order-confirmation/${orderId}`)
//         }, 1500)
//       } else {
//         throw new Error("Payment verification failed")
//       }
//     } catch (error: any) {
//       console.error('Payment verification failed:', error)
//       setError({
//         type: 'server',
//         message: 'Payment successful but verification failed',
//         details: 'Your payment was processed but we couldn\'t verify it. Please contact support.'
//       })
//     }
//   }

//   const handlePaymentFailure = (error: any) => {
//     console.error('Payment failed:', error)

//     let errorMessage = 'Payment failed. Please try again.'
//     let errorType: PaymentError['type'] = 'payment'

//     switch (error.code) {
//       case 'BAD_REQUEST_ERROR':
//         errorMessage = 'Invalid payment request. Please check your details.'
//         break
//       case 'GATEWAY_ERROR':
//         errorMessage = 'Payment gateway error. Please try again.'
//         break
//       case 'NETWORK_ERROR':
//         errorMessage = 'Network error. Please check your connection and try again.'
//         errorType = 'network'
//         break
//       case 'SERVER_ERROR':
//         errorMessage = 'Server error. Please try again later.'
//         errorType = 'server'
//         break
//       default:
//         if (error.description?.includes('cancelled')) {
//           errorMessage = 'Payment was cancelled by user.'
//           errorType = 'user_cancelled'
//         }
//     }

//     setError({
//       type: errorType,
//       message: errorMessage,
//       details: error.description
//     })
//   }

//   const processPayment = async (orderData: any, formData: CheckoutFormData) => {
//     try {
//       setOrderStatus({ status: 'processing_payment' })

//       const scriptLoaded = await loadRazorpayScript()
//       if (!scriptLoaded) {
//         throw new Error("Payment gateway failed to load. Please check your internet connection.")
//       }

//       const apiClient = new ApiClient({
//         headers: {
//           Authorization: `Bearer ${user?.accessToken}`,
//         },
//       })

//       const res = await apiClient.post(`/storefront/store/${STORE_ID}/payment/initialize`, {
//         order_id: orderData.order._id,
//         payment_method: "razorpay",
//       })

//       if (res.success) {
//         const options = {
//           key: RAZORPAY_KEY,
//           amount: orderData.order.total * 100,
//           currency: "INR",
//           name: "Dhaneri Store",
//           description: `Order ${orderData.order.id}`,
//           order_id: orderData.razorpay_order_id,
//           handler: (response: any) => handlePaymentSuccess(response, orderData.order.id, res.data.data.payment_id),
//           prefill: {
//             name: `${formData.shippingAddress.firstName} ${formData.shippingAddress.lastName}`,
//             email: formData.shippingAddress.email,
//             contact: formData.shippingAddress.phone,
//           },
//           theme: {
//             color: "#dc2626",
//           },
//           modal: {
//             ondismiss: () => {
//               setError({
//                 type: 'user_cancelled',
//                 message: 'Payment was cancelled',
//                 details: 'You closed the payment window. Your order is still pending.'
//               })
//             }
//           },
//           retry: {
//             enabled: true,
//             max_count: 3
//           },
//           error: handlePaymentFailure,
//         }

//         const paymentObject = new (window as any).Razorpay(options)
//         paymentObject.on('payment.failed', handlePaymentFailure)
//         paymentObject.open()
//       } else {
//         throw new Error("Payment initialization failed")
//       }
//     } catch (error: any) {
//       console.error('Payment processing failed:', error)
//       setError({
//         type: 'payment',
//         message: error.message || 'Failed to process payment',
//         details: 'There was an error setting up the payment. Please try again.'
//       })
//     }
//   }

//   const processCODOrder = async (formData: CheckoutFormData) => {
//     try {
//       setOrderStatus({ status: 'creating_order' })
//       const orderData = await createOrder(formData)

//       clearCart()
//       setOrderStatus({ status: 'completed', orderId: orderData.order.id })

//       toast({
//         title: "Order placed successfully!",
//         description: "Your COD order has been confirmed.",
//       })

//       setTimeout(() => {
//         router.push(`/order-confirmation/${orderData.order.id}`)
//       }, 1500)
//     } catch (error: any) {
//       console.error('COD order failed:', error)
//       setError({
//         type: 'server',
//         message: error.message || 'Failed to place order',
//         details: 'There was an error creating your order. Please try again.'
//       })
//     }
//   }

//   const onSubmit = async (data: CheckoutFormData) => {
//     setIsProcessing(true)
//     setError(null)

//     try {
//       if (data.paymentMethod === "cod") {
//         await processCODOrder(data)
//       } else {
//         const orderData = await createOrder(data)
//         await processPayment(orderData, data)
//       }
//     } catch (error: any) {
//       setError({
//         type: 'server',
//         message: error.message || 'Failed to process order',
//         details: 'There was an error processing your order. Please try again.'
//       })
//     } finally {
//       setIsProcessing(false)
//     }
//   }

//   const indianStates = [
//     { value: "andhra-pradesh", label: "Andhra Pradesh" },
//     { value: "arunachal-pradesh", label: "Arunachal Pradesh" },
//     { value: "assam", label: "Assam" },
//     { value: "bihar", label: "Bihar" },
//     { value: "chhattisgarh", label: "Chhattisgarh" },
//     { value: "delhi", label: "Delhi" },
//     { value: "goa", label: "Goa" },
//     { value: "gujarat", label: "Gujarat" },
//     { value: "haryana", label: "Haryana" },
//     { value: "himachal-pradesh", label: "Himachal Pradesh" },
//     { value: "jharkhand", label: "Jharkhand" },
//     { value: "karnataka", label: "Karnataka" },
//     { value: "kerala", label: "Kerala" },
//     { value: "madhya-pradesh", label: "Madhya Pradesh" },
//     { value: "maharashtra", label: "Maharashtra" },
//     { value: "manipur", label: "Manipur" },
//     { value: "meghalaya", label: "Meghalaya" },
//     { value: "mizoram", label: "Mizoram" },
//     { value: "nagaland", label: "Nagaland" },
//     { value: "odisha", label: "Odisha" },
//     { value: "punjab", label: "Punjab" },
//     { value: "rajasthan", label: "Rajasthan" },
//     { value: "sikkim", label: "Sikkim" },
//     { value: "tamil-nadu", label: "Tamil Nadu" },
//     { value: "telangana", label: "Telangana" },
//     { value: "tripura", label: "Tripura" },
//     { value: "uttar-pradesh", label: "Uttar Pradesh" },
//     { value: "uttarakhand", label: "Uttarakhand" },
//     { value: "west-bengal", label: "West Bengal" }
//   ]

//   return (
//     <div className="min-h-screen bg-background">
//       <div className="container mx-auto px-4 py-8">
//         {/* Breadcrumb */}
//         <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
//           <Link href="/" className="hover:text-foreground">
//             Home
//           </Link>
//           <span>/</span>
//           <Link href="/cart" className="hover:text-foreground">
//             Cart
//           </Link>
//           <span>/</span>
//           <span className="text-foreground">Checkout</span>
//         </div>

//         {error && (
//           <Alert variant="destructive" className="mb-6">
//             <AlertCircle className="h-4 w-4" />
//             <AlertDescription>
//               <strong>{error.message}</strong>
//               {error.details && <div className="mt-1 text-sm">{error.details}</div>}
//             </AlertDescription>
//           </Alert>
//         )}

//         {orderStatus.status !== 'idle' && (
//           <Alert className="mb-6">
//             <AlertDescription>
//               {orderStatus.status === 'creating_order' && "Creating your order..."}
//               {orderStatus.status === 'processing_payment' && "Processing payment..."}
//               {orderStatus.status === 'completed' && "Order completed successfully!"}
//             </AlertDescription>
//           </Alert>
//         )}

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Checkout Form */}
//           <div className="lg:col-span-2">
//             <Form {...form}>
//               <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//                 {/* Shipping Address */}
//                 <Card>
//                   <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                       <MapPin className="h-5 w-5" />
//                       Shipping Address
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent className="space-y-4">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <FormField
//                         control={form.control}
//                         name="shippingAddress.firstName"
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel>First Name *</FormLabel>
//                             <FormControl>
//                               <Input {...field} />
//                             </FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />
//                       <FormField
//                         control={form.control}
//                         name="shippingAddress.lastName"
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel>Last Name *</FormLabel>
//                             <FormControl>
//                               <Input {...field} />
//                             </FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />
//                     </div>

//                     <FormField
//                       control={form.control}
//                       name="shippingAddress.email"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Email Address *</FormLabel>
//                           <FormControl>
//                             <Input type="email" {...field} />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />

//                     <FormField
//                       control={form.control}
//                       name="shippingAddress.phone"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Phone Number *</FormLabel>
//                           <FormControl>
//                             <Input type="tel" {...field} />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />

//                     <FormField
//                       control={form.control}
//                       name="shippingAddress.address"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Street Address *</FormLabel>
//                           <FormControl>
//                             <Input {...field} />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />

//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                       <FormField
//                         control={form.control}
//                         name="shippingAddress.city"
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel>City *</FormLabel>
//                             <FormControl>
//                               <Input {...field} />
//                             </FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />

//                       <FormField
//                         control={form.control}
//                         name="shippingAddress.state"
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel>State *</FormLabel>
//                             <Select onValueChange={field.onChange} defaultValue={field.value}>
//                               <FormControl>
//                                 <SelectTrigger>
//                                   <SelectValue placeholder="Select state" />
//                                 </SelectTrigger>
//                               </FormControl>
//                               <SelectContent>
//                                 {indianStates.map((state) => (
//                                   <SelectItem key={state.value} value={state.value}>
//                                     {state.label}
//                                   </SelectItem>
//                                 ))}
//                               </SelectContent>
//                             </Select>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />

//                       <FormField
//                         control={form.control}
//                         name="shippingAddress.pincode"
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel>PIN Code *</FormLabel>
//                             <FormControl>
//                               <Input {...field} />
//                             </FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />
//                     </div>
//                   </CardContent>
//                 </Card>

//                 {/* Billing Address */}
//                 <Card>
//                   <CardHeader>
//                     <CardTitle>Billing Address</CardTitle>
//                   </CardHeader>
//                   <CardContent className="space-y-4">
//                     <FormField
//                       control={form.control}
//                       name="sameAsShipping"
//                       render={({ field }) => (
//                         <FormItem className="flex flex-row items-start space-x-3 space-y-0">
//                           <FormControl>
//                             <Checkbox
//                               checked={field.value}
//                               onCheckedChange={field.onChange}
//                             />
//                           </FormControl>
//                           <div className="space-y-1 leading-none">
//                             <FormLabel>
//                               Same as shipping address
//                             </FormLabel>
//                           </div>
//                         </FormItem>
//                       )}
//                     />

//                     {!watchSameAsShipping && (
//                       <div className="space-y-4">
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                           <FormField
//                             control={form.control}
//                             name="billingAddress.firstName"
//                             render={({ field }) => (
//                               <FormItem>
//                                 <FormLabel>First Name *</FormLabel>
//                                 <FormControl>
//                                   <Input {...field} />
//                                 </FormControl>
//                                 <FormMessage />
//                               </FormItem>
//                             )}
//                           />
//                           <FormField
//                             control={form.control}
//                             name="billingAddress.lastName"
//                             render={({ field }) => (
//                               <FormItem>
//                                 <FormLabel>Last Name *</FormLabel>
//                                 <FormControl>
//                                   <Input {...field} />
//                                 </FormControl>
//                                 <FormMessage />
//                               </FormItem>
//                             )}
//                           />
//                         </div>

//                         <FormField
//                           control={form.control}
//                           name="billingAddress.address"
//                           render={({ field }) => (
//                             <FormItem>
//                               <FormLabel>Street Address *</FormLabel>
//                               <FormControl>
//                                 <Input {...field} />
//                               </FormControl>
//                               <FormMessage />
//                             </FormItem>
//                           )}
//                         />

//                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                           <FormField
//                             control={form.control}
//                             name="billingAddress.city"
//                             render={({ field }) => (
//                               <FormItem>
//                                 <FormLabel>City *</FormLabel>
//                                 <FormControl>
//                                   <Input {...field} />
//                                 </FormControl>
//                                 <FormMessage />
//                               </FormItem>
//                             )}
//                           />

//                           <FormField
//                             control={form.control}
//                             name="billingAddress.state"
//                             render={({ field }) => (
//                               <FormItem>
//                                 <FormLabel>State *</FormLabel>
//                                 <Select onValueChange={field.onChange} defaultValue={field.value}>
//                                   <FormControl>
//                                     <SelectTrigger>
//                                       <SelectValue placeholder="Select state" />
//                                     </SelectTrigger>
//                                   </FormControl>
//                                   <SelectContent>
//                                     {indianStates.map((state) => (
//                                       <SelectItem key={state.value} value={state.value}>
//                                         {state.label}
//                                       </SelectItem>
//                                     ))}
//                                   </SelectContent>
//                                 </Select>
//                                 <FormMessage />
//                               </FormItem>
//                             )}
//                           />

//                           <FormField
//                             control={form.control}
//                             name="billingAddress.pincode"
//                             render={({ field }) => (
//                               <FormItem>
//                                 <FormLabel>PIN Code *</FormLabel>
//                                 <FormControl>
//                                   <Input {...field} />
//                                 </FormControl>
//                                 <FormMessage />
//                               </FormItem>
//                             )}
//                           />
//                         </div>
//                       </div>
//                     )}
//                   </CardContent>
//                 </Card>

//                 {/* Shipping Method */}
//                 <Card>
//                   <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                       <Truck className="h-5 w-5" />
//                       Shipping Method
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <FormField
//                       control={form.control}
//                       name="shippingMethod"
//                       render={({ field }) => (
//                         <FormItem className="space-y-3">
//                           <FormControl>
//                             <RadioGroup
//                               onValueChange={field.onChange}
//                               defaultValue={field.value}
//                               className="grid grid-cols-1 gap-4"
//                             >
//                               <div className="flex items-center space-x-2 p-4 border rounded-lg">
//                                 <RadioGroupItem value="standard" id="standard" />
//                                 <div className="flex-1">
//                                   <Label htmlFor="standard" className="font-medium">
//                                     Standard Delivery
//                                   </Label>
//                                   <p className="text-sm text-muted-foreground">5-7 business days</p>
//                                 </div>
//                                 <span className="font-medium">
//                                   {subtotal >= 999 ? "Free" : "₹99"}
//                                 </span>
//                               </div>

//                               <div className="flex items-center space-x-2 p-4 border rounded-lg">
//                                 <RadioGroupItem value="express" id="express" />
//                                 <div className="flex-1">
//                                   <Label htmlFor="express" className="font-medium">
//                                     Express Delivery
//                                   </Label>
//                                   <p className="text-sm text-muted-foreground">2-3 business days</p>
//                                 </div>
//                                 <span className="font-medium">
//                                   {subtotal >= 999 ? "Free" : "₹199"}
//                                 </span>
//                               </div>
//                             </RadioGroup>
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                   </CardContent>
//                 </Card>

//                 {/* Payment Method */}
//                 <Card>
//                   <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                       <CreditCard className="h-5 w-5" />
//                       Payment Method
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <FormField
//                       control={form.control}
//                       name="paymentMethod"
//                       render={({ field }) => (
//                         <FormItem className="space-y-3">
//                           <FormControl>
//                             <RadioGroup
//                               onValueChange={field.onChange}
//                               defaultValue={field.value}
//                               className="grid grid-cols-1 gap-4"
//                             >
//                               <div className="flex items-center space-x-2 p-4 border rounded-lg">
//                                 <RadioGroupItem value="card" id="card" />
//                                 <div className="flex-1">
//                                   <Label htmlFor="card" className="font-medium">
//                                     Credit/Debit Card
//                                   </Label>
//                                   <p className="text-sm text-muted-foreground">Pay securely with your card</p>
//                                 </div>
//                                 <CreditCard className="h-5 w-5 text-muted-foreground" />
//                               </div>

//                               <div className="flex items-center space-x-2 p-4 border rounded-lg">
//                                 <RadioGroupItem value="upi" id="upi" />
//                                 <div className="flex-1">
//                                   <Label htmlFor="upi" className="font-medium">
//                                     UPI
//                                   </Label>
//                                   <p className="text-sm text-muted-foreground">Pay with Google Pay, PhonePe, Paytm</p>
//                                 </div>
//                               </div>

//                               <div className="flex items-center space-x-2 p-4 border rounded-lg">
//                                 <RadioGroupItem value="netbanking" id="netbanking" />
//                                 <div className="flex-1">
//                                   <Label htmlFor="netbanking" className="font-medium">
//                                     Net Banking
//                                   </Label>
//                                   <p className="text-sm text-muted-foreground">Pay directly from your bank account</p>
//                                 </div>
//                               </div>

//                               <div className="flex items-center space-x-2 p-4 border rounded-lg">
//                                 <RadioGroupItem value="cod" id="cod" />
//                                 <div className="flex-1">
//                                   <Label htmlFor="cod" className="font-medium">
//                                     Cash on Delivery
//                                   </Label>
//                                   <p className="text-sm text-muted-foreground">Pay when you receive the order</p>
//                                 </div>
//                               </div>
//                             </RadioGroup>
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                   </CardContent>
//                 </Card>

//                 {/* Submit Button */}
//                 <div className="flex gap-4">
//                   <Button type="button" variant="outline" asChild>
//                     <Link href="/cart">
//                       <ArrowLeft className="h-4 w-4 mr-2" />
//                       Back to Cart
//                     </Link>
//                   </Button>
//                   <Button
//                     type="submit"
//                     className="flex-1"
//                     disabled={isProcessing || orderStatus.status !== 'idle'}
//                   >
//                     {isProcessing || orderStatus.status !== 'idle'
//                       ? "Processing..."
//                       : `Place Order - ₹${finalTotal.toLocaleString()}`
//                     }
//                   </Button>
//                 </div>
//               </form>
//             </Form>
//           </div>

//           {/* Order Summary */}
//           <div className="lg:col-span-1">
//             <Card className="sticky top-4">
//               <CardHeader>
//                 <CardTitle>Order Summary</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 {/* Order Items */}
//                 <div className="space-y-3">
//                   {cartItems.map((item) => (
//                     <div key={item._id} className="flex gap-3">
//                       <img
//                         src={item.product_id.images?.[0] || "/placeholder.svg?height=80&width=64"}
//                         alt={item.product_id.name}
//                         className="w-16 h-20 object-cover rounded-md"
//                       />
//                       <div className="flex-1">
//                         <h4 className="font-medium text-sm">{item.product_id.name}</h4>
//                         <p className="text-xs text-muted-foreground">
//                           {item.size_id?.size} | {item.variant_id?.color} | Qty: {item.quantity}
//                         </p>
//                         <p className="font-medium">₹{(item.product_id.price * item.quantity).toLocaleString()}</p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 <Separator />

//                 {/* Price Breakdown */}
//                 <div className="space-y-2">
//                   <div className="flex justify-between">
//                     <span>Subtotal</span>
//                     <span>₹{subtotal.toLocaleString()}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span>Shipping</span>
//                     <span>{shippingCost === 0 ? "Free" : `₹${shippingCost}`}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span>Tax (GST 18%)</span>
//                     <span>₹{tax.toLocaleString()}</span>
//                   </div>
//                   {discount && discount > 0 && (
//                     <div className="flex justify-between text-green-600">
//                       <span>Discount</span>
//                       <span>-₹{discount.toLocaleString()}</span>
//                     </div>
//                   )}
//                   <Separator />
//                   <div className="flex justify-between text-lg font-semibold">
//                     <span>Total</span>
//                     <span>₹{finalTotal.toLocaleString()}</span>
//                   </div>
//                 </div>

//                 {/* Applied Coupon */}
//                 {coupon && (
//                   <div className="p-3 bg-green-50 border border-green-200 rounded-md">
//                     <p className="text-sm text-green-800">
//                       Coupon "{coupon}" applied successfully!
//                     </p>
//                   </div>
//                 )}

//                 {/* Free Shipping Notice */}
//                 {subtotal < 999 && (
//                   <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
//                     <p className="text-sm text-blue-800">
//                       Add ₹{(999 - subtotal).toLocaleString()} more for free shipping!
//                     </p>
//                   </div>
//                 )}

//                 {/* Security Badge */}
//                 <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-md">
//                   <Shield className="h-4 w-4 text-green-600" />
//                   <span className="text-xs text-muted-foreground">
//                     Your payment information is secure and encrypted
//                   </span>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }


"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, CreditCard, MapPin, Truck, AlertCircle, CheckCircle, XCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useCartStore } from "@/stores/cartStore"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import ApiClient from "@/lib/apiCalling"
import { STORE_ID } from "@/data/Consts"
import { useUserStore } from "@/stores/userStore"

// Enhanced validation schema with better error messages
const shippingSchema = z.object({
  firstName: z.string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "First name should only contain letters"),
  lastName: z.string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Last name should only contain letters"),
  email: z.string()
    .email("Please enter a valid email address")
    .max(100, "Email must be less than 100 characters"),
  phone: z.string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be less than 15 digits")
    .regex(/^[0-9+\-\s()]+$/, "Please enter a valid phone number"),
  address: z.string()
    .min(10, "Please provide a detailed address")
    .max(200, "Address must be less than 200 characters"),
  city: z.string()
    .min(2, "City name must be at least 2 characters")
    .max(50, "City name must be less than 50 characters"),
  state: z.string()
    .min(2, "State name must be at least 2 characters")
    .max(50, "State name must be less than 50 characters"),
  pincode: z.string()
    .min(6, "Pincode must be exactly 6 digits")
    .max(6, "Pincode must be exactly 6 digits")
    .regex(/^[0-9]{6}$/, "Please enter a valid 6-digit pincode"),
})

type ShippingForm = z.infer<typeof shippingSchema>

// Types for better error handling
interface PaymentError {
  type: 'network' | 'payment' | 'validation' | 'server' | 'user_cancelled'
  message: string
  details?: string
}

interface OrderStatus {
  status: 'idle' | 'creating_order' | 'processing_payment' | 'completed' | 'failed'
  orderId?: string
  error?: PaymentError
}

// Environment configuration
const RAZORPAY_KEY = process.env.NEXT_PUBLIC_RAZORPAY_KEY || "rzp_test_2TD6bdPgMvp803"

export default function CheckoutPage() {
  const router = useRouter()
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [orderStatus, setOrderStatus] = useState<OrderStatus>({ status: 'idle' })
  const [retryCount, setRetryCount] = useState(0)
  const { items, subtotal, discount, total, fetchCart, clearCart } = useCartStore()
  const { user } = useUserStore()

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch
  } = useForm<ShippingForm>({
    resolver: zodResolver(shippingSchema),
    mode: 'onChange',
    defaultValues: {
      firstName: "",
      lastName: "",
      email: user?.email || "",
      phone: user?.phone_number || "",
      address: "",
      city: "",
      state: "",
      pincode: "",
    },
  })

  // Auto-populate user data when available
  useEffect(() => {
    if (user) {
      setValue('email', user.email || '')
      setValue('phone', user.phone_number || '')
      setValue('firstName', user.name?.split(' ')[0] || '')
      setValue('lastName', user.name?.split(' ').slice(1).join(' ') || '')
    }
  }, [user, setValue])

  // Fetch cart if empty
  useEffect(() => {
    if (items.length === 0) {
      fetchCart()
    }
  }, [fetchCart, items.length])

  // Clear error after 10 seconds
  useEffect(() => {
    if (orderStatus.error) {
      const timer = setTimeout(() => {
        setOrderStatus(prev => ({ ...prev, error: undefined }))
      }, 10000)
      return () => clearTimeout(timer)
    }
  }, [orderStatus.error])

  const setError = useCallback((error: PaymentError) => {
    setOrderStatus(prev => ({
      ...prev,
      status: 'failed',
      error
    }))
  }, [])

  const loadRazorpayScript = useCallback((): Promise<boolean> => {
    return new Promise((resolve) => {
      // Check if Razorpay is already loaded
      if ((window as any).Razorpay) {
        resolve(true)
        return
      }

      const script = document.createElement("script")
      script.src = "https://checkout.razorpay.com/v1/checkout.js"
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }, [])

  const createOrder = async (formData: ShippingForm) => {
    try {
      const apiClient = new ApiClient({
        headers: {
          Authorization: `Bearer ${user?.accessToken}`,
        },
      })

      if (!user?.id) {
        throw new Error("Please log in to continue")
      }

      const shipping_address = {
        street: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        country: "India"
      }

      const result = await apiClient.post(`/storefront/store/${STORE_ID}/orders`, {
        shipping_address,
        billing_address: shipping_address, // Use same as shipping
        payment_method: paymentMethod,
        notes: "",
        use_cart: false,
        items,
        customer_info: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
        }
      }) as any
      console.log(result);

      if (!result.success) {
        throw new Error(result.data.message || "Failed to create order")
      }

      return result.data
    } catch (error: any) {
      console.error('Order creation failed:', error)
      throw error
    }
  }

  const handlePaymentSuccess = async (response: any, orderId: string, payment_id: string) => {
    try {
      // Verify payment on backend
      const apiClient = new ApiClient({
        headers: {
          Authorization: `Bearer ${user?.accessToken}`,
        },
      })

      const res = await apiClient.post(`/storefront/store/${STORE_ID}/payment/callback`, {
        payment_id: payment_id,
        razorpay_payment_id: response.razorpay_payment_id,
        status: "completed",
        transaction_id: response.razorpay_order_id,
        gateway_response: response.razorpay_signature,
      }) as any
      if (res.success) {
        // console.log(res.data.data.order.order_number);

        // Clear cart and redirect
        setOrderStatus({ status: 'completed', orderId })

        // Small delay for UX
        setTimeout(() => {
          console.log(res);

          router.push(`/order-confirmation?orderid=${res.data.data.order.order_number}`)
          clearCart()

        }, 1500)
      } else {
        console.log(res);

      }

    } catch (error: any) {
      console.error('Payment verification failed:', error)
      setError({
        type: 'server',
        message: 'Payment successful but verification failed',
        details: 'Your payment was processed but we couldn\'t verify it. Please contact support.'
      })
    }
  }

  const handlePaymentFailure = (error: any) => {
    console.error('Payment failed:', error)

    let errorMessage = 'Payment failed. Please try again.'
    let errorType: PaymentError['type'] = 'payment'

    switch (error.code) {
      case 'BAD_REQUEST_ERROR':
        errorMessage = 'Invalid payment request. Please check your details.'
        break
      case 'GATEWAY_ERROR':
        errorMessage = 'Payment gateway error. Please try again.'
        break
      case 'NETWORK_ERROR':
        errorMessage = 'Network error. Please check your connection and try again.'
        errorType = 'network'
        break
      case 'SERVER_ERROR':
        errorMessage = 'Server error. Please try again later.'
        errorType = 'server'
        break
      default:
        if (error.description?.includes('cancelled')) {
          errorMessage = 'Payment was cancelled by user.'
          errorType = 'user_cancelled'
        }
    }

    setError({
      type: errorType,
      message: errorMessage,
      details: error.description
    })
  }

  const processPayment = async (orderData: any, formData: ShippingForm) => {
    try {
      setOrderStatus({ status: 'processing_payment' })

      const scriptLoaded = await loadRazorpayScript()
      if (!scriptLoaded) {
        throw new Error("Payment gateway failed to load. Please check your internet connection.")
      }
      const apiClient = new ApiClient({
        headers: {
          Authorization: `Bearer ${user?.accessToken}`,
        },
      })

      const res = await apiClient.post(`/storefront/store/${STORE_ID}/payment/initialize`, {
        order_id: orderData.order.id,
        payment_method: "razorpay",
      }) as any;

      console.log(res.data.data.payment_id);

      if (res.success) {
        const options = {
          key: RAZORPAY_KEY,
          amount: orderData.order.total * 100,
          currency: "INR",
          name: "Dhaneri Store",
          description: `Order Data`,
          order_id: orderData.razorpay_order_id,
          handler: (response: any) => handlePaymentSuccess(response, res.data.data.order_number, res.data.data.payment_id),
          prefill: {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            contact: formData.phone,
          },
          theme: {
            color: "#dc2626", // red-600
          },
          modal: {
            ondismiss: () => {
              setError({
                type: 'user_cancelled',
                message: 'Payment was cancelled',
                details: 'You closed the payment window. Your order is still pending.'
              })
            }
          },
          retry: {
            enabled: true,
            max_count: 3
          },
          // Enhanced error handling
          error: handlePaymentFailure,
        }

        const paymentObject = new (window as any).Razorpay(options)

        // Handle payment modal errors
        paymentObject.on('payment.failed', handlePaymentFailure)

        paymentObject.open()
      } else {
        throw new Error("Payment error")

      }
    } catch (error: any) {
      console.error('Payment processing failed:', error)
      setError({
        type: 'payment',
        message: error.message || 'Failed to process payment',
        details: 'There was an error setting up the payment. Please try again.'
      })
    }
  }

  const processCODOrder = async (formData: ShippingForm) => {
    try {
      setOrderStatus({ status: 'creating_order' })
      const orderData = await createOrder(formData)
      // await handlePaymentSuccess(orderData)
      // For COD, mark as completed immediately
      clearCart()
      setOrderStatus({ status: 'completed', orderId: orderData._id })

      setTimeout(() => {
        router.push(`/order-confirmation/${orderData._id}`)
      }, 1500)
    } catch (error: any) {
      console.error('COD order failed:', error)
      setError({
        type: 'server',
        message: error.message || 'Failed to place order',
        details: 'There was an error creating your order. Please try again.'
      })
    }
  }

  const onSubmit = async (formData: ShippingForm) => {
    try {
      setOrderStatus({ status: 'creating_order' })
      setRetryCount(0)

      if (paymentMethod === "cod") {
        await processCODOrder(formData)
      } else {
        const orderData = await createOrder(formData)
        console.log(orderData.data);

        await processPayment(orderData.data, formData)
      }
    } catch (error: any) {
      console.error('Order submission failed:', error)
      setError({
        type: 'server',
        message: error.message || 'Failed to process order',
        details: 'Please check your details and try again.'
      })
    }
  }

  const handleRetry = () => {
    if (retryCount < 3) {
      setRetryCount(prev => prev + 1)
      setOrderStatus({ status: 'idle' })
    } else {
      setError({
        type: 'server',
        message: 'Maximum retry attempts reached',
        details: 'Please refresh the page or contact support for assistance.'
      })
    }
  }

  const getStatusIcon = () => {
    switch (orderStatus.status) {
      case 'creating_order':
        return <Clock className="animate-spin h-5 w-5 text-blue-500" />
      case 'processing_payment':
        return <CreditCard className="animate-pulse h-5 w-5 text-blue-500" />
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return null
    }
  }

  const getStatusMessage = () => {
    switch (orderStatus.status) {
      case 'creating_order':
        return 'Creating your order...'
      case 'processing_payment':
        return 'Processing payment...'
      case 'completed':
        return 'Order placed successfully!'
      case 'failed':
        return orderStatus.error?.message || 'Something went wrong'
      default:
        return null
    }
  }

  // Empty cart check
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
        <Card className="w-full max-w-md shadow-lg rounded-xl">
          <CardHeader className="bg-red-50 rounded-t-xl">
            <CardTitle className="text-center text-red-700 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 mr-2" />
              Empty Cart
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 text-center space-y-4">
            <p className="text-slate-600">Your cart is empty. Discover our products and add some items to continue.</p>
            <Button
              onClick={() => router.push("/")}
              className="w-full bg-red-600 hover:bg-red-700 rounded-lg py-3"
            >
              Explore Products
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const isProcessing = ['creating_order', 'processing_payment'].includes(orderStatus.status)
  const isCompleted = orderStatus.status === 'completed'

  return (
    <div className="min-h-screen bg-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push("/cart")}
            className="text-slate-700 hover:text-slate-900 font-medium"
            disabled={isProcessing}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Return to Cart
          </Button>
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <div className="text-sm font-semibold text-slate-600 bg-white px-4 py-2 rounded-full shadow-sm">
              {getStatusMessage() || 'Secure & Fast Checkout'}
            </div>
          </div>
        </div>

        {/* Global Error Alert */}
        {orderStatus.error && (
          <Alert variant="destructive" className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="font-semibold">{orderStatus.error.message}</div>
              {orderStatus.error.details && (
                <div className="text-sm mt-1 text-red-600/80">{orderStatus.error.details}</div>
              )}
              {orderStatus.error.type !== 'user_cancelled' && retryCount < 3 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 border-red-300 text-red-600 hover:bg-red-100"
                  onClick={handleRetry}
                >
                  Try Again ({3 - retryCount} attempts left)
                </Button>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Success Message */}
        {isCompleted && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <div className="font-semibold">Order placed successfully!</div>
              <div className="text-sm mt-1">Redirecting to order confirmation...</div>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Main Content - Form */}
          <div className="lg:col-span-3 space-y-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Shipping Card */}
              <Card className="overflow-hidden shadow-lg rounded-xl border-slate-200">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 py-5 px-6">
                  <CardTitle className="flex items-center text-2xl font-bold text-slate-800">
                    <MapPin className="w-6 h-6 mr-3 text-red-600" />
                    Delivery Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 bg-white">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* First Name */}
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-sm font-semibold text-slate-700">
                        First Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="firstName"
                        {...register("firstName")}
                        placeholder="Enter first name"
                        className={`rounded-lg border-slate-300 focus:border-red-500 ${errors.firstName ? 'border-red-300 bg-red-50' : ''
                          }`}
                        disabled={isProcessing}
                      />
                      {errors.firstName && (
                        <Alert variant="destructive" className="mt-1 py-2">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription className="text-xs">{errors.firstName.message}</AlertDescription>
                        </Alert>
                      )}
                    </div>

                    {/* Last Name */}
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-sm font-semibold text-slate-700">
                        Last Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="lastName"
                        {...register("lastName")}
                        placeholder="Enter last name"
                        className={`rounded-lg border-slate-300 focus:border-red-500 ${errors.lastName ? 'border-red-300 bg-red-50' : ''
                          }`}
                        disabled={isProcessing}
                      />
                      {errors.lastName && (
                        <Alert variant="destructive" className="mt-1 py-2">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription className="text-xs">{errors.lastName.message}</AlertDescription>
                        </Alert>
                      )}
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-semibold text-slate-700">
                        Email Address <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        {...register("email")}
                        placeholder="Enter email"
                        className={`rounded-lg border-slate-300 focus:border-red-500 ${errors.email ? 'border-red-300 bg-red-50' : ''
                          }`}
                        disabled={isProcessing}
                      />
                      {errors.email && (
                        <Alert variant="destructive" className="mt-1 py-2">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription className="text-xs">{errors.email.message}</AlertDescription>
                        </Alert>
                      )}
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-semibold text-slate-700">
                        Phone Number <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="phone"
                        {...register("phone")}
                        placeholder="Enter phone number"
                        className={`rounded-lg border-slate-300 focus:border-red-500 ${errors.phone ? 'border-red-300 bg-red-50' : ''
                          }`}
                        disabled={isProcessing}
                      />
                      {errors.phone && (
                        <Alert variant="destructive" className="mt-1 py-2">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription className="text-xs">{errors.phone.message}</AlertDescription>
                        </Alert>
                      )}
                    </div>

                    {/* Address */}
                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor="address" className="text-sm font-semibold text-slate-700">
                        Street Address <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="address"
                        {...register("address")}
                        placeholder="Enter full address with landmark"
                        className={`rounded-lg border-slate-300 focus:border-red-500 ${errors.address ? 'border-red-300 bg-red-50' : ''
                          }`}
                        disabled={isProcessing}
                      />
                      {errors.address && (
                        <Alert variant="destructive" className="mt-1 py-2">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription className="text-xs">{errors.address.message}</AlertDescription>
                        </Alert>
                      )}
                    </div>

                    {/* City */}
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-sm font-semibold text-slate-700">
                        City <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="city"
                        {...register("city")}
                        placeholder="Enter city"
                        className={`rounded-lg border-slate-300 focus:border-red-500 ${errors.city ? 'border-red-300 bg-red-50' : ''
                          }`}
                        disabled={isProcessing}
                      />
                      {errors.city && (
                        <Alert variant="destructive" className="mt-1 py-2">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription className="text-xs">{errors.city.message}</AlertDescription>
                        </Alert>
                      )}
                    </div>

                    {/* State */}
                    <div className="space-y-2">
                      <Label htmlFor="state" className="text-sm font-semibold text-slate-700">
                        State <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="state"
                        {...register("state")}
                        placeholder="Enter state"
                        className={`rounded-lg border-slate-300 focus:border-red-500 ${errors.state ? 'border-red-300 bg-red-50' : ''
                          }`}
                        disabled={isProcessing}
                      />
                      {errors.state && (
                        <Alert variant="destructive" className="mt-1 py-2">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription className="text-xs">{errors.state.message}</AlertDescription>
                        </Alert>
                      )}
                    </div>

                    {/* Pincode */}
                    <div className="space-y-2">
                      <Label htmlFor="pincode" className="text-sm font-semibold text-slate-700">
                        Pincode <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="pincode"
                        {...register("pincode")}
                        placeholder="Enter 6-digit pincode"
                        maxLength={6}
                        className={`rounded-lg border-slate-300 focus:border-red-500 ${errors.pincode ? 'border-red-300 bg-red-50' : ''
                          }`}
                        disabled={isProcessing}
                      />
                      {errors.pincode && (
                        <Alert variant="destructive" className="mt-1 py-2">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription className="text-xs">{errors.pincode.message}</AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Card */}
              <Card className="overflow-hidden shadow-lg rounded-xl border-slate-200">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 py-5 px-6">
                  <CardTitle className="flex items-center text-2xl font-bold text-slate-800">
                    <CreditCard className="w-6 h-6 mr-3 text-red-600" />
                    Payment Options
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 bg-white">
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                    disabled={isProcessing}
                  >
                    {[
                      {
                        value: "card",
                        label: "Pay Now",
                        description: "Credit/Debit Card, UPI, Net Banking",
                        icon: <CreditCard className="w-5 h-5" />
                      },
                      {
                        value: "cod",
                        label: "Cash on Delivery",
                        description: "Pay when you receive your order",
                        icon: <Truck className="w-5 h-5" />
                      }
                    ].map((option) => (
                      <label
                        key={option.value}
                        className={`flex items-start space-x-3 p-4 border rounded-lg cursor-pointer transition-all duration-200 ${paymentMethod === option.value
                          ? "border-red-600 bg-red-50 shadow-md"
                          : "border-slate-300 hover:border-red-500 hover:shadow"
                          } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <RadioGroupItem
                          value={option.value}
                          className="text-red-600 border-slate-400 mt-1"
                          disabled={isProcessing}
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            {option.icon}
                            <span className="font-semibold text-slate-700">
                              {option.label}
                            </span>
                          </div>
                          <p className="text-sm text-slate-500">{option.description}</p>
                        </div>
                      </label>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isProcessing || !isValid || isCompleted}
                className={`w-full font-bold py-6 rounded-lg shadow-lg text-lg transition-all duration-200 ${isCompleted
                  ? 'bg-green-600 hover:bg-green-600'
                  : 'bg-red-600 hover:bg-red-700'
                  } text-white`}
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    {orderStatus.status === 'creating_order' ? 'Creating Order...' : 'Processing Payment...'}
                  </span>
                ) : isCompleted ? (
                  <span className="flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 mr-3" />
                    Order Placed Successfully!
                  </span>
                ) : (
                  <>
                    {paymentMethod === 'cod' ? 'Place Order' : 'Complete Purchase'} • ₹{total.toLocaleString()}
                    <Truck className="w-5 h-5 ml-3" />
                  </>
                )}
              </Button>

              {/* Form validation summary */}
              {Object.keys(errors).length > 0 && !isProcessing && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Please fix the errors above to continue with your order.
                  </AlertDescription>
                </Alert>
              )}
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <Card className="sticky top-24 overflow-hidden shadow-lg rounded-xl border-slate-200">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 py-5 px-6">
                <CardTitle className="text-2xl font-bold text-slate-800">Your Order</CardTitle>
              </CardHeader>
              <CardContent className="p-6 bg-white space-y-6">
                {/* Items List */}
                <div className="space-y-6 max-h-96 overflow-y-auto">
                  {items.map((item: any) => (
                    <div key={item._id} className="flex items-start space-x-4 p-3 border border-slate-100 rounded-lg">
                      <div className="relative">
                        <img
                          src={item.product_id.images?.[0] || 'https://placehold.co/80x80?text=Product'}
                          alt={item.product_id.name}
                          className="w-20 h-20 object-cover rounded-lg shadow-sm"
                          onError={(e) => {
                            e.currentTarget.src = 'https://placehold.co/80x80?text=Product'
                          }}
                        />
                        <div className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-semibold">
                          {item.quantity}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-800 line-clamp-2 mb-2">{item.product_id.name}</h4>
                        <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 mb-2">
                          {item.variant_id?.color && (
                            <p>Color: {item.variant_id.color}</p>
                          )}
                          {item.size_id?.size && (
                            <p>Size: {item.size_id.size}</p>
                          )}
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-slate-600">₹{item.product_id.price.toLocaleString()} each</p>
                          <p className="font-bold text-slate-900">₹{(item.product_id.price * item.quantity).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="border-slate-200" />

                {/* Pricing Breakdown */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal ({items.length} {items.length === 1 ? 'item' : 'items'})</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount Applied</span>
                      <span>-₹{discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-600">
                    <span>Shipping Fee</span>
                    <span className="text-green-600 font-semibold">FREE</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Taxes</span>
                    <span>Included</span>
                  </div>
                  <Separator className="my-2 border-slate-200" />
                  <div className="flex justify-between font-bold text-lg text-slate-900">
                    <span>Grand Total</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                  {paymentMethod === 'cod' && (
                    <p className="text-xs text-slate-500 mt-2 p-2 bg-amber-50 rounded-lg border border-amber-200">
                      <strong>Cash on Delivery:</strong> Please keep exact change ready. Our delivery partner will collect ₹{total.toLocaleString()} when your order arrives.
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700 font-semibold rounded-lg py-3 transition-all duration-200"
                    onClick={() => router.push("/cart")}
                    disabled={isProcessing}
                  >
                    Modify Cart
                  </Button>

                  {/* Security badges */}
                  <div className="flex items-center justify-center space-x-4 pt-4 border-t border-slate-100">
                    <div className="flex items-center space-x-2 text-xs text-slate-500">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>SSL Secured</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-slate-500">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Safe Payment</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Info Cards */}

          </div>
        </div>
      </div>
    </div>
  )
}

