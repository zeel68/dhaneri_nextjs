export interface Product {
  id: string
  name: string
  slug: string
  price: number
  originalPrice?: number
  images: string[]
  category: string
  subcategory: string
  description: string
  features: string[]
  sizes: string[]
  colors: string[]
  rating: number
  reviewCount: number
  inStock: boolean
  isNew?: boolean
  isBestseller?: boolean
  tags: string[]
}

export interface Category {
  id: string
  name: string
  slug: string
  image: string
  description: string
  productCount: number
}

export interface Review {
  id: string
  productId: string
  userId: string
  userName: string
  userAvatar: string
  rating: number
  title: string
  comment: string
  date: string
  verified: boolean
  helpful: number
}

export interface Order {
  id: string
  userId: string
  items: Array<{
    productId: string
    productName: string
    productImage: string
    quantity: number
    price: number
    size: string
    color: string
  }>
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  orderDate: string
  estimatedDelivery: string
  shippingAddress: {
    name: string
    address: string
    city: string
    state: string
    pincode: string
    phone: string
  }
  trackingNumber?: string
}

export interface User {
  id: string
  name: string
  email: string
  avatar: string
  phone: string
  addresses: Array<{
    id: string
    name: string
    address: string
    city: string
    state: string
    pincode: string
    phone: string
    isDefault: boolean
  }>
  orders: string[]
  wishlist: string[]
}

