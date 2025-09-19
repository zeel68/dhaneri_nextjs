'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, Heart, User, ChevronDown, ChevronRight, Menu, X, ShoppingBag, MessageCircle, Phone, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';
import { useCategoryStore } from '@/stores/categoryStore';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserStore } from '@/stores/userStore';
import { useCartStore } from '@/stores/cartStore';
import { useRouter } from 'next/navigation';
import LiveChatComponent from './liveChat';
import LoginModal from '../auth/login-form';
import Link from 'next/link';
import { useWishlistStore } from '@/stores/wishlistStore';

// Interfaces for type safety
interface Product {
  _id: string;
  slug: string;
  name: string;
  price: number;
  images?: string[];
  variants?: Array<{
    images: string[];
    primaryIndex: number;
  }>;
  createdAt?: string;
}

interface Subcategory {
  _id: string;
  slug: string;
  display_name: string;
  product_count: number;
  products?: Product[];
}

interface Category {
  _id: string;
  slug: string;
  display_name: string;
  subcategories?: Subcategory[];
  products?: Product[];
}


// Enhanced Mega Menu Component
const MegaMenu = ({ category, isVisible, onMouseEnter, onMouseLeave }: {
  category: Category | null;
  isVisible: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) => {
  const [selectedSub, setSelectedSub] = useState<Subcategory | null>(null);

  if (!isVisible || !category) return null;

  // Get products based on selection
  const getProducts = (cat: Category, sub: Subcategory | null) => {
    return sub ? sub.products || [] : cat.products || [];
  };

  const allProducts = getProducts(category, selectedSub);
  const featuredProducts = allProducts.slice(0, 4);
  const newProducts = allProducts.slice(4, 8);

  return (
    <motion.div
      className="absolute top-full left-0 w-full bg-white shadow-xl border-t border-gray-100 z-50"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2 }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Subcategories */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide border-b pb-2">
              {category.display_name}
            </h3>
            <div className="space-y-3">
              {category.subcategories && category.subcategories.length > 0 ? (
                category.subcategories.map((sub: Subcategory, index: number) => (
                  <motion.a
                    key={sub._id}
                    href={`/shop/${sub.slug}`}
                    className={`flex items-center justify-between py-3 px-4 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 group ${selectedSub?._id === sub._id ? 'bg-blue-50 text-blue-600' : ''}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onMouseEnter={() => setSelectedSub(sub)}
                  >
                    <span className="font-medium capitalize">{sub.display_name}</span>
                    <div className="flex items-center">
                      {sub.product_count > 0 && (
                        <span className="text-xs text-gray-500 mr-2">
                          {sub.product_count}
                        </span>
                      )}
                      <ChevronRight
                        size={16}
                        className="text-gray-400 group-hover:text-blue-500 transition-all duration-300 group-hover:translate-x-1"
                      />
                    </div>
                  </motion.a>
                ))
              ) : (
                <div className="text-gray-500 text-center py-4">
                  No subcategories available
                </div>
              )}
            </div>
          </div>

          {/* Featured Products */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide border-b pb-2">
              Featured Products
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {featuredProducts.length > 0 ? (
                featuredProducts.map((product: Product, index: number) => {
                  const primaryImage = product.images?.[0] ||
                    (product.variants?.[0]?.images?.[product.variants[0].primaryIndex || 0]) ||
                    null;
                  return (
                    <Link key={product._id} href={`/product/${product.slug}`}>
                      <motion.div
                        key={product._id}

                        className="group cursor-pointer transition-all duration-300 hover:shadow-md rounded-lg overflow-hidden bg-white border border-gray-100"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: (index + 6) * 0.1 }}
                      >
                        <div className="w-full h-32 bg-gray-100 mb-2 group-hover:shadow-md transition-all duration-300 flex items-center justify-center overflow-hidden relative">
                          {primaryImage ? (
                            <img
                              src={primaryImage}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                              }}
                            />
                          ) : null}
                          {!primaryImage && (
                            <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center">
                              <div className="w-6 h-6 bg-blue-400 rounded-full"></div>
                            </div>
                          )}
                        </div>
                        <div className="p-2">
                          <p className="text-sm text-gray-800 group-hover:text-blue-600 transition-colors duration-300 font-medium truncate">
                            {product.name}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">₹{product.price}</p>
                        </div>
                      </motion.div>
                    </Link>
                  );
                })
              ) : (
                [1, 2, 3, 4].map((item, index) => (
                  <motion.div
                    key={item}
                    className="group cursor-pointer transition-all duration-300"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (index + 6) * 0.1 }}
                  >
                    <div className="w-full h-32 bg-gray-100 rounded-lg mb-2 flex items-center justify-center">
                      <div className="w-10 h-10 bg-gray-300 rounded-full animate-pulse"></div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* New Arrivals */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide border-b pb-2">
              New Arrivals
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {newProducts.length > 0 ? (
                newProducts.map((product: Product, index: number) => {
                  const primaryImage = product.images?.[0] ||
                    (product.variants?.[0]?.images?.[product.variants[0].primaryIndex || 0]) ||
                    null;
                  return (
                    <motion.a
                      key={product._id}
                      href={`/product/${product.slug}`}
                      className="group cursor-pointer transition-all duration-300 hover:shadow-md rounded-lg overflow-hidden bg-white border border-gray-100 relative"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: (index + 10) * 0.1 }}
                    >
                      <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium z-10">
                        NEW
                      </div>
                      <div className="w-full h-32 bg-gray-100 mb-2 group-hover:shadow-md transition-all duration-300 flex items-center justify-center overflow-hidden relative">
                        {primaryImage ? (
                          <img
                            src={primaryImage}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                        ) : null}
                        {!primaryImage && (
                          <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center">
                            <div className="w-6 h-6 bg-blue-400 rounded-full"></div>
                          </div>
                        )}
                      </div>
                      <div className="p-2">
                        <p className="text-sm text-gray-800 group-hover:text-blue-600 transition-colors duration-300 font-medium truncate">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">₹{product.price}</p>
                      </div>
                    </motion.a>
                  );
                })
              ) : allProducts.length > 0 ? (
                allProducts.slice(0, 4).map((product: Product, index: number) => {
                  const primaryImage = product.images?.[0] ||
                    (product.variants?.[0]?.images?.[product.variants[0].primaryIndex || 0]) ||
                    null;
                  return (
                    <motion.a
                      key={`remaining-${product._id}`}
                      href={`/product/${product.slug}`}
                      className="group cursor-pointer transition-all duration-300 hover:shadow-md rounded-lg overflow-hidden bg-white border border-gray-100"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: (index + 10) * 0.1 }}
                    >
                      <div className="w-full h-32 bg-gray-100 mb-2 group-hover:shadow-md transition-all duration-300 flex items-center justify-center overflow-hidden relative">
                        {primaryImage ? (
                          <img
                            src={primaryImage}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                        ) : null}
                        {!primaryImage && (
                          <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center">
                            <div className="w-6 h-6 bg-blue-400 rounded-full"></div>
                          </div>
                        )}
                      </div>
                      <div className="p-2">
                        <p className="text-sm text-gray-800 group-hover:text-blue-600 transition-colors duration-300 font-medium truncate">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">₹{product.price}</p>
                      </div>
                    </motion.a>
                  );
                })
              ) : (
                [1, 2, 3, 4].map((item, index) => (
                  <motion.div
                    key={item}
                    className="group cursor-pointer transition-all duration-300"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (index + 10) * 0.1 }}
                  >
                    <div className="w-full h-32 bg-gray-100 rounded-lg mb-2 flex items-center justify-center">
                      <div className="w-10 h-10 bg-gray-300 rounded-full animate-pulse"></div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Main Navbar Component
const Navbar = () => {
  const { categories, loading, fetchCategories } = useCategoryStore();
  const { items: cartItems } = useCartStore();
  const { items: wishItems } = useWishlistStore();
  const { user, sessionId, startSession, destorySession, hasHydrated } = useUserStore();
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [showLogin, setShowLogin] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // For initiating the session 
  useEffect(() => {
    if (!hasHydrated) return;

    const init = async () => {
      if (!sessionId) {
        await startSession();
      } else {
        console.log("Existing session:", sessionId);
      }
    };

    init();
  }, [hasHydrated, sessionId, startSession]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCategoryHover = (category: Category) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setActiveCategory(category);
  };

  const handleCategoryLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveCategory(null);
    }, 200);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`search?q=${searchQuery}`);
      setIsSearchExpanded(false);
    }
  };

  return (
    <div className={`w-full bg-white sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'shadow-md' : ''}`}>
      {/* Top Announcement Bar */}
      <div className="bg-primary text-white py-2 px-4 text-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="hidden md:flex items-center mb-2 md:mb-0">
            <Phone size={14} className="mr-2" />
            <span>+91 1234567890</span>
          </div>
          <div className="text-center flex-1 mx-2">
            🎉 Free Shipping on Orders Above ₹999 🎉
          </div>
          <div className="hidden md:flex items-center mb-2 md:mb-0">
            <div className="flex space-x-2">
              <a href="#" className="hover:text-blue-200 transition-colors">
                <Instagram size={14} />
              </a>
              <a href="#" className="hover:text-blue-200 transition-colors">
                <Facebook size={14} />
              </a>
              <a href="#" className="hover:text-blue-200 transition-colors">
                <Twitter size={14} />
              </a>
            </div>
            <div className="flex items-center">
              <MapPin size={14} className="mr-2" />
              <span>Track Order</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0 z-10">
            <Link href="/" className="block">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-wide">
                DHANERI
              </h1>
              {/* <p className="text-xs text-gray-600 tracking-widest text-center">
                                FASHION
                            </p> */}
            </Link>
          </div>

          {/* Desktop Search Bar - Centered */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <form onSubmit={handleSearch} className="w-full relative">
              <input
                type="text"
                placeholder="Search for sarees, lehengas, jewelry..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
              />
              <button
                type="submit"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 p-3 bg-primary rounded-full hover:bg-primary transition-colors duration-300"
              >
                <Search size={18} className="text-white" />
              </button>
            </form>
          </div>

          {/* Right Actions */}
          <div className="flex items-center md:space-x-2">
            {/* Mobile Search Button */}
            <button
              onClick={() => setIsSearchExpanded(!isSearchExpanded)}
              className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Search size={20} className="text-gray-600" />
            </button>

            {/* User Account */}
            {user == null ? (
              <button
                onClick={() => setShowLogin(true)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors hidden md:block"
              >
                <User size={20} className="text-gray-600" />
              </button>
            ) : (
              <Link href={"/profile"}>
                <div className="hidden md:flex items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium">
                    {user.email[0].toUpperCase()}
                  </div>
                </div>
              </Link>
            )}

            {/* Wishlist */}
            <Link href={"/wishlist"}>
              <button className="p-2 rounded-full hover:bg-gray-100 transition-colors relative hidden md:block">
                <Heart size={20} className="text-gray-600" />
                {wishItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                    {wishItems.length}
                  </span>
                )}
              </button>
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="p-2 rounded-full hover:bg-gray-100 transition-colors relative"
            >
              <ShoppingBag size={20} className="text-gray-600" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {cartItems.length}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X size={20} className="text-gray-600" />
              ) : (
                <Menu size={20} className="text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Expanded Mobile Search */}
        {isSearchExpanded && (
          <div className="md:hidden mt-4">
            <form onSubmit={handleSearch} className="w-full relative">
              <input
                type="text"
                placeholder="Search for sarees, lehengas, jewelry..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                autoFocus
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 bg-blue-600 rounded-full hover:bg-blue-700 transition-colors duration-300"
              >
                <Search size={18} className="text-white" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:block border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex items-center justify-center py-3">
            {loading ? (
              <div className="flex space-x-6">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
            ) : (
              categories.map((category, index) => (
                <div
                  key={category._id}
                  className="relative"
                  onMouseEnter={() => handleCategoryHover(category)}
                  onMouseLeave={handleCategoryLeave}
                >
                  <Link
                    href={`/shop/${category.slug}`}
                    className="flex items-center space-x-1 px-4 text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium capitalize group"
                  >
                    <span className="group-hover:scale-105 transition-transform duration-200">{category.display_name}</span>
                    <ChevronDown size={16} className="group-hover:rotate-180 transition-transform duration-200" />
                  </Link>
                </div>
              ))
            )}
          </nav>
        </div>
      </div>

      {/* Mega Menu */}
      <AnimatePresence>
        {activeCategory && (
          <MegaMenu
            category={activeCategory}
            isVisible={!!activeCategory}
            onMouseEnter={() => {
              if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
              }
            }}
            onMouseLeave={handleCategoryLeave}
          />
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="lg:hidden fixed inset-0 bg-white z-50 overflow-y-auto"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                  <h1 className="text-2xl font-bold text-gray-900">DHANERI</h1>
                  {/* <p className="text-xs text-gray-600">FASHION</p> */}
                </Link>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-300"
                >
                  <X size={24} className="text-gray-600" />
                </button>
              </div>

              {/* Mobile Navigation */}
              <div className="space-y-2 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
                {categories.map((category, index) => (
                  <motion.div
                    key={category._id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={`/category/${category.slug}`}
                      className="block  px-4 text-gray-800 hover:bg-blue-50 rounded-lg transition-all duration-300 font-medium capitalize border-l-4 border-transparent hover:border-blue-500"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {category.display_name}
                    </Link>
                    {category.subcategories && category.subcategories.length > 0 && (
                      <div className="ml-6 mt-1 space-y-1">
                        {category.subcategories.map((sub: Subcategory, subIndex: number) => (
                          <Link href={`/shop/${sub.slug}`}>
                            <motion.div
                              key={sub._id}
                              href={`/shop/${sub.slug}`}
                              className="block py-2 px-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300 capitalize text-sm"
                              initial={{ opacity: 0, x: 10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: (index * 0.1) + (subIndex * 0.05) }}
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              {sub.display_name}
                            </motion.div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Mobile Account Actions */}
              <div className="pt-6 border-t border-gray-200 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Link
                    href="/track-order"
                    className="text-center py-3 bg-gray-100 rounded-lg text-gray-700 font-medium hover:bg-gray-200 transition-all duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Track Order
                  </Link>
                  <Link
                    href="/wholesale"
                    className="text-center py-3 bg-gray-100 rounded-lg text-gray-700 font-medium hover:bg-gray-200 transition-all duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Wholesale
                  </Link>
                </div>

                {user ? (
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium">
                      {user.email[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{user.email}</p>
                      <button
                        onClick={() => destorySession()}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setShowLogin(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:bg-blue-700 transition-all duration-300"
                  >
                    Login / Sign Up
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login Modal */}
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
      <LiveChatComponent />
    </div>
  );
};

export default Navbar;