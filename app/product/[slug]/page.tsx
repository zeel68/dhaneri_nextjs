"use client"
import { ProductGallery } from "@/components/product/product-gallery"
import { ProductInfo } from "@/components/product/product-info"
import { ProductTabs } from "@/components/product/product-tabs"
import { RelatedProducts } from "@/components/product/related-products"
import { ProductBreadcrumb } from "@/components/product/product-breadcrumb"
import { use, useEffect, useState } from "react"
import { useCartStore } from "@/stores/cartStore"
import { useRouter } from "next/navigation"
import { STORE_ID } from "@/data/Consts"
import apiClient from "@/lib/apiCalling"

interface SizeOption {
  _id: string;
  size: string;
  stock: number;
  priceModifier: number;
  sku: string;
  attributes: Record<string, any>[];
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
  const param = use(params as any) as any;
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [selectedSize, setSelectedSize] = useState<SizeOption | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCartStore();

  useEffect(() => {
    fetchProduct(param.slug);
  }, [param.slug]);

  const fetchProduct = async (slug: string) => {
    try {
      setLoading(true);
      const response = await apiClient.get(`storefront/store/${STORE_ID}/products/${slug}`) as any;
      const productData = response.data.data.product;

      setProduct(productData);
      if (productData.variants && productData.variants.length > 0) {
        setSelectedVariant(productData.variants[0]);
        if (productData.variants[0].sizes && productData.variants[0].sizes.length > 0) {
          setSelectedSize(productData.variants[0].sizes[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      setError("Failed to load product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVariantChange = (variant: Variant) => {
    setSelectedVariant(variant);
    if (variant.sizes && variant.sizes.length > 0) {
      setSelectedSize(variant.sizes[0]);
    } else {
      setSelectedSize(null);
    }
  };

  const handleSizeChange = (size: SizeOption) => {
    setSelectedSize(size);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <ProductBreadcrumb product={{ name: product?.name ?? "" }} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
          <ProductGallery
            images={selectedVariant?.images || product?.images || []}
            productName={product?.name ?? ""}
          />
          <ProductInfo
            product={product}
            selectedVariant={selectedVariant}
            selectedSize={selectedSize}
            onVariantChange={handleVariantChange}
            onSizeChange={handleSizeChange}
            quantity={quantity}
            onQuantityChange={setQuantity}
            onAddToCart={() => {
              if (product && selectedVariant && selectedSize) {
                addToCart({
                  productId: product._id,
                  variantId: selectedVariant._id,
                  sizeId: selectedSize._id,
                  quantity,
                  name: product.name,
                  price: product.price + selectedSize.priceModifier,
                  image: selectedVariant.images[0] || product.images[0]
                } as any);
              }
            }}
          />
        </div>

        <ProductTabs
          product={product}
          selectedVariant={selectedVariant}
          selectedSize={selectedSize}
        />
        <RelatedProducts currentProductId={product?._id ?? ""} />
      </div>
    </div>
  );
}