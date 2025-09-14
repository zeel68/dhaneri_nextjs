"use client"
import { ProductGallery } from "@/components/product/product-gallery"
import { ProductInfo } from "@/components/product/product-info"
import { ProductTabs } from "@/components/product/product-tabs"
import { RelatedProducts } from "@/components/product/related-products"
import { ProductBreadcrumb } from "@/components/product/product-breadcrumb"
import { useEffect, useRef, useState } from "react"
import ApiClient from "@/lib/apiCalling"

import { useCartStore } from "@/stores/cartStore"
import { useRouter } from "next/navigation"
import { STORE_ID } from "@/data/Consts"

// Mock product data - in real app this would come from API/database
const product = {
  id: 1,
  name: "Embroidered Cotton Kurti",
  price: 1299,
  originalPrice: 1599,
  discount: 19,
  rating: 4.5,
  reviews: 23,
  description:
    "Beautiful embroidered cotton kurti perfect for casual and semi-formal occasions. Features intricate thread work and comfortable fit.",
  images: [
    "/placeholder.svg?height=600&width=500",
    "/placeholder.svg?height=600&width=500",
    "/placeholder.svg?height=600&width=500",
    "/placeholder.svg?height=600&width=500",
  ],
  variants: {
    colors: [
      { id: "black", name: "Black", hex: "#000000", available: true },
      { id: "red", name: "Red", hex: "#DC2626", available: true },
      { id: "blue", name: "Blue", hex: "#2563EB", available: false },
    ],
    sizes: [
      { id: "xs", name: "XS", available: false },
      { id: "s", name: "S", available: true },
      { id: "m", name: "M", available: true },
      { id: "l", name: "L", available: true },
      { id: "xl", name: "XL", available: true },
      { id: "xxl", name: "XXL", available: false },
    ],
  },
  details: {
    fabric: "Cotton",
    pattern: "Embroidered",
    sleeves: "3/4 Sleeves",
    length: "Knee Length",
    neckline: "Round Neck",
    fit: "Regular Fit",
    care: "Machine Wash",
    origin: "Made in India",
  },
  specifications: [
    { label: "Fabric", value: "100% Cotton" },
    { label: "Pattern", value: "Embroidered" },
    { label: "Sleeves", value: "3/4 Sleeves" },
    { label: "Length", value: "Knee Length (42 inches)" },
    { label: "Neckline", value: "Round Neck" },
    { label: "Fit", value: "Regular Fit" },
    { label: "Care Instructions", value: "Machine wash cold, tumble dry low" },
    { label: "Country of Origin", value: "India" },
  ],
  sizeChart: [
    { size: "XS", bust: "32", waist: "26", hip: "34", length: "40" },
    { size: "S", bust: "34", waist: "28", hip: "36", length: "41" },
    { size: "M", bust: "36", waist: "30", hip: "38", length: "42" },
    { size: "L", bust: "38", waist: "32", hip: "40", length: "43" },
    { size: "XL", bust: "40", waist: "34", hip: "42", length: "44" },
    { size: "XXL", bust: "42", waist: "36", hip: "44", length: "45" },
  ],
}

interface SizeOption {
  _id: string;
  size: string;
  stock: number;
  priceModifier: number;
  sku: string;
  attributes: Record<string, any>;
}

interface Variant {
  _id: string;
  color: string;
  images: string[];
  sizes: SizeOption[];
  price: number;
  sku: string;
  stock_quantity: number;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  store_id: {
    _id: string;
    name: string;
    id: string;
  };
  slug: string;
  variants: Variant[];
  images: string[];
  is_active: boolean;
  tags: string[];
  availableTags: string[];
  reviews: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  GST: string | null;
  HSNCode: string;
  brand: string;
  sku: string;
  ratings: {
    average: number;
    count: number;
  };
  stock: {
    quantity: number;
    track_inventory: boolean;
    low_stock_threshold: number;
    allow_backorder: boolean;
    reserved: number;
  };
}
export default function ProductPage({ params }: { params: { slug: string } }) {

  const apiClient = new ApiClient();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [selectedSize, setSelectedSize] = useState<SizeOption | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isZoomed, setIsZoomed] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);
  const { addToCart, loading: cartLoading, error: cartError } = useCartStore();

  const finalPrice = selectedSize
    ? product?.price ?? 0 + selectedSize.priceModifier
    : product?.price || 0;
  useEffect(() => {
    fetchSlug();
  }, [])
  const fetchSlug = async () => {
    const param = await params;
    if (param.slug) {
      // fetch that product
      console.log("Fetching slug", param.slug);
      fetchProduct(param.slug);
    }
  }
  const fetchProduct = async (slug: string) => {
    try {
      setLoading(true);
      const response = await apiClient.get(`storefront/store/${STORE_ID}/products/${slug}`) as any;
      const productData = response.data.data.product;

      setProduct(productData);
      if (productData.variants && productData.variants.length > 0) {
        setSelectedVariant(productData.variants[0]);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      setError("Failed to load product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <ProductBreadcrumb product={{ name: product?.name ?? "" }} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
          <ProductGallery images={product?.images ?? []} productName={product?.name ?? ""} />
          <ProductInfo product={product} selectedVariant={selectedVariant} />
        </div>

        <ProductTabs product={product ?? {}} />
        {/* <RelatedProducts currentProductId={product.id} /> */}
      </div>
    </div>
  )
}
