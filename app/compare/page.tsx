"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, X, ShoppingCart } from "lucide-react"

import { Button } from "@/components/ui/button"
import Header from "../components/header"
import { products } from "../data/products"
import { categories } from "../data/categories"
import { useComparison } from "../context/comparison-context"
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

export default function ComparePage() {
  const { comparisonList, removeFromComparison, clearComparison } = useComparison()
  const { addToCart } = useShopping()
  const [comparisonProducts, setComparisonProducts] = useState<Product[]>([])

  useEffect(() => {
    // Get full product details for comparison
    const productsToCompare = comparisonList.map((id) => products.find((product) => product.id === id)).filter(Boolean)

    setComparisonProducts(productsToCompare)
  }, [comparisonList])

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId)
    return category ? category.name : "Unknown"
  }

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1)
    toast.success("Added to cart")
  }

  if (comparisonProducts.length === 0) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex items-center justify-center flex-1">
          <div className="text-center">
            <h1 className="mb-4 text-2xl font-bold">No products to compare</h1>
            <p className="mb-6 text-gray-600">Add some products to compare them.</p>
            <Link href="/">
              <Button>Browse Products</Button>
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
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-2">
              <Link href="/" className="flex items-center text-sm text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Products
              </Link>
            </div>
            <Button onClick={clearComparison} variant="outline" className="text-red-600 hover:text-red-700">
              Clear All
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="p-4 text-left border-b">Product</th>
                  {comparisonProducts.map((product) => (
                    <th key={product.id} className="p-4 text-left border-b">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">{product.name}</span>
                        <button
                          onClick={() => removeFromComparison(product.id)}
                          className="p-1 text-gray-500 hover:text-gray-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-4 font-medium border-b">Image</td>
                  {comparisonProducts.map((product) => (
                    <td key={product.id} className="p-4 border-b">
                      <div className="relative w-32 h-32">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-medium border-b">Price</td>
                  {comparisonProducts.map((product) => (
                    <td key={product.id} className="p-4 border-b">
                      <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-medium border-b">Category</td>
                  {comparisonProducts.map((product) => (
                    <td key={product.id} className="p-4 border-b">
                      {getCategoryName(product.categoryId)}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-medium border-b">Rating</td>
                  {comparisonProducts.map((product) => (
                    <td key={product.id} className="p-4 border-b">
                      <div className="flex items-center">
                        <div className="flex mr-2">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(product.rating)
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">({product.reviews} reviews)</span>
                      </div>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-medium border-b">Description</td>
                  {comparisonProducts.map((product) => (
                    <td key={product.id} className="p-4 border-b">
                      <p className="text-sm text-gray-600">{product.description}</p>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-medium border-b">Actions</td>
                  {comparisonProducts.map((product) => (
                    <td key={product.id} className="p-4 border-b">
                      <Button
                        onClick={() => handleAddToCart(product)}
                        size="sm"
                        className="w-full"
                        disabled={!product.inStock}
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                      </Button>
                      {!product.inStock && (
                        <div className="mt-2 text-sm text-red-600">Out of Stock</div>
                      )}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}

