"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart, Star, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import Header from "@/app/components/header"
import { useShopping } from "@/app/context/shopping-context"
import { toast } from "sonner"
import { products } from "@/app/data/products"

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, addToCart } = useShopping()

  const handleRemoveFromWishlist = (productId: string) => {
    removeFromWishlist(productId)
    toast.success("Removed from wishlist")
  }

  const handleAddToCart = (product: any) => {
    addToCart(product, 1)
    toast.success("Added to cart")
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

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 py-8">
        <div className="container px-4 mx-auto">
          <h1 className="mb-8 text-3xl font-bold">My Wishlist</h1>

          {wishlist.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h2 className="mb-2 text-xl font-semibold">Your wishlist is empty</h2>
              <p className="mb-6 text-gray-600">Add items that you like to your wishlist.</p>
              <Link href="/">
                <Button>Continue Shopping</Button>
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {wishlist.map((product) => (
                <div
                  key={product.id}
                  className="group overflow-hidden rounded-lg border transition-all hover:shadow-lg"
                >
                  <Link href={`/product/${product.id}`}>
                    <div className="relative h-64">
                      <Image
                        src={getProductImage(product.id)}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  </Link>
                  <div className="p-4">
                    <Link href={`/product/${product.id}`}>
                      <h3 className="mb-2 text-lg font-semibold hover:text-primary">{product.name}</h3>
                    </Link>
                    <div className="mb-4 flex items-center">
                      <span className="mr-2 text-lg font-bold text-primary">
                        ${product.price.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(product.rating)
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="icon"
                          variant="destructive"
                          className="h-8 w-8"
                          onClick={() => handleRemoveFromWishlist(product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleAddToCart(product)}
                        >
                          <ShoppingCart className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="py-6 bg-gray-100">
        <div className="container px-4 mx-auto text-center text-gray-600">
          <p>© 2025 ShopEasy. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

