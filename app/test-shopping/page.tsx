"use client"

import { useState } from "react"
import { useShopping } from "../context/shopping-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

export default function TestShoppingPage() {
  const { wishlist, cart, addToWishlist, removeFromWishlist, addToCart, removeFromCart, updateCartItemQuantity, clearCart, clearWishlist } = useShopping()
  const [selectedProduct, setSelectedProduct] = useState({
    id: "test-product",
    name: "Test Product",
    price: 99.99,
    image: "/placeholder.png",
    description: "A test product",
    longDescription: "A test product for testing the shopping context",
    rating: 4.5,
    reviews: 10,
    inStock: true,
    categoryId: "test",
    featured: true,
    tags: ["test"],
  })

  const handleAddToWishlist = () => {
    addToWishlist(selectedProduct)
  }

  const handleRemoveFromWishlist = () => {
    removeFromWishlist(selectedProduct.id)
  }

  const handleAddToCart = () => {
    addToCart(selectedProduct, 1)
  }

  const handleRemoveFromCart = () => {
    removeFromCart(selectedProduct.id)
  }

  const handleUpdateQuantity = (quantity: number) => {
    updateCartItemQuantity(selectedProduct.id, quantity)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Test Shopping Context</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Test Controls</h2>
          <div className="space-y-2">
            <Button onClick={handleAddToWishlist}>Add to Wishlist</Button>
            <Button onClick={handleRemoveFromWishlist}>Remove from Wishlist</Button>
            <Button onClick={handleAddToCart}>Add to Cart</Button>
            <Button onClick={handleRemoveFromCart}>Remove from Cart</Button>
            <Button onClick={clearCart}>Clear Cart</Button>
            <Button onClick={clearWishlist}>Clear Wishlist</Button>
          </div>
        </div>

        <div className="border p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Current State</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Wishlist ({wishlist.length} items)</h3>
              <ul className="list-disc pl-4">
                {wishlist.map((item) => (
                  <li key={item.id}>{item.name}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-medium">Cart ({cart.length} items)</h3>
              <ul className="list-disc pl-4">
                {cart.map((item) => (
                  <li key={item.id}>
                    {item.name} - Quantity: {item.quantity}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 