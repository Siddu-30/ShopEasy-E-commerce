"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, CreditCard, Lock, Truck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useShopping } from "@/app/context/shopping-context"
import Header from "@/app/components/header"
import { toast } from "sonner"
import { products } from "@/app/data/products"

// Payment method options
const PAYMENT_METHODS = [
  { id: "credit-card", name: "Credit Card", icon: <CreditCard className="w-5 h-5" /> },
  { id: "paypal", name: "PayPal", icon: <Image src="/images/paypal.svg" alt="PayPal" width={20} height={20} /> },
  { id: "apple-pay", name: "Apple Pay", icon: <Image src="/images/apple-pay.svg" alt="Apple Pay" width={20} height={20} /> },
  { id: "google-pay", name: "Google Pay", icon: <Image src="/images/google-pay.svg" alt="Google Pay" width={20} height={20} /> },
]

export default function PaymentPage() {
  const { cart, clearCart } = useShopping()
  const [total, setTotal] = useState(0)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("credit-card")
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    // Calculate total whenever cart changes
    const newTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    setTotal(newTotal)
  }, [cart])

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

  const handlePaymentMethodChange = (methodId: string) => {
    setSelectedPaymentMethod(methodId)
  }

  const handlePlaceOrder = () => {
    setIsProcessing(true)
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)
      clearCart()
      toast.success("Order placed successfully!")
      // Redirect to order confirmation page
      window.location.href = "/order-confirmation"
    }, 2000)
  }

  if (cart.length === 0) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex flex-col items-center justify-center flex-1 p-4">
          <h1 className="mb-2 text-2xl font-bold">Your cart is empty</h1>
          <p className="mb-6 text-gray-600">Add some items to your cart to proceed to checkout.</p>
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
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Checkout</h1>
            <Link href="/cart" className="flex items-center text-sm text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Cart
            </Link>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              {/* Order Summary */}
              <div className="p-6 mb-6 bg-white rounded-lg shadow">
                <h2 className="mb-4 text-xl font-semibold">Order Summary</h2>
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4">
                      <div className="relative w-16 h-16 overflow-hidden bg-gray-100 rounded">
                        <Image
                          src={getProductImage(item.id)}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 64px) 100vw, 64px"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Methods */}
              <div className="p-6 bg-white rounded-lg shadow">
                <h2 className="mb-4 text-xl font-semibold">Payment Method</h2>
                <div className="space-y-3">
                  {PAYMENT_METHODS.map((method) => (
                    <div
                      key={method.id}
                      className={`flex items-center p-4 border rounded-lg cursor-pointer ${
                        selectedPaymentMethod === method.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => handlePaymentMethodChange(method.id)}
                    >
                      <div className="flex items-center justify-center w-10 h-10 mr-4 bg-white rounded-full">
                        {method.icon}
                      </div>
                      <span className="font-medium">{method.name}</span>
                      {selectedPaymentMethod === method.id && (
                        <div className="ml-auto">
                          <div className="w-5 h-5 border-2 border-blue-500 rounded-full flex items-center justify-center">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="p-6 bg-white rounded-lg shadow">
                <h2 className="mb-4 text-xl font-semibold">Order Total</h2>
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

                <div className="flex items-center mt-4 text-sm text-gray-600">
                  <Lock className="w-4 h-4 mr-2" />
                  <span>Secure checkout</span>
                </div>

                <Button
                  onClick={handlePlaceOrder}
                  className="w-full mt-6"
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : "Place Order"}
                </Button>

                <div className="flex items-center justify-center mt-4 text-sm text-gray-600">
                  <Truck className="w-4 h-4 mr-2" />
                  <span>Free shipping on orders over $50</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 