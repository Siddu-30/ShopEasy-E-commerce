"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { Heart, ShoppingCart, Star, ArrowLeft, BarChart2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { products } from "@/app/data/products"
import Header from "@/app/components/header"
import { useComparison } from "@/app/context/comparison-context"
import { Badge } from "@/components/ui/badge"
import { useShopping } from "@/app/context/shopping-context"
import { toast } from "sonner"

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const productId = params.id as string
  const product = products.find((p) => p.id === productId)

  const [quantity, setQuantity] = useState(1)
  const [similarProducts, setSimilarProducts] = useState([])
  const { addToComparison, isInComparison } = useComparison()
  const { 
    addToWishlist, 
    removeFromWishlist, 
    addToCart, 
    isInWishlist, 
    isInCart 
  } = useShopping()
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isInCartState, setIsInCartState] = useState(false)

  useEffect(() => {
    if (product) {
      // Find similar products based on category and tags
      const similar = products
        .filter(
          (p) =>
            p.id !== product.id &&
            (p.categoryId === product.categoryId || p.tags.some((tag) => product.tags.includes(tag))),
        )
        .slice(0, 4) // Limit to 4 similar products

      setSimilarProducts(similar)
      setIsWishlisted(isInWishlist(productId))
      setIsInCartState(isInCart(productId))
    }
  }, [product, isInWishlist, isInCart, productId])

  if (!product) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex flex-col items-center justify-center flex-1">
          <h1 className="mb-4 text-2xl font-bold">Product not found</h1>
          <Link href="/">
            <Button>Return to Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  const updateQuantity = (newQuantity: number) => {
    if (newQuantity < 1) return
    setQuantity(newQuantity)
  }

  const handleCompareWithSimilar = (similarProductId: string) => {
    addToComparison(product.id)
    addToComparison(similarProductId)
    router.push("/compare")
  }

  const handleToggleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(productId)
      setIsWishlisted(false)
      toast.success("Removed from wishlist")
    } else {
      addToWishlist(product)
      setIsWishlisted(true)
      toast.success("Added to wishlist")
    }
  }

  const handleAddToCart = () => {
    addToCart(product, quantity)
    setIsInCartState(true)
    toast.success(`Added ${quantity} ${quantity === 1 ? 'item' : 'items'} to cart`)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 py-12">
        <div className="container px-4 mx-auto">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="overflow-hidden bg-gray-100 rounded-lg flex justify-center items-center">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                width={400}
                height={400}
                className="object-contain max-h-[400px] max-w-full"
              />
            </div>

            <div className="flex flex-col">
              <h1 className="mb-2 text-3xl font-bold">{product.name}</h1>

              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300 fill-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>

              <div className="mb-6 text-2xl font-bold">${product.price.toFixed(2)}</div>

              <p className="mb-6 text-gray-700">{product.longDescription || product.description}</p>

              <div className="mb-4">
                <div className="flex flex-wrap gap-2 mb-4">
                  {product.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <div className="mb-2 font-semibold">Quantity</div>
                <div className="flex items-center border rounded w-fit">
                  <button
                    onClick={() => updateQuantity(quantity - 1)}
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="px-3 py-1">{quantity}</span>
                  <button
                    onClick={() => updateQuantity(quantity + 1)}
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <div className="mb-2 font-semibold">Availability</div>
                <div className={`text-sm ${product.inStock ? "text-green-600" : "text-red-600"}`}>
                  {product.inStock ? "In Stock" : "Out of Stock"}
                </div>
              </div>

              <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
                <Button 
                  onClick={handleAddToCart} 
                  disabled={!product.inStock} 
                  className="flex-1"
                  variant={isInCartState ? "outline" : "default"}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {isInCartState ? "In Cart" : "Add to Cart"}
                </Button>
                <Button
                  onClick={handleToggleWishlist}
                  variant="outline"
                  className="flex-1"
                >
                  <Heart className={`w-5 h-5 mr-2 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
                  {isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                </Button>
              </div>
            </div>
          </div>

          {/* Similar Products Section */}
          {similarProducts.length > 0 && (
            <div className="mt-16">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Similar Products</h2>
                <Link href="/compare" className="text-primary hover:underline">
                  Compare All
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {similarProducts.map((similarProduct) => (
                  <div key={similarProduct.id} className="overflow-hidden border rounded-lg">
                    <div className="relative">
                      <Image
                        src={similarProduct.image || "/placeholder.svg"}
                        alt={similarProduct.name}
                        width={200}
                        height={200}
                        className="object-cover w-full h-48"
                      />
                    </div>
                    <div className="p-4">
                      <Link href={`/product/${similarProduct.id}`}>
                        <h3 className="mb-1 text-lg font-semibold">{similarProduct.name}</h3>
                      </Link>
                      <div className="flex items-center mb-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(similarProduct.rating)
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300 fill-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="ml-1 text-xs text-gray-600">({similarProduct.reviews})</span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-bold">${similarProduct.price.toFixed(2)}</span>
                        <Button onClick={() => handleCompareWithSimilar(similarProduct.id)} variant="outline" size="sm">
                          <BarChart2 className="w-4 h-4 mr-1" />
                          Compare
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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

