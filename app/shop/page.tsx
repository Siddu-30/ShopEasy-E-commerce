"use client"

import Link from "next/link"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import Header from "../components/header"
import { categories } from "../data/categories"

export default function ShopPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 py-12">
        <div className="container px-4 mx-auto">
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Shop by Categories
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Browse our wide selection of products organized by category. Find exactly what you're looking for with our easy-to-navigate categories.
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="group overflow-hidden rounded-lg border transition-all hover:shadow-lg"
              >
                <div className="relative h-64">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h2 className="text-xl font-semibold text-white">{category.name}</h2>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-600">{category.description}</p>
                  <div className="mt-4 flex justify-end">
                    <Button variant="outline" className="group-hover:bg-blue-50">
                      View Products
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
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