"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useShopping } from "@/app/context/shopping-context"
import { toast } from "sonner"

interface Product {
  id: string
  name: string
  price: number
  image: string
  description: string
  rating: number
  reviews: number
  inStock: boolean
  categoryId: string
  featured: boolean
  tags: string[]
}

interface ProductGridProps {
  products: Product[]
}

export default function ProductGrid({ products }: ProductGridProps) {
  const { addToWishlist, removeFromWishlist, addToCart, isInWishlist, isInCart } = useShopping()
  const [wishlistedProducts, setWishlistedProducts] = useState<Set<string>>(new Set())
  const [cartProducts, setCartProducts] = useState<Set<string>>(new Set())

  const handleAddToWishlist = (product: Product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
      setWishlistedProducts((prev) => {
        const next = new Set(prev)
        next.delete(product.id)
        return next
      })
      toast.success("Removed from wishlist")
    } else {
      addToWishlist(product)
      setWishlistedProducts((prev) => {
        const next = new Set(prev)
        next.add(product.id)
        return next
      })
      toast.success("Added to wishlist")
    }
  }

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1)
    setCartProducts((prev) => {
      const next = new Set(prev)
      next.add(product.id)
      return next
    })
    toast.success("Added to cart")
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <div
          key={product.id}
          className="flex flex-col overflow-hidden bg-white rounded-lg shadow group"
        >
          <Link href={`/product/${product.id}`} className="relative block aspect-square">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          <div className="flex flex-col flex-1 p-4">
            <Link href={`/product/${product.id}`} className="flex-1">
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">
                {product.name}
              </h3>
            </Link>

            <div className="flex items-center mt-1">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300 fill-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-600">
                ({product.reviews})
              </span>
            </div>

            <div className="flex items-center justify-between mt-4">
              <span className="text-lg font-bold text-gray-900">
                ${product.price.toFixed(2)}
              </span>

              <div className="flex space-x-2">
                <Button
                  onClick={() => handleAddToWishlist(product)}
                  variant="outline"
                  size="icon"
                  className={`${
                    isInWishlist(product.id)
                      ? "text-red-500 hover:text-red-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Heart
                    className={`w-5 h-5 ${
                      isInWishlist(product.id) ? "fill-current" : ""
                    }`}
                  />
                </Button>

                <Button
                  onClick={() => handleAddToCart(product)}
                  variant={isInCart(product.id) ? "outline" : "default"}
                  size="icon"
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {!product.inStock && (
              <div className="mt-2 text-sm text-red-600">Out of Stock</div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

