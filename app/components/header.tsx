"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { 
  ShoppingCart, 
  Heart, 
  Search, 
  Menu, 
  X, 
  BarChart2, 
  Home, 
  Tag, 
  Sparkles, 
  Package, 
  LogIn,
  User,
  Settings,
  LogOut,
  CreditCard,
  History,
  UserPlus,
  LayoutDashboard
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { categories } from "@/app/data/categories"
import { products } from "@/app/data/products"
import { useComparison } from "../context/comparison-context"
import { useShopping } from "../context/shopping-context"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredProducts, setFilteredProducts] = useState([])
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { comparisonList } = useComparison()
  const { wishlist, cart, clearCart, clearWishlist } = useShopping()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<{name: string, email: string} | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [showSearchResults, setShowSearchResults] = useState(false)

  // Check if user is logged in on component mount
  useEffect(() => {
    // Check localStorage for authentication state
    const checkAuth = () => {
      try {
        // Clear any existing auth state on initial load
        if (!localStorage.getItem("authInitialized")) {
          localStorage.removeItem("isLoggedIn")
          localStorage.removeItem("user")
          localStorage.setItem("authInitialized", "true")
        }
        
        const isLoggedInStorage = localStorage.getItem("isLoggedIn") === "true"
        const userStorage = localStorage.getItem("user")
        
        if (isLoggedInStorage && userStorage) {
          setIsLoggedIn(true)
          setUser(JSON.parse(userStorage))
        }
      } catch (error) {
        console.error("Error checking authentication state:", error)
      } finally {
        setIsInitialized(true)
      }
    }
    
    checkAuth()
  }, [])

  // Force re-render when wishlist or cart changes
  useEffect(() => {
    // This empty effect ensures the component re-renders when wishlist or cart changes
  }, [wishlist, cart])

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isSearchOpen])

  // Filter products based on search query
  useEffect(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      const filtered = products.filter(product => 
        product.name.toLowerCase().includes(query) || 
        product.description.toLowerCase().includes(query) ||
        product.tags.some(tag => tag.toLowerCase().includes(query))
      ).slice(0, 5) // Limit to 5 results
      
      setFilteredProducts(filtered)
      setShowSearchResults(true)
    } else {
      setFilteredProducts([])
      setShowSearchResults(false)
    }
  }, [searchQuery])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setIsSearchOpen(false)
      setShowSearchResults(false)
    }
  }

  const handleProductClick = (productId: string) => {
    router.push(`/product/${productId}`)
    setShowSearchResults(false)
    setSearchQuery("")
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUser(null)
    
    // Clear localStorage
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("user")
    
    // Clear cart and wishlist
    clearCart()
    clearWishlist()
    
    router.push("/")
  }

  const handleProfileClick = () => {
    router.push("/user-dashboard")
  }

  return (
    <header className="sticky top-0 z-10 bg-white border-b">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto">
        <div className="flex items-center">
          <button
            className="mr-4 md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <Link href="/" className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            ShopEasy
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="flex items-center text-sm font-medium hover:text-primary">
            <Home className="w-4 h-4 mr-1 text-blue-600" />
            Home
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center text-sm font-medium hover:text-primary">
                <Tag className="w-4 h-4 mr-1 text-purple-600" />
                Categories
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-48">
              {categories.map((category) => (
                <DropdownMenuItem key={category.id} asChild>
                  <Link href={`/category/${category.slug}`}>{category.name}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Link href="/deals" className="flex items-center text-sm font-medium hover:text-primary">
            <Sparkles className="w-4 h-4 mr-1 text-amber-500" />
            Deals
          </Link>
          <Link href="/new-arrivals" className="flex items-center text-sm font-medium hover:text-primary">
            <Package className="w-4 h-4 mr-1 text-green-600" />
            New Arrivals
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          {/* Search toggle for mobile */}
          <button
            className={cn("md:hidden", isSearchOpen ? "text-primary" : "")}
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            aria-label="Toggle search"
          >
            <Search className="w-5 h-5 text-gray-600" />
          </button>

          {/* Desktop search */}
          <div className="relative hidden md:block">
            <form onSubmit={handleSearch} className="relative flex items-center">
              <Input
                type="search"
                placeholder="Search products..."
                className="w-64 pr-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSearchResults(true)}
              />
              <button type="submit" className="absolute right-2" aria-label="Search">
                <Search className="w-4 h-4 text-gray-400" />
              </button>
            </form>
            
            {/* Search results dropdown */}
            {showSearchResults && filteredProducts.length > 0 && (
              <div className="absolute top-full left-0 w-64 mt-1 bg-white border rounded-md shadow-lg z-50">
                <div className="max-h-80 overflow-y-auto">
                  {filteredProducts.map((product) => (
                    <div 
                      key={product.id} 
                      className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleProductClick(product.id)}
                    >
                      <div className="relative w-10 h-10 mr-3 overflow-hidden rounded">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="text-sm font-medium">{product.name}</div>
                        <div className="text-xs text-gray-500">${product.price.toFixed(2)}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-2 border-t">
                  <Link 
                    href={`/search?q=${encodeURIComponent(searchQuery)}`}
                    className="block text-sm text-center text-blue-600 hover:underline"
                    onClick={() => setShowSearchResults(false)}
                  >
                    View all results
                  </Link>
                </div>
              </div>
            )}
          </div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/compare" className="relative">
                  <BarChart2 className="w-6 h-6 text-indigo-600" />
                  {comparisonList.length > 0 && (
                    <span className="absolute top-0 right-0 flex items-center justify-center w-4 h-4 text-xs text-white transform translate-x-1/2 -translate-y-1/2 bg-primary rounded-full">
                      {comparisonList.length}
                    </span>
                  )}
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Compare Products</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/wishlist" className="relative">
                  <Heart className="w-6 h-6 text-red-500" />
                  {wishlist.length > 0 && (
                    <span className="absolute top-0 right-0 flex items-center justify-center w-4 h-4 text-xs text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                      {wishlist.length}
                    </span>
                  )}
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Wishlist ({wishlist.length} items)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/cart" className="relative">
                  <ShoppingCart className="w-6 h-6 text-blue-600" />
                  {cart.length > 0 && (
                    <span className="absolute top-0 right-0 flex items-center justify-center w-4 h-4 text-xs text-white transform translate-x-1/2 -translate-y-1/2 bg-blue-600 rounded-full">
                      {cart.length}
                    </span>
                  )}
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Cart ({cart.length} items)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* User Authentication Section - Only show when initialized */}
          {isInitialized ? (
            isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="relative rounded-full h-9 w-9 bg-gradient-to-r from-blue-100 to-indigo-100 hover:from-blue-200 hover:to-indigo-200"
                    onClick={handleProfileClick}
                  >
                    <User className="w-5 h-5 text-blue-600" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/user-dashboard" className="flex items-center cursor-pointer">
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center cursor-pointer">
                      <User className="w-4 h-4 mr-2" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/orders" className="flex items-center cursor-pointer">
                      <History className="w-4 h-4 mr-2" />
                      <span>Orders</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/payment-methods" className="flex items-center cursor-pointer">
                      <CreditCard className="w-4 h-4 mr-2" />
                      <span>Payment Methods</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="flex items-center cursor-pointer">
                      <Settings className="w-4 h-4 mr-2" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="flex items-center cursor-pointer text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login">
                  <Button variant="outline" size="sm" className="flex items-center">
                    <LogIn className="w-4 h-4 mr-1 text-gray-600" />
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="default" size="sm" className="flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                    <UserPlus className="w-4 h-4 mr-1" />
                    Register
                  </Button>
                </Link>
              </div>
            )
          ) : (
            <div className="h-9 w-9"></div> // Placeholder while initializing
          )}
        </div>
      </div>

      {/* Mobile search bar */}
      {isSearchOpen && (
        <div className="border-t md:hidden">
          <div className="container px-4 py-2 mx-auto">
            <div className="relative">
              <form onSubmit={handleSearch}>
                <Input
                  ref={searchInputRef}
                  type="search"
                  placeholder="Search products..."
                  className="w-full pr-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowSearchResults(true)}
                />
                <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2" aria-label="Search">
                  <Search className="w-4 h-4 text-gray-400" />
                </button>
              </form>
              
              {/* Mobile search results dropdown */}
              {showSearchResults && filteredProducts.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-md shadow-lg z-50">
                  <div className="max-h-80 overflow-y-auto">
                    {filteredProducts.map((product) => (
                      <div 
                        key={product.id} 
                        className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleProductClick(product.id)}
                      >
                        <div className="relative w-10 h-10 mr-3 overflow-hidden rounded">
                          <Image
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            width={40}
                            height={40}
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div className="text-sm font-medium">{product.name}</div>
                          <div className="text-xs text-gray-500">${product.price.toFixed(2)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-2 border-t">
                    <Link 
                      href={`/search?q=${encodeURIComponent(searchQuery)}`}
                      className="block text-sm text-center text-blue-600 hover:underline"
                      onClick={() => setShowSearchResults(false)}
                    >
                      View all results
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <nav className="border-t md:hidden">
          <div className="container px-4 py-4 mx-auto space-y-4">
            <Link href="/" className="flex items-center text-sm font-medium" onClick={() => setIsMobileMenuOpen(false)}>
              <Home className="w-4 h-4 mr-2 text-blue-600" />
              Home
            </Link>
            <div className="space-y-2">
              <p className="flex items-center text-sm font-medium">
                <Tag className="w-4 h-4 mr-2 text-purple-600" />
                Categories
              </p>
              <div className="pl-6 space-y-2">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/category/${category.slug}`}
                    className="block text-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
            <Link href="/deals" className="flex items-center text-sm font-medium" onClick={() => setIsMobileMenuOpen(false)}>
              <Sparkles className="w-4 h-4 mr-2 text-amber-500" />
              Deals
            </Link>
            <Link href="/new-arrivals" className="flex items-center text-sm font-medium" onClick={() => setIsMobileMenuOpen(false)}>
              <Package className="w-4 h-4 mr-2 text-green-600" />
              New Arrivals
            </Link>
            <Link href="/compare" className="flex items-center text-sm font-medium" onClick={() => setIsMobileMenuOpen(false)}>
              <BarChart2 className="w-4 h-4 mr-2 text-indigo-600" />
              Compare Products
              {comparisonList.length > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-primary text-white rounded-full">
                  {comparisonList.length}
                </span>
              )}
            </Link>
            <Link href="/wishlist" className="flex items-center text-sm font-medium" onClick={() => setIsMobileMenuOpen(false)}>
              <Heart className="w-4 h-4 mr-2 text-red-500" />
              Wishlist
              {wishlist.length > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">
                  {wishlist.length}
                </span>
              )}
            </Link>
            <Link href="/cart" className="flex items-center text-sm font-medium" onClick={() => setIsMobileMenuOpen(false)}>
              <ShoppingCart className="w-4 h-4 mr-2 text-blue-600" />
              Cart
              {cart.length > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-blue-600 text-white rounded-full">
                  {cart.length}
                </span>
              )}
            </Link>
            {isInitialized && (
              isLoggedIn ? (
                <>
                  <div className="pt-2 border-t">
                    <p className="mb-2 text-sm font-medium">Account</p>
                    <div className="pl-4 space-y-2">
                      <Link href="/user-dashboard" className="flex items-center text-sm" onClick={() => setIsMobileMenuOpen(false)}>
                        <LayoutDashboard className="w-4 h-4 mr-2 text-gray-600" />
                        Dashboard
                      </Link>
                      <Link href="/profile" className="flex items-center text-sm" onClick={() => setIsMobileMenuOpen(false)}>
                        <User className="w-4 h-4 mr-2 text-gray-600" />
                        Profile
                      </Link>
                      <Link href="/orders" className="flex items-center text-sm" onClick={() => setIsMobileMenuOpen(false)}>
                        <History className="w-4 h-4 mr-2 text-gray-600" />
                        Orders
                      </Link>
                      <Link href="/payment-methods" className="flex items-center text-sm" onClick={() => setIsMobileMenuOpen(false)}>
                        <CreditCard className="w-4 h-4 mr-2 text-gray-600" />
                        Payment Methods
                      </Link>
                      <Link href="/settings" className="flex items-center text-sm" onClick={() => setIsMobileMenuOpen(false)}>
                        <Settings className="w-4 h-4 mr-2 text-gray-600" />
                        Settings
                      </Link>
                      <button onClick={handleLogout} className="flex items-center text-sm text-red-600" onClick={() => setIsMobileMenuOpen(false)}>
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="pt-2 border-t">
                  <p className="mb-2 text-sm font-medium">Account</p>
                  <div className="pl-4 space-y-2">
                    <Link href="/login" className="flex items-center text-sm" onClick={() => setIsMobileMenuOpen(false)}>
                      <LogIn className="w-4 h-4 mr-2 text-gray-600" />
                      Login
                    </Link>
                    <Link href="/register" className="flex items-center text-sm" onClick={() => setIsMobileMenuOpen(false)}>
                      <UserPlus className="w-4 h-4 mr-2 text-gray-600" />
                      Register
                    </Link>
                  </div>
                </div>
              )
            )}
          </div>
        </nav>
      )}
    </header>
  )
}

