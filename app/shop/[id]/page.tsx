"use client"

import { ProductGrid } from "@/components/shop/product-grid"
import { AdvancedFilters } from "@/components/shop/advanced-filters"
import { ShopHeader } from "@/components/shop/shop-header"
import { Suspense, use, useEffect, useState } from "react"
import { useProductStore } from "@/stores/productStore"
import { useCategoryStore } from "@/stores/categoryStore"
import { useUserStore } from "@/stores/userStore"
import { STORE_ID } from "@/data/Consts"
import ApiClient from "@/lib/apiCalling"
import apiClient from "@/lib/apiCalling"

interface ShopPageProps {
  params: {
    id: String
  }
}

interface SizeOption {
  id: string;
  size: string;
  stock: number;
  priceModifier: number;
  sku: string;
}

interface Variant {
  id: string;
  color: string;
  images: string[];
  primaryIndex: number;
  sizes: SizeOption[];
  option: string;
  price: number;
  sku: string;
  stock_quantity: number;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  brand: string;
  sku: string;
  GST: number | null;
  HSNCode: string;
  images: string[];
  variants: Variant[];
  ratings: { average: number; count: number };
  stock: {
    quantity: number;
    reserved: number;
    track_inventory: boolean;
    allow_backorder: boolean;
    low_stock_threshold: number;
  };
  slug: string;
  category: string;
  is_active: boolean;
  tags: string[];
  availableTags: string[];
  reviews: any[];
  createdAt: string;
  updatedAt: string;
}

interface FilterOption {
  name: string;
  type: string;
  options: string[];
  is_required: boolean;
}

interface Category {
  _id: string;
  category_id: string;
  store_id: string;
  slug: string;
  is_primary: boolean;
  products: Product[];
  img_url: string;
  display_name: string;
  description: string;
  sort_order: number;
  is_active: boolean;
  config: {
    filters: FilterOption[];
    attributes: any[];
  };
  createdAt: string;
  updatedAt: string;
}

export default function ShopPage({ params }: ShopPageProps) {
  let param: any;
  let categoryId: string = "";
  const { fetchProducts, fetchFeaturedProducts } = useProductStore()
  const { categories: storeCategories } = useCategoryStore();
  const { startSession } = useUserStore()
  const [categories, setCategories] = useState<Category>();
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>();
  const [filters, setFilters] = useState<FilterOption[]>();
  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => {
    fetchParams();
  }, [])
  const fetchParams = async () => {
    param = await params;
    if (param) {
      categoryId = param.id;
      fetchCategory();
    }
  }
  const fetchCategory = async () => {
    try {

      console.log("api calling", categoryId);

      const response = await apiClient.get(`storefront/store/${STORE_ID}/category/${categoryId}`) as any;

      const categoryData = response.data.data[0] as Category;
      console.log("stored", storeCategories);

      // console.log(response);

      setCategories(categoryData);
      setFilters(categoryData.config.filters)
      setFilters(categoryData.config.filters)
      setProducts(categoryData.products)
    } catch (error) {
      console.error("Error fetching category:", error);
      setError("Failed to load category. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initializeShop = async () => {
      try {
        // Start user session for API calls
        await startSession()

        // Fetch categories and products
        console.log("parma", param as any);

        // await Promise.all([fetchCategories(), fetchProducts(), fetchFeaturedProducts()])
      } catch (error) {
        console.error("Failed to initialize shop:", error)
      }
    }

    initializeShop()
  }, [fetchProducts, fetchFeaturedProducts, startSession])

  return (
    <div className="min-h-screen bg-background">
      <ShopHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Advanced Filters Sidebar */}
          <aside className="lg:w-80 flex-shrink-0">
            <Suspense fallback={<div>Loading filters...</div>}>
              <AdvancedFilters />
            </Suspense>
          </aside>

          {/* Product Grid */}
          <main className="flex-1">
            <Suspense fallback={<div>Loading products...</div>}>
              <ProductGrid products={products} loading={loading} error={error} />
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  )
}