// Mock Products Data
export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Elegant Floral Print Kurti",
    slug: "elegant-floral-print-kurti",
    price: 1299,
    originalPrice: 1899,
    images: [
      "/placeholder.svg?height=600&width=400",
      "/placeholder.svg?height=600&width=400",
      "/placeholder.svg?height=600&width=400",
    ],
    category: "kurtis",
    subcategory: "casual-kurtis",
    description:
      "Beautiful floral print kurti perfect for casual and semi-formal occasions. Made with premium cotton fabric for comfort and style.",
    features: ["Premium Cotton Fabric", "Machine Washable", "Comfortable Fit", "Vibrant Colors"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["Blue", "Pink", "Green", "Yellow"],
    rating: 4.5,
    reviewCount: 128,
    inStock: true,
    isNew: true,
    isBestseller: true,
    tags: ["floral", "cotton", "casual", "comfortable"],
  },
  {
    id: "2",
    name: "Traditional Embroidered Anarkali",
    slug: "traditional-embroidered-anarkali",
    price: 2499,
    originalPrice: 3499,
    images: [
      "/placeholder.svg?height=600&width=400",
      "/placeholder.svg?height=600&width=400",
      "/placeholder.svg?height=600&width=400",
    ],
    category: "anarkalis",
    subcategory: "party-wear",
    description:
      "Stunning embroidered Anarkali dress perfect for weddings and special occasions. Features intricate handwork and premium fabric.",
    features: ["Hand Embroidered", "Premium Georgette", "Full Length", "Party Wear"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Maroon", "Navy Blue", "Emerald Green", "Royal Purple"],
    rating: 4.8,
    reviewCount: 89,
    inStock: true,
    isBestseller: true,
    tags: ["embroidered", "party-wear", "traditional", "georgette"],
  },
  {
    id: "3",
    name: "Contemporary Straight Cut Kurti",
    slug: "contemporary-straight-cut-kurti",
    price: 899,
    originalPrice: 1299,
    images: [
      "/placeholder.svg?height=600&width=400",
      "/placeholder.svg?height=600&width=400",
      "/placeholder.svg?height=600&width=400",
    ],
    category: "kurtis",
    subcategory: "office-wear",
    description:
      "Modern straight cut kurti ideal for office wear and daily use. Combines comfort with contemporary style.",
    features: ["Wrinkle Free", "Office Appropriate", "Easy Care", "Modern Cut"],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "White", "Grey", "Beige"],
    rating: 4.3,
    reviewCount: 156,
    inStock: true,
    tags: ["office-wear", "modern", "straight-cut", "professional"],
  },
  {
    id: "4",
    name: "Festive Silk Saree",
    slug: "festive-silk-saree",
    price: 4999,
    originalPrice: 6999,
    images: [
      "/placeholder.svg?height=600&width=400",
      "/placeholder.svg?height=600&width=400",
      "/placeholder.svg?height=600&width=400",
    ],
    category: "sarees",
    subcategory: "silk-sarees",
    description:
      "Exquisite silk saree perfect for festivals and special occasions. Features traditional motifs and rich colors.",
    features: ["Pure Silk", "Traditional Motifs", "Rich Colors", "Festive Wear"],
    sizes: ["One Size"],
    colors: ["Red", "Gold", "Purple", "Green"],
    rating: 4.7,
    reviewCount: 67,
    inStock: true,
    isNew: true,
    tags: ["silk", "festive", "traditional", "saree"],
  },
  {
    id: "5",
    name: "Casual Cotton Palazzo Set",
    slug: "casual-cotton-palazzo-set",
    price: 1599,
    originalPrice: 2199,
    images: [
      "/placeholder.svg?height=600&width=400",
      "/placeholder.svg?height=600&width=400",
      "/placeholder.svg?height=600&width=400",
    ],
    category: "sets",
    subcategory: "palazzo-sets",
    description:
      "Comfortable cotton palazzo set perfect for casual outings and daily wear. Includes matching kurti and palazzo pants.",
    features: ["100% Cotton", "Matching Set", "Comfortable Fit", "Breathable Fabric"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Mint Green", "Peach", "Lavender", "Coral"],
    rating: 4.4,
    reviewCount: 203,
    inStock: true,
    tags: ["cotton", "palazzo", "set", "casual"],
  },
  {
    id: "6",
    name: "Designer Lehenga Choli",
    slug: "designer-lehenga-choli",
    price: 7999,
    originalPrice: 11999,
    images: [
      "/placeholder.svg?height=600&width=400",
      "/placeholder.svg?height=600&width=400",
      "/placeholder.svg?height=600&width=400",
    ],
    category: "lehengas",
    subcategory: "bridal-wear",
    description:
      "Stunning designer lehenga choli perfect for weddings and grand celebrations. Features heavy embroidery and premium fabric.",
    features: ["Heavy Embroidery", "Designer Piece", "Bridal Wear", "Premium Quality"],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Red", "Pink", "Gold", "Maroon"],
    rating: 4.9,
    reviewCount: 45,
    inStock: true,
    isBestseller: true,
    tags: ["lehenga", "bridal", "designer", "embroidered"],
  },
  {
    id: "7",
    name: "Printed Georgette Saree",
    slug: "printed-georgette-saree",
    price: 1899,
    originalPrice: 2499,
    images: [
      "/placeholder.svg?height=600&width=400",
      "/placeholder.svg?height=600&width=400",
      "/placeholder.svg?height=600&width=400",
    ],
    category: "sarees",
    subcategory: "printed-sarees",
    description:
      "Elegant printed georgette saree perfect for office parties and casual events. Lightweight and comfortable to wear.",
    features: ["Georgette Fabric", "Digital Print", "Lightweight", "Easy Draping"],
    sizes: ["One Size"],
    colors: ["Teal", "Coral", "Navy", "Mustard"],
    rating: 4.2,
    reviewCount: 92,
    inStock: true,
    tags: ["georgette", "printed", "casual", "office-wear"],
  },
  {
    id: "8",
    name: "Embellished Party Kurti",
    slug: "embellished-party-kurti",
    price: 1799,
    originalPrice: 2299,
    images: [
      "/placeholder.svg?height=600&width=400",
      "/placeholder.svg?height=600&width=400",
      "/placeholder.svg?height=600&width=400",
    ],
    category: "kurtis",
    subcategory: "party-wear",
    description:
      "Glamorous embellished kurti perfect for parties and evening events. Features sequin work and contemporary design.",
    features: ["Sequin Embellishment", "Party Wear", "Contemporary Design", "Premium Fabric"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Navy", "Wine", "Emerald"],
    rating: 4.6,
    reviewCount: 74,
    inStock: true,
    isNew: true,
    tags: ["party-wear", "sequins", "embellished", "glamorous"],
  },
  {
    id: "9",
    name: "Cotton Sharara Set",
    slug: "cotton-sharara-set",
    price: 2199,
    originalPrice: 2899,
    images: [
      "/placeholder.svg?height=600&width=400",
      "/placeholder.svg?height=600&width=400",
      "/placeholder.svg?height=600&width=400",
    ],
    category: "sets",
    subcategory: "sharara-sets",
    description:
      "Traditional cotton sharara set perfect for festivals and celebrations. Comfortable and stylish ethnic wear.",
    features: ["Pure Cotton", "Traditional Cut", "Comfortable Fit", "Festival Wear"],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Yellow", "Pink", "Blue", "Orange"],
    rating: 4.4,
    reviewCount: 58,
    inStock: true,
    tags: ["cotton", "sharara", "traditional", "festival"],
  },
  {
    id: "10",
    name: "Chiffon Evening Gown",
    slug: "chiffon-evening-gown",
    price: 3499,
    originalPrice: 4999,
    images: [
      "/placeholder.svg?height=600&width=400",
      "/placeholder.svg?height=600&width=400",
      "/placeholder.svg?height=600&width=400",
    ],
    category: "gowns",
    subcategory: "evening-wear",
    description:
      "Elegant chiffon evening gown perfect for formal events and parties. Features flowing silhouette and sophisticated design.",
    features: ["Chiffon Fabric", "Evening Wear", "Flowing Silhouette", "Formal Design"],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Burgundy", "Navy", "Emerald", "Black"],
    rating: 4.7,
    reviewCount: 36,
    inStock: true,
    isBestseller: true,
    tags: ["chiffon", "gown", "evening-wear", "formal"],
  },
]

// Mock Categories Data
export const mockCategories: Category[] = [
  {
    id: "1",
    name: "Kurtis",
    slug: "kurtis",
    image: "/placeholder.svg?height=300&width=300",
    description: "Elegant kurtis for every occasion",
    productCount: 156,
  },
  {
    id: "2",
    name: "Sarees",
    slug: "sarees",
    image: "/placeholder.svg?height=300&width=300",
    description: "Traditional and contemporary sarees",
    productCount: 89,
  },
  {
    id: "3",
    name: "Anarkalis",
    slug: "anarkalis",
    image: "/placeholder.svg?height=300&width=300",
    description: "Beautiful Anarkali dresses",
    productCount: 67,
  },
  {
    id: "4",
    name: "Lehengas",
    slug: "lehengas",
    image: "/placeholder.svg?height=300&width=300",
    description: "Designer lehengas for special occasions",
    productCount: 34,
  },
  {
    id: "5",
    name: "Sets",
    slug: "sets",
    image: "/placeholder.svg?height=300&width=300",
    description: "Coordinated ethnic wear sets",
    productCount: 78,
  },
  {
    id: "6",
    name: "Gowns",
    slug: "gowns",
    image: "/placeholder.svg?height=300&width=300",
    description: "Elegant gowns for formal events",
    productCount: 36,
  },
  {
    id: "7",
    name: "Kurtis",
    slug: "kurtis",
    image: "/placeholder.svg?height=300&width=300",
    description: "Elegant kurtis for every occasion",
    productCount: 156,
  },
  {
    id: "8",
    name: "Kurtis",
    slug: "kurtis",
    image: "/placeholder.svg?height=300&width=300",
    description: "Elegant kurtis for every occasion",
    productCount: 156,
  },
]

// Mock Reviews Data
export const mockReviews: Review[] = [
  {
    id: "1",
    productId: "1",
    userId: "user1",
    userName: "Priya Sharma",
    userAvatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    title: "Beautiful and comfortable!",
    comment: "Absolutely love this kurti! The fabric is soft and the print is vibrant. Perfect fit and great quality.",
    date: "2024-01-15",
    verified: true,
    helpful: 12,
  },
  {
    id: "2",
    productId: "1",
    userId: "user2",
    userName: "Anita Patel",
    userAvatar: "/placeholder.svg?height=40&width=40",
    rating: 4,
    title: "Good quality",
    comment: "Nice kurti with good fabric quality. The size runs slightly large, so order accordingly.",
    date: "2024-01-10",
    verified: true,
    helpful: 8,
  },
  {
    id: "3",
    productId: "2",
    userId: "user3",
    userName: "Meera Singh",
    userAvatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    title: "Perfect for parties!",
    comment: "Stunning Anarkali! The embroidery work is beautiful and the fit is perfect. Got so many compliments.",
    date: "2024-01-08",
    verified: true,
    helpful: 15,
  },
]

// Mock Orders Data
export const mockOrders: Order[] = [
  {
    id: "ORD001",
    userId: "user1",
    items: [
      {
        productId: "1",
        productName: "Elegant Floral Print Kurti",
        productImage: "/placeholder.svg?height=100&width=100",
        quantity: 1,
        price: 1299,
        size: "M",
        color: "Blue",
      },
      {
        productId: "3",
        productName: "Contemporary Straight Cut Kurti",
        productImage: "/placeholder.svg?height=100&width=100",
        quantity: 2,
        price: 899,
        size: "L",
        color: "Black",
      },
    ],
    total: 3097,
    status: "delivered",
    orderDate: "2024-01-10",
    estimatedDelivery: "2024-01-15",
    trackingNumber: "TRK123456789",
    shippingAddress: {
      name: "Priya Sharma",
      address: "123 MG Road, Sector 15",
      city: "Gurgaon",
      state: "Haryana",
      pincode: "122001",
      phone: "+91 9876543210",
    },
  },
  {
    id: "ORD002",
    userId: "user1",
    items: [
      {
        productId: "2",
        productName: "Traditional Embroidered Anarkali",
        productImage: "/placeholder.svg?height=100&width=100",
        quantity: 1,
        price: 2499,
        size: "M",
        color: "Maroon",
      },
    ],
    total: 2499,
    status: "shipped",
    orderDate: "2024-01-20",
    estimatedDelivery: "2024-01-25",
    trackingNumber: "TRK987654321",
    shippingAddress: {
      name: "Priya Sharma",
      address: "123 MG Road, Sector 15",
      city: "Gurgaon",
      state: "Haryana",
      pincode: "122001",
      phone: "+91 9876543210",
    },
  },
]

// Mock User Data
export const mockUser: User = {
  id: "user1",
  name: "Priya Sharma",
  email: "priya.sharma@example.com",
  avatar: "/placeholder.svg?height=100&width=100",
  phone: "+91 9876543210",
  addresses: [
    {
      id: "addr1",
      name: "Home",
      address: "123 MG Road, Sector 15",
      city: "Gurgaon",
      state: "Haryana",
      pincode: "122001",
      phone: "+91 9876543210",
      isDefault: true,
    },
    {
      id: "addr2",
      name: "Office",
      address: "456 Cyber City, DLF Phase 2",
      city: "Gurgaon",
      state: "Haryana",
      pincode: "122002",
      phone: "+91 9876543210",
      isDefault: false,
    },
  ],
  orders: ["ORD001", "ORD002"],
  wishlist: ["2", "4", "6"],
}

// Helper functions
export const getProductById = (id: string): Product | undefined => {
  return mockProducts.find((product) => product.id === id)
}

export const getProductBySlug = (slug: string): Product | undefined => {
  return mockProducts.find((product) => product.slug === slug)
}

export const getProductsByCategory = (category: string): Product[] => {
  return mockProducts.filter((product) => product.category === category)
}

export const getReviewsByProductId = (productId: string): Review[] => {
  return mockReviews.filter((review) => review.productId === productId)
}

export const getFeaturedProducts = (): Product[] => {
  return mockProducts.filter((product) => product.isBestseller || product.isNew).slice(0, 4)
}

export const getTrendingProducts = (): Product[] => {
  return mockProducts.sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 6)
}

export const searchProducts = (query: string): Product[] => {
  const lowercaseQuery = query.toLowerCase()
  return mockProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(lowercaseQuery) ||
      product.description.toLowerCase().includes(lowercaseQuery) ||
      product.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery)),
  )
}
