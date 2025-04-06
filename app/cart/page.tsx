"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useShopping } from "@/app/context/shopping-context"
import Header from "@/app/components/header"
import { toast } from "sonner"
import { products } from "@/app/data/products"

export default function CartPage() {
  const { cart, updateCartItemQuantity, removeFromCart, clearCart } = useShopping()
  const [total, setTotal] = useState(0)

  useEffect(() => {
    // Calculate total whenever cart changes
    const newTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    setTotal(newTotal)
  }, [cart])

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return
    updateCartItemQuantity(productId, newQuantity)
  }

  const handleRemoveItem = (productId: string) => {
    removeFromCart(productId)
    toast.success("Item removed from cart")
  }

  const handleCheckout = () => {
    // Navigate to the payment page
    window.location.href = "/payment"
  }

  // Get product image based on product data
  const getProductImage = (productId: string): string => {
    const product = products.find(p => p.id === productId)
    if (!product) return "/placeholder.svg"
    
    // If product already has an image, use it
    if (product.image && !product.image.includes('placeholder')) {
      return product.image
    }
    
    // Otherwise, use category-specific images
    switch (product.categoryId) {
      case "1": // Electronics
        return "/images/slideshow/new-electronics.jpg"
      case "2": // Fashion
        return "/images/slideshow/new-fashion.jpg"
      case "3": // Home & Kitchen
        return "/images/slideshow/new-home-kitchen.jpg"
      case "4": // Beauty & Personal Care
        return "/images/slideshow/new-beauty.jpg"
      case "5": // Sports & Outdoors
        return "/images/slideshow/new-sports.jpg"
      default:
        return "/images/slideshow/new-fashion.jpg" // Default image
    }
  }

  if (cart.length === 0) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex flex-col items-center justify-center flex-1 p-4">
          <ShoppingBag className="w-16 h-16 mb-4 text-gray-400" />
          <h1 className="mb-2 text-2xl font-bold">Your cart is empty</h1>
          <p className="mb-6 text-gray-600">Add some items to your cart to see them here.</p>
          <Link href="/">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-12">
        <div className="container px-4 mx-auto">
          <h1 className="mb-8 text-3xl font-bold">Shopping Cart</h1>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center p-4 space-x-4 bg-white rounded-lg shadow"
                  >
                    <div className="relative w-24 h-24 overflow-hidden bg-gray-100 rounded">
                      <Image
                        src={getProductImage(item.id)}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 96px) 100vw, 96px"
                      />
                    </div>

                    <div className="flex-1">
                      <Link href={`/product/${item.id}`}>
                        <h3 className="font-semibold hover:text-primary">{item.name}</h3>
                      </Link>
                      <p className="text-gray-600">${item.price.toFixed(2)}</p>
                      <div className="flex items-center mt-2 space-x-2">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-2 mt-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end mt-6">
                <Button
                  onClick={clearCart}
                  variant="outline"
                  className="text-red-600 hover:text-red-700"
                >
                  Clear Cart
                </Button>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="p-6 bg-white rounded-lg shadow">
                <h2 className="mb-4 text-xl font-semibold">Order Summary</h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${(total * 0.1).toFixed(2)}</span>
                  </div>
                  <div className="pt-4 mt-4 border-t">
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>${(total * 1.1).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleCheckout}
                  className="w-full mt-6"
                >
                  Proceed to Checkout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

