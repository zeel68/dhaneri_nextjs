"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Heart, ShoppingBag, Star, Truck, Shield, RotateCcw, Ruler } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useCart } from "@/lib/cart-context"
import { useWishlist } from "@/lib/wishlist-context"
import { useToast } from "@/hooks/use-toast"
import { useCartStore } from "@/stores/cartStore"
import { useRouter } from "next/navigation"

interface ProductInfoProps {
  product: any
  selectedVariant: any

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

export function ProductInfo({ product }: ProductInfoProps) {
  if (product) {
    product.originalPrice = product.compare_price;
  }
  const router = useRouter();
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);

  const [selectedColor, setSelectedColor] = useState(product?.variants?.colors?.find((c: any) => c.available)?.id || "")
  const [selectedSize, setSelectedSize] = useState<SizeOption>()
  const [quantity, setQuantity] = useState(1)

  const { addToCart, loading, error: cartError } = useCartStore()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const { toast } = useToast()

  const isWishlisted = isInWishlist(product?._id)
  const sizeChart = [
    { size: "XS", bust: "32", waist: "26", hip: "34", length: "40" },
    { size: "S", bust: "34", waist: "28", hip: "36", length: "41" },
    { size: "M", bust: "36", waist: "30", hip: "38", length: "42" },
    { size: "L", bust: "38", waist: "32", hip: "40", length: "43" },
    { size: "XL", bust: "40", waist: "34", hip: "42", length: "44" },
    { size: "XXL", bust: "42", waist: "36", hip: "44", length: "45" },
  ]
  useEffect(() => {
    if (product?.variants) {

      setSelectedVariant(product.variants[0])
    } else {
      console.log(product);

    }
  }, [product])
  const handleAddToCart = async () => {
    console.log(selectedVariant);
    if (!selectedVariant || !selectedSize) {
      toast({
        title: "Selection Required",
        description: "Please select color and size before adding to cart.",
        variant: "destructive",
      })


      return
    }

    // const selectedColorName = product.variants.colors.find((c: any) => c.id === selectedColor)?.name || ""
    // const selectedSizeName = product.variants.sizes.find((s: any) => s.id === selectedSize)?.name || ""

    // for (let i = 0; i < quantity; i++) {
    //   addToCart({
    //     id: `${product.id}-${selectedColor}-${selectedSize}`,
    //     name: product.name,
    //     price: product.price,
    //     originalPrice: product.originalPrice,
    //     image: product.image,
    //     color: selectedColorName,
    //     size: selectedSizeName,
    //     inStock: true,
    //   })
    // }
    await addToCart(
      product._id,
      quantity,
      selectedVariant._id,
      selectedSize?._id
    );
    if (!cartError) {
      toast({
        title: "Added to Cart",
        description: `${product.name} has been added to your cart.`,
      })
      router.push("/cart")
    }

  }

