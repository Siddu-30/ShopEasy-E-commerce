"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart, SearchIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Header from "../components/header"
import { products } from "../data/products"
import { useToast } from "@/hooks/use-toast"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const [searchResults, setSearchResults] = useState([])
  const [wishlist, setWishlist] = useState<number[]>([])
  const [searchQuery, setSearchQuery] = useState(query)
  const { toast } = useToast()

  useEffect(() => {
    if (query) {
      performSearch(query)
    }
    setSearchQuery(query)
  }, [query])

  const performSearch = (searchTerm: string) => {
    const lowercaseQuery = searchTerm.toLowerCase()

    // Search in product name, description, and tags
    const results = products.filter((product) => {
      const nameMatch = product.name.toLowerCase().includes(lowercaseQuery)
      const descriptionMatch = product.description.toLowerCase().includes(lowercaseQuery)
      const tagsMatch = product.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery))

      return nameMatch || descriptionMatch || tagsMatch
    })

    setSearchResults(results)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      performSearch(searchQuery)

      // Update URL without full page reload
      const url = new URL(window.location.href)
      url.searchParams.set("q", searchQuery)
      window.history.pushState({}, "", url.toString())
    }
  }

  const toggleWishlist = (productId: number) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId)
      } else {
        toast({
          title: "Added to wishlist",
          description: "Product has been added to your wishlist",
        })
        return [...prev, productId]
      }
    })
  }

  const addToCart = (productId: number) => {
    toast({
      title: "Added to cart",
      description: "Product has been added to your cart",
    })
  }

  const highlightText = (text: string, query: string) => {
    if (!query) return text

    const parts = text.split(new RegExp(`(${query})`, "gi"))
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={index} className="bg-yellow-100">
          {part}
        </span>
      ) : (
        part
      ),
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 py-8">
        <div className="container px-4 mx-auto">
          <div className="mb-8">
            <h1 className="mb-4 text-2xl font-bold">Search Results</h1>
            <form onSubmit={handleSearch} className="flex w-full max-w-lg gap-2">
              <Input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button type="submit">
                <SearchIcon className="w-4 h-4 mr-2" />
                Search
              </Button>
            </form>
          </div>

          {query && (
            <p className="mb-6 text-gray-600">
              {searchResults.length === 0
                ? `No results found for "${query}"`
                : `Found ${searchResults.length} results for "${query}"`}
            </p>
          )}

          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {searchResults.map((product) => (
                <div key={product.id} className="overflow-hidden border rounded-lg">
                  <div className="relative">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      width={300}
                      height={300}
                      className="object-cover w-full h-64"
                    />
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className="absolute p-2 bg-white rounded-full top-2 right-2"
                    >
                      <Heart
                        className={`w-5 h-5 ${wishlist.includes(product.id) ? "fill-red-500 text-red-500" : "text-gray-500"}`}
                      />
                    </button>
                  </div>
                  <div className="p-4">
                    <Link href={`/product/${product.id}`}>
                      <h3 className="mb-1 text-lg font-semibold">{highlightText(product.name, query)}</h3>
                    </Link>
                    <p className="mb-2 text-sm text-gray-600">{highlightText(product.description, query)}</p>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-xl font-bold">${product.price}</span>
                      <Button onClick={() => addToCart(product.id)} size="sm">
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : query ? (
            <div className="py-12 text-center">
              <SearchIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h2 className="mb-2 text-xl font-semibold">No results found</h2>
              <p className="mb-6 text-gray-500">
                We couldn't find any products matching "{query}". Try different keywords or browse our categories.
              </p>
              <Link href="/">
                <Button>Browse All Products</Button>
              </Link>
            </div>
          ) : (
            <div className="py-12 text-center">
              <SearchIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h2 className="mb-2 text-xl font-semibold">Search for products</h2>
              <p className="mb-6 text-gray-500">Enter keywords to find products you're looking for.</p>
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

