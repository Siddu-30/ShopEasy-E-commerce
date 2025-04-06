"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useToast } from "@/hooks/use-toast"

type ComparisonContextType = {
  comparisonList: number[]
  addToComparison: (productId: number) => void
  removeFromComparison: (productId: number) => void
  clearComparison: () => void
  isInComparison: (productId: number) => boolean
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined)

export function ComparisonProvider({ children }: { children: ReactNode }) {
  const [comparisonList, setComparisonList] = useState<number[]>([])
  const { toast } = useToast()

  // Load comparison list from localStorage on initial render
  useEffect(() => {
    const savedList = localStorage.getItem("comparisonList")
    if (savedList) {
      try {
        setComparisonList(JSON.parse(savedList))
      } catch (error) {
        console.error("Failed to parse comparison list from localStorage:", error)
      }
    }
  }, [])

  // Save comparison list to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("comparisonList", JSON.stringify(comparisonList))
  }, [comparisonList])

  const addToComparison = (productId: number) => {
    if (comparisonList.includes(productId)) {
      toast({
        title: "Already in comparison",
        description: "This product is already in your comparison list",
      })
      return
    }

    if (comparisonList.length >= 4) {
      toast({
        title: "Comparison list full",
        description: "You can compare up to 4 products at a time. Remove a product to add a new one.",
        variant: "destructive",
      })
      return
    }

    setComparisonList((prev) => [...prev, productId])
    toast({
      title: "Added to comparison",
      description: "Product has been added to your comparison list",
    })
  }

  const removeFromComparison = (productId: number) => {
    setComparisonList((prev) => prev.filter((id) => id !== productId))
    toast({
      title: "Removed from comparison",
      description: "Product has been removed from your comparison list",
    })
  }

  const clearComparison = () => {
    setComparisonList([])
    toast({
      title: "Comparison list cleared",
      description: "All products have been removed from your comparison list",
    })
  }

  const isInComparison = (productId: number) => {
    return comparisonList.includes(productId)
  }

  return (
    <ComparisonContext.Provider
      value={{
        comparisonList,
        addToComparison,
        removeFromComparison,
        clearComparison,
        isInComparison,
      }}
    >
      {children}
    </ComparisonContext.Provider>
  )
}

export function useComparison() {
  const context = useContext(ComparisonContext)
  if (context === undefined) {
    throw new Error("useComparison must be used within a ComparisonProvider")
  }
  return context
}