  const handleWishlistToggle = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id)
      toast({
        title: "Removed from Wishlist",
        description: `${product.name} has been removed from your wishlist.`,
      })
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        inStock: true,
      })
      toast({
        title: "Added to Wishlist",
        description: `${product.name} has been added to your wishlist.`,
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Product Title and Rating */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2 text-balance">{product?.name}</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < Math.floor(product?.rating) ? "fill-accent text-accent" : "text-muted-foreground"}`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {product?.rating} ({product?.reviews} reviews)
            </span>
          </div>
          <Badge className="bg-red-600 text-white font-semibold">{Math.round(((product?.compare_price - product?.price) / product?.compare_price) * 100)}% OFF</Badge>
        </div>
      </div>

      {/* Price */}
      <div className="flex items-center gap-3">
        <span className="text-3xl font-bold text-foreground">₹{product?.price}</span>
        <span className="text-xl text-muted-foreground line-through">₹{product?.originalPrice}</span>
        <span className="text-lg text-secondary font-medium">Save ₹{product?.originalPrice - product?.price}</span>
      </div>

      {/* Description */}
      <p className="text-muted-foreground leading-relaxed text-pretty">{product?.description}</p>

      <Separator />

      {/* Color Selection */}

      <div className="space-y-3">
        <h3 className="font-medium text-foreground">
          Color: {product?.variants?.find((c: any) => c._id === selectedColor)?.color || "Select Color"}
        </h3>
        <div className="flex gap-3">
          {product?.variants?.map((color: any) => (
            <button
              key={color._id}
              onClick={() => setSelectedVariant(color)}

              className={`w-10 h-10 rounded-full border-2 transition-all ${selectedColor === color.id
                ? "border-foreground scale-110" :
                "border-border hover:border-muted-foreground"

                }`}
              style={{ backgroundColor: color.color.toLowerCase() }}
              title={color.name}
            />
          ))}
        </div>
      </div>

      {/* Size Selection */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-foreground">Size: {selectedSize?.size || "Select Size"}</h3>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="text-secondary">
                <Ruler className="h-4 w-4 mr-1" />
                Size Guide
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Size Guide</DialogTitle>
              </DialogHeader>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Size</th>
                      <th className="text-left p-2">Bust (inches)</th>
                      <th className="text-left p-2">Waist (inches)</th>
                      <th className="text-left p-2">Hip (inches)</th>
                      <th className="text-left p-2">Length (inches)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sizeChart?.map((size: any) => (
                      <tr key={size.size} className="border-b">
                        <td className="p-2 font-medium">{size.size}</td>
                        <td className="p-2">{size.bust}</td>
                        <td className="p-2">{size.waist}</td>
                        <td className="p-2">{size.hip}</td>
                        <td className="p-2">{size.length}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {selectedVariant?.sizes?.map((size: any) => (
            <Button
              key={size._id}
              variant={selectedSize === size._id ? "default" : "outline"}
              size="sm"
              className={`px-2   transition-all duration-300 ${selectedSize?._id === size._id
                ? 'border-slate-800 bg-primary font-white text-white'
                : 'border-slate-200 hover:border-slate-300'
                }`}
              onClick={() => {
                setSelectedSize(size)
              }}


            >
              {size.size}
            </Button>
          ))}
        </div>
      </div>

      {/* Quantity */}
      <div className="space-y-3">
        <h3 className="font-medium text-foreground">Quantity</h3>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
          >
            -
          </Button>
          <span className="w-12 text-center font-medium">{quantity}</span>
          <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}>
            +
          </Button>
        </div>
      </div>

      <Separator />

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button size="lg" className="w-full bg-secondary hover:bg-secondary/90" onClick={handleAddToCart}>
          <ShoppingBag className="h-5 w-5 mr-2" />
          Add to Cart
        </Button>
        <Button size="lg" variant="outline" className="w-full bg-transparent" onClick={handleWishlistToggle}>
          <Heart className={`h-5 w-5 mr-2 ${isWishlisted ? "fill-current text-red-500" : ""}`} />
          {isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
        </Button>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Truck className="h-4 w-4 text-secondary" />
          <span>Free Shipping</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <RotateCcw className="h-4 w-4 text-secondary" />
          <span>Easy Returns</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Shield className="h-4 w-4 text-secondary" />
          <span>Secure Payment</span>
        </div>
      </div>

      {/* Product Details */}
      <div className="space-y-3">
        <h3 className="font-medium text-foreground">Product Details</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Fabric:</span>
            <span className="text-foreground">{product?.details?.fabric}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Pattern:</span>
            <span className="text-foreground">{product?.details?.pattern}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Sleeves:</span>
            <span className="text-foreground">{product?.details?.sleeves}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Length:</span>
            <span className="text-foreground">{product?.details?.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Neckline:</span>
            <span className="text-foreground">{product?.details?.neckline}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Fit:</span>
            <span className="text-foreground">{product?.details?.fit}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
