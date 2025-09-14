import ApiClient from "./apiCalling"
import { STORE_ID } from "@/data/Consts"

const apiClient = new ApiClient()

// Wishlist API functions
export const wishlistApi = {
  getWishlist: async () => {
    const sessionId = localStorage.getItem("sessionId")
    const apiClientWithSession = new ApiClient({
      headers: {
        "x-session-id": sessionId,
      },
    })

    return await apiClientWithSession.get(`/storefront/store/${STORE_ID}/wishlist`)
  },

  addToWishlist: async (productId: string) => {
    const sessionId = localStorage.getItem("sessionId")
    const apiClientWithSession = new ApiClient({
      headers: {
        "x-session-id": sessionId,
      },
    })

    return await apiClientWithSession.post(`/storefront/store/${STORE_ID}/wishlist/add`, {
      product_id: productId,
    })
  },

  removeFromWishlist: async (productId: string) => {
    const sessionId = localStorage.getItem("sessionId")
    const apiClientWithSession = new ApiClient({
      headers: {
        "x-session-id": sessionId,
      },
    })

    return await apiClientWithSession.delete(`/storefront/store/${STORE_ID}/wishlist/remove`, {
      product_id: productId,
    })
  },

  clearWishlist: async () => {
    const sessionId = localStorage.getItem("sessionId")
    const apiClientWithSession = new ApiClient({
      headers: {
        "x-session-id": sessionId,
      },
    })

    return await apiClientWithSession.delete(`/storefront/store/${STORE_ID}/wishlist/clear`)
  },
}

// Cart API functions
export const cartApi = {
  getCart: async () => {
    const sessionId = localStorage.getItem("sessionId")
    const apiClientWithSession = new ApiClient({
      headers: {
        "x-session-id": sessionId,
      },
    })

    return await apiClientWithSession.get(`/storefront/store/${STORE_ID}/cart`)
  },

  addToCart: async (productId: string, quantity = 1, variantId?: string, sizeId?: string) => {
    const sessionId = localStorage.getItem("sessionId")
    const apiClientWithSession = new ApiClient({
      headers: {
        "x-session-id": sessionId,
      },
    })

    return await apiClientWithSession.post(`/storefront/store/${STORE_ID}/cart/add`, {
      product_id: productId,
      quantity,
      variant_id: variantId,
      size_id: sizeId,
    })
  },

  updateCartItem: async (productId: string, quantity: number, variantId?: string, sizeId?: string) => {
    const sessionId = localStorage.getItem("sessionId")
    const apiClientWithSession = new ApiClient({
      headers: {
        "x-session-id": sessionId,
      },
    })

    return await apiClientWithSession.put(`/storefront/store/${STORE_ID}/cart/update`, {
      product_id: productId,
      quantity,
      variant_id: variantId,
      size_id: sizeId,
    })
  },

  removeCartItem: async (productId: string, variantId?: string) => {
    const sessionId = localStorage.getItem("sessionId")
    const apiClientWithSession = new ApiClient({
      headers: {
        "x-session-id": sessionId,
      },
    })

    return await apiClientWithSession.delete(`/storefront/store/${STORE_ID}/cart/remove`, {
      product_id: productId,
      variant_id: variantId,
    })
  },

  clearCart: async () => {
    const sessionId = localStorage.getItem("sessionId")
    const apiClientWithSession = new ApiClient({
      headers: {
        "x-session-id": sessionId,
      },
    })

    return await apiClientWithSession.delete(`/storefront/store/${STORE_ID}/cart/clear`)
  },

  applyCoupon: async (cartId: string, couponCode: string) => {
    const sessionId = localStorage.getItem("sessionId")
    const apiClientWithSession = new ApiClient({
      headers: {
        "x-session-id": sessionId,
      },
    })

    return await apiClientWithSession.post(`/storefront/store/${STORE_ID}/cart/coupon`, {
      cart_id: cartId,
      coupon_code: couponCode,
    })
  },

  removeCoupon: async () => {
    const sessionId = localStorage.getItem("sessionId")
    const apiClientWithSession = new ApiClient({
      headers: {
        "x-session-id": sessionId,
      },
    })

    return await apiClientWithSession.delete(`/storefront/store/${STORE_ID}/cart/coupon`)
  },
}

// Order API functions
export const orderApi = {
  getOrders: async (page = 1, limit = 10) => {
    const accessToken = localStorage.getItem("authToken")
    const apiClientWithAuth = new ApiClient({
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    return await apiClientWithAuth.get(`/storefront/store/${STORE_ID}/orders?page=${page}&limit=${limit}`)
  },

  getOrderDetails: async (orderId: string) => {
    const accessToken = localStorage.getItem("authToken")
    const apiClientWithAuth = new ApiClient({
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    return await apiClientWithAuth.get(`/storefront/store/${STORE_ID}/orders/${orderId}`)
  },

  createOrder: async (orderData: any) => {
    const accessToken = localStorage.getItem("authToken")
    const sessionId = localStorage.getItem("sessionId")
    const apiClientWithAuth = new ApiClient({
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "x-session-id": sessionId,
      },
    })

    return await apiClientWithAuth.post(`/storefront/store/${STORE_ID}/orders`, orderData)
  },

  cancelOrder: async (orderId: string, reason?: string) => {
    const accessToken = localStorage.getItem("authToken")
    const apiClientWithAuth = new ApiClient({
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    return await apiClientWithAuth.post(`/storefront/store/${STORE_ID}/orders/${orderId}/cancel`, {
      reason,
    })
  },

  trackOrder: async (orderNumber: string) => {
    const apiClientPublic = new ApiClient()

    return await apiClientPublic.get(`/storefront/store/${STORE_ID}/orders/track/${orderNumber}`)
  },

  requestReturn: async (orderId: string, returnData: any) => {
    const accessToken = localStorage.getItem("authToken")
    const apiClientWithAuth = new ApiClient({
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    return await apiClientWithAuth.post(`/storefront/store/${STORE_ID}/orders/${orderId}/return`, returnData)
  },
}
