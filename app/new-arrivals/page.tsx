"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import Header from "../components/header"
import NewArrivalsSlideshow from "../components/new-arrivals-slideshow"
import { products } from "../data/products"
import { useShopping } from "@/app/context/shopping-context"
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

export default function NewArrivalsPage() {
  // Get the 12 most recent products (assuming products are ordered by date)
  const newArrivals = [...products].sort((a, b) => parseInt(b.id) - parseInt(a.id)).slice(0, 12)
  
  // State for newsletter subscription
  const [email, setEmail] = useState("")
  const [isSubscribing, setIsSubscribing] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const { addToCart } = useShopping()

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubscribing(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setIsSubscribed(true)
      setEmail("")
      toast.success("Successfully subscribed to newsletter!")
    } catch (error) {
      toast.error("Failed to subscribe. Please try again.")
    } finally {
      setIsSubscribing(false)
    }
  }

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1)
    toast.success("Added to cart")
  }
  
  // Map product categories to relevant images
  const getProductImage = (product: Product): string => {
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

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-12">
        <div className="container px-4 mx-auto">
          <h1 className="mb-8 text-3xl font-bold">New Arrivals</h1>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {newArrivals.map((product) => (
              <div key={product.id} className="overflow-hidden border rounded-lg transition-all hover:shadow-lg">
                <div className="relative">
                  <Image
                    src={getProductImage(product)}
                    alt={product.name}
                    width={300}
                    height={300}
                    className="object-cover w-full h-64 transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <Link href={`/product/${product.id}`}>
                    <h3 className="mb-1 text-lg font-semibold hover:text-blue-600 transition-colors">{product.name}</h3>
                  </Link>
                  <p className="mb-2 text-sm text-gray-600 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xl font-bold">${product.price.toFixed(2)}</span>
                    <Button 
                      onClick={() => handleAddToCart(product)} 
                      size="sm" 
                      className="bg-blue-600 hover:bg-blue-700"
                      disabled={!product.inStock}
                    >
                      Add to Cart
                    </Button>
                  </div>
                  {!product.inStock && (
                    <div className="mt-2 text-sm text-red-600">Out of Stock</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Newsletter Section */}
          <div className="max-w-2xl mx-auto mt-16 text-center">
            <h2 className="mb-4 text-2xl font-bold">Stay Updated</h2>
            <p className="mb-6 text-gray-600">
              Subscribe to our newsletter to receive updates about new arrivals, exclusive offers, and more.
            </p>
            {isSubscribed ? (
              <div className="p-4 text-green-600 bg-green-50 rounded-lg">
                <p>Thank you for subscribing to our newsletter!</p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="flex-1 px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button
                  type="submit"
                  disabled={isSubscribing}
                  className="rounded-l-none"
                >
                  {isSubscribing ? "Subscribing..." : "Subscribe"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  )
} 