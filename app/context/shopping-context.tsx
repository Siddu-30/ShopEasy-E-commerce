"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { toast } from "sonner"

interface Product {
  id: string
  name: string
  price: number
  image: string
  description: string
  longDescription: string
  rating: number
  reviews: number
  inStock: boolean
  categoryId: string
  featured: boolean
  tags: string[]
}

interface CartItem extends Product {
  quantity: number
}

interface ShoppingContextType {
  wishlist: Product[]
  cart: CartItem[]
  addToWishlist: (product: Product) => void
  removeFromWishlist: (productId: string) => void
  addToCart: (product: Product, quantity?: number) => void
  removeFromCart: (productId: string) => void
  updateCartItemQuantity: (productId: string, quantity: number) => void
  isInWishlist: (productId: string) => boolean
  isInCart: (productId: string) => boolean
  getCartTotal: () => number
  clearCart: () => void
  clearWishlist: () => void
}

const ShoppingContext = createContext<ShoppingContextType | undefined>(undefined)

export function ShoppingProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  // Load data from localStorage on initial render
  useEffect(() => {
    try {
      const savedWishlist = localStorage.getItem("wishlist")
      const savedCart = localStorage.getItem("cart")

      if (savedWishlist) {
        setWishlist(JSON.parse(savedWishlist))
      }
      if (savedCart) {
        setCart(JSON.parse(savedCart))
      }
    } catch (error) {
      console.error("Error loading shopping data from localStorage:", error)
    } finally {
      setIsInitialized(true)
    }
  }, [])

  // Save data to localStorage whenever wishlist or cart changes
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem("wishlist", JSON.stringify(wishlist))
        localStorage.setItem("cart", JSON.stringify(cart))
      } catch (error) {
        console.error("Error saving shopping data to localStorage:", error)
      }
    }
  }, [wishlist, cart, isInitialized])

  const addToWishlist = (product: Product) => {
    setWishlist((prev) => {
      if (prev.some((item) => item.id === product.id)) {
        return prev
      }
      return [...prev, product]
    })
    toast.success("Added to wishlist")
  }

  const removeFromWishlist = (productId: string) => {
    setWishlist((prev) => prev.filter((item) => item.id !== productId))
    toast.success("Removed from wishlist")
  }

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart((prev) => {
      const existingItem = prev.find((item) => item.id === product.id)
      if (existingItem) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      return [...prev, { ...product, quantity }]
    })
    toast.success("Added to cart")
  }

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== productId))
    toast.success("Removed from cart")
  }

  const updateCartItemQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(productId)
      return
    }

    setCart((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    )
  }

  const isInWishlist = (productId: string) => {
    return wishlist.some((item) => item.id === productId)
  }

  const isInCart = (productId: string) => {
    return cart.some((item) => item.id === productId)
  }

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const clearCart = () => {
    setCart([])
    toast.success("Cart cleared")
  }

  const clearWishlist = () => {
    setWishlist([])
    toast.success("Wishlist cleared")
  }

  return (
    <ShoppingContext.Provider
      value={{
        wishlist,
        cart,
        addToWishlist,
        removeFromWishlist,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        isInWishlist,
        isInCart,
        getCartTotal,
        clearCart,
        clearWishlist,
      }}
    >
      {children}
    </ShoppingContext.Provider>
  )
}

export function useShopping() {
  const context = useContext(ShoppingContext)
  if (context === undefined) {
    throw new Error("useShopping must be used within a ShoppingProvider")
  }
  return context
} 