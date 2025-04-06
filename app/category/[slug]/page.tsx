"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Heart, ShoppingCart, ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import Header from "../../components/header"
import { categories } from "../../data/categories"
import { products } from "../../data/products"
import { useShopping } from "@/app/context/shopping-context"
import { toast } from "sonner"

// Define types for our data
interface Category {
  id: string
  name: string
  slug: string
  description: string
  image: string
}

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

export default function CategoryPage() {
  const params = useParams()
  const slug = params.slug as string
  const [category, setCategory] = useState<Category | null>(null)
  const [categoryProducts, setCategoryProducts] = useState<Product[]>([])
  const { addToWishlist, removeFromWishlist, addToCart, isInWishlist, isInCart } = useShopping()

  useEffect(() => {
    // Find the category by slug
    const foundCategory = categories.find((cat) => cat.slug === slug)
    if (foundCategory) {
      // Convert the category to match our interface
      const categoryWithStringId: Category = {
        ...foundCategory,
        id: foundCategory.id.toString(),
      }
      setCategory(categoryWithStringId)

      // Filter products by category
      const filteredProducts = products.filter((product) => product.categoryId === categoryWithStringId.id)
      setCategoryProducts(filteredProducts)
    }
  }, [slug])

  const handleAddToWishlist = (product: Product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
      toast.success("Removed from wishlist")
    } else {
      addToWishlist(product)
      toast.success("Added to wishlist")
    }
  }

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1)
    toast.success("Added to cart")
  }

  // Get category banner image based on category ID
  const getCategoryBannerImage = (categoryId: string): string => {
    switch (categoryId) {
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

  // Get product image based on product data
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

  if (!category) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex items-center justify-center flex-1">
          <div className="text-center">
            <h1 className="mb-4 text-2xl font-bold">Category not found</h1>
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
      <main className="flex-1 py-12">
        <div className="container px-4 mx-auto">
          <div className="relative mb-8 overflow-hidden rounded-lg h-96">
            <Image
              src={getCategoryBannerImage(category.id)}
              alt={category.name}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40">
              <div className="flex flex-col items-center justify-center h-full p-8 text-center text-white">
                <h1 className="mb-4 text-4xl font-bold">{category.name}</h1>
                <p className="max-w-2xl text-lg">{category.description}</p>
              </div>
            </div>
          </div>

          {categoryProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {categoryProducts.map((product) => (
                <div key={product.id} className="overflow-hidden border rounded-lg transition-all hover:shadow-lg">
                  <div className="relative">
                    <Image
                      src={getProductImage(product)}
                      alt={product.name}
                      width={300}
                      height={300}
                      className="object-cover w-full h-64 transition-transform duration-300 hover:scale-105"
                    />
                    <button
                      onClick={() => handleAddToWishlist(product)}
                      className="absolute p-2 bg-white rounded-full top-2 right-2 shadow-md"
                    >
                      <Heart
                        className={`w-5 h-5 ${isInWishlist(product.id) ? "fill-red-500 text-red-500" : "text-gray-500"}`}
                      />
                    </button>
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
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        {isInCart(product.id) ? "In Cart" : "Add to Cart"}
                      </Button>
                    </div>
                    {!product.inStock && (
                      <div className="mt-2 text-sm text-red-600">Out of Stock</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center">
              <p className="text-lg text-gray-600">No products found in this category.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

