"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart, Star, ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import Header from "@/app/components/header"
import { useShopping } from "@/app/context/shopping-context"
import { products } from "@/app/data/products"
import { toast } from "@/components/ui/use-toast"

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<any>(null)
  const [quantity, setQuantity] = useState(1)
  const { addToWishlist, addToCart, isInWishlist, isInCart } = useShopping()
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isInCartState, setIsInCartState] = useState(false)

  useEffect(() => {
    const productId = parseInt(params.id)
    const foundProduct = products.find((p) => p.id === productId)
    if (foundProduct) {
      setProduct(foundProduct)
      setIsWishlisted(isInWishlist(productId))
      setIsInCartState(isInCart(productId))
    }
  }, [params.id, isInWishlist, isInCart])

  const handleAddToWishlist = () => {
    if (!product) return
    addToWishlist(product)
    setIsWishlisted(true)
    toast({
      title: "Added to wishlist",
      description: `${product.name} has been added to your wishlist.`,
    })
  }

  const handleAddToCart = () => {
    if (!product) return
    addToCart(product)
    setIsInCartState(true)
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  if (!product) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 py-8">
          <div className="container px-4 mx-auto text-center">
            <h1 className="mb-4 text-2xl font-bold">Product not found</h1>
            <Link href="/">
              <Button>Return to Home</Button>
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 py-8">
        <div className="container px-4 mx-auto">
          <div className="flex items-center mb-6 space-x-2">
            <Link href="/" className="flex items-center text-sm text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Products
            </Link>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="relative overflow-hidden rounded-lg">
              <Image
                src={product.image}
                alt={product.name}
                width={600}
                height={600}
                className="object-cover w-full h-auto"
              />
            </div>

            <div>
              <h1 className="mb-2 text-3xl font-bold">{product.name}</h1>
              <div className="flex items-center mb-4">
                <div className="flex mr-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>

              <p className="mb-6 text-2xl font-bold">${product.price.toFixed(2)}</p>
              <p className="mb-6 text-gray-600">{product.description}</p>
              <p className="mb-8 text-gray-600">{product.longDescription}</p>

              <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                <Button
                  size="lg"
                  className="flex-1"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  variant={isWishlisted ? "destructive" : "outline"}
                  size="lg"
                  className="flex-1"
                  onClick={handleAddToWishlist}
                >
                  <Heart className={`w-5 h-5 mr-2 ${isWishlisted ? "fill-current" : ""}`} />
                  {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
                </Button>
              </div>

              <div className="mt-8 pt-8 border-t">
                <h2 className="mb-4 text-xl font-semibold">Product Details</h2>
                <ul className="space-y-2">
                  <li className="flex">
                    <span className="w-24 font-medium">Category:</span>
                    <span className="text-gray-600">Category {product.categoryId}</span>
                  </li>
                  <li className="flex">
                    <span className="w-24 font-medium">Availability:</span>
                    <span className={product.inStock ? "text-green-600" : "text-red-600"}>
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </span>
                  </li>
                  <li className="flex">
                    <span className="w-24 font-medium">Tags:</span>
                    <span className="text-gray-600">{product.tags.join(", ")}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
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