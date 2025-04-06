"use client"

import Link from "next/link"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import Header from "../components/header"
import DealsSlideshow from "../components/deals-slideshow"
import { products } from "../data/products"

export default function DealsPage() {
  // Filter products with discounts
  const deals = products.filter(product => product.discount > 0)
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 py-8">
        <div className="container px-4 mx-auto">
          <div className="mb-8 text-center">
            <h1 className="mb-4 text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-orange-600">
              Special Deals & Discounts
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Limited time offers on our most popular products. Don't miss out on these amazing deals!
            </p>
          </div>
          
          {/* Deals Slideshow */}
          <div className="mb-8">
            <DealsSlideshow />
          </div>
          
          {/* Featured Deal Banner */}
          <div className="mb-8 overflow-hidden rounded-xl shadow-lg">
            <div className="relative h-80 md:h-96">
              <Image
                src="/images/slideshow/summer-sale.jpg"
                alt="Featured Deal"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
              <div className="absolute inset-0 flex flex-col items-start justify-center p-8 md:p-12">
                <span className="px-4 py-1 mb-4 text-sm font-semibold text-white bg-red-500 rounded-full">
                  Limited Time Offer
                </span>
                <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
                  Summer Sale - Up to 50% Off
                </h2>
                <p className="mb-6 text-lg text-white/90 max-w-lg">
                  Get ready for summer with our biggest sale of the year. Shop now and save big on all your favorite products.
                </p>
                <Link href="/shop">
                  <Button size="lg" className="px-8 py-6 text-lg bg-white text-red-600 hover:bg-gray-100">
                    Shop the Sale
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Deals Grid */}
          <h2 className="mb-6 text-2xl font-bold">Today's Best Deals</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {deals.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.slug}`}
                className="group overflow-hidden rounded-lg border transition-all hover:shadow-lg"
              >
                <div className="relative h-64">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 px-3 py-1 text-sm font-bold text-white bg-red-500 rounded-full">
                    {product.discount}% OFF
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="mb-2 text-lg font-semibold">{product.name}</h3>
                  <div className="flex items-center mb-2">
                    <span className="mr-2 text-lg font-bold text-red-600">
                      ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>
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
                    <span className="text-sm text-gray-500">({product.reviews} reviews)</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          {/* Deal Categories */}
          <div className="mt-12">
            <h2 className="mb-6 text-2xl font-bold">Deals by Category</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <Link href="/category/electronics" className="group relative overflow-hidden rounded-lg h-48">
                <Image
                  src="/images/categories/electronics.jpg"
                  alt="Electronics Deals"
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-xl font-semibold text-white">Electronics Deals</h3>
                  <p className="text-white/80">Save on gadgets and tech</p>
                </div>
              </Link>
              
              <Link href="/category/fashion" className="group relative overflow-hidden rounded-lg h-48">
                <Image
                  src="/images/categories/fashion.jpg"
                  alt="Fashion Deals"
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-xl font-semibold text-white">Fashion Deals</h3>
                  <p className="text-white/80">Trendy styles at lower prices</p>
                </div>
              </Link>
              
              <Link href="/category/home-kitchen" className="group relative overflow-hidden rounded-lg h-48">
                <Image
                  src="/images/categories/home-kitchen.jpg"
                  alt="Home & Kitchen Deals"
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-xl font-semibold text-white">Home & Kitchen Deals</h3>
                  <p className="text-white/80">Upgrade your living space</p>
                </div>
              </Link>
              
              <Link href="/category/beauty-personal-care" className="group relative overflow-hidden rounded-lg h-48">
                <Image
                  src="/images/categories/beauty.jpg"
                  alt="Beauty Deals"
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-xl font-semibold text-white">Beauty Deals</h3>
                  <p className="text-white/80">Look and feel your best</p>
                </div>
              </Link>
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