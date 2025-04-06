"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import Header from "./components/header"
import TrendingSlideshow from "./components/trending-slideshow"
import { useShopping } from "./context/shopping-context"
import { products } from "./data/products"
import { toast } from "sonner"

// Define the Product type
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

export default function Home() {
  const { addToWishlist, addToCart } = useShopping()
  const [featuredProducts] = useState(products.filter((p) => p.featured))

  const handleAddToWishlist = (product: Product) => {
    addToWishlist(product)
    toast.success("Added to wishlist", {
      description: `${product.name} has been added to your wishlist.`,
    })
  }

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1)
    toast.success("Added to cart", {
      description: `${product.name} has been added to your cart.`,
    })
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <TrendingSlideshow />

      <main className="flex-1 flex items-center justify-center">
        <section className="w-full py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="container px-4 mx-auto text-center max-w-3xl">
            <div className="p-8 bg-white rounded-xl shadow-lg border border-gray-100">
              <h1 className="mb-6 text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                Welcome to ShopEasy
              </h1>
              <p className="mb-10 text-xl text-gray-600">
                Discover amazing products at unbeatable prices.
              </p>
              <Link href="/shop">
                <Button size="lg" className="px-8 py-6 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all">
                  Shop Now
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 bg-gray-100">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div>
              <h3 className="mb-4 text-lg font-semibold">Contact Us</h3>
              <p className="text-gray-600">
                123 Shopping Street
                <br />
                New York, NY 10001
                <br />
                United States
              </p>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-semibold">Business Hours</h3>
              <p className="text-gray-600">
                Monday - Friday: 9:00 AM - 8:00 PM
                <br />
                Saturday: 10:00 AM - 6:00 PM
                <br />
                Sunday: Closed
              </p>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-semibold">Follow Us</h3>
              <p className="text-gray-600">
                Facebook: @shopeasy
                <br />
                Instagram: @shopeasy
                <br />
                Twitter: @shopeasy
              </p>
            </div>
          </div>
          <div className="pt-8 mt-8 text-center border-t text-gray-600">
            <p>© 2025 ShopEasy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

