"use client"

import Link from "next/link"
import { CheckCircle, Home, ShoppingBag } from "lucide-react"

import { Button } from "@/components/ui/button"
import Header from "@/app/components/header"

export default function OrderConfirmationPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-12">
        <div className="container px-4 mx-auto">
          <div className="max-w-2xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="flex items-center justify-center w-20 h-20 bg-green-100 rounded-full">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
            </div>
            
            <h1 className="mb-4 text-3xl font-bold">Order Confirmed!</h1>
            <p className="mb-8 text-lg text-gray-600">
              Thank you for your purchase. Your order has been received and is being processed.
            </p>
            
            <div className="p-6 mb-8 text-left bg-white rounded-lg shadow">
              <h2 className="mb-4 text-xl font-semibold">Order Details</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Number</span>
                  <span className="font-medium">#ORD-{Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date</span>
                  <span className="font-medium">{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method</span>
                  <span className="font-medium">Credit Card</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping Address</span>
                  <span className="font-medium">123 Main St, City, Country</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
              <Link href="/">
                <Button variant="outline" className="w-full sm:w-auto">
                  <Home className="w-4 h-4 mr-2" />
                  Continue Shopping
                </Button>
              </Link>
              <Link href="/orders">
                <Button className="w-full sm:w-auto">
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  View Orders
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 