"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
  User, 
  ShoppingBag, 
  CreditCard, 
  Settings, 
  LogOut,
  ChevronLeft
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export default function UserDashboard() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<{name: string, email: string} | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  // Check if user is logged in on component mount
  useEffect(() => {
    // Check localStorage for authentication state
    const checkAuth = () => {
      try {
        // Only allow access if auth is initialized and user is logged in
        if (localStorage.getItem("authInitialized") === "true") {
          const isLoggedInStorage = localStorage.getItem("isLoggedIn") === "true"
          const userStorage = localStorage.getItem("user")
          
          if (isLoggedInStorage && userStorage) {
            setIsLoggedIn(true)
            setUser(JSON.parse(userStorage))
          } else {
            // If not logged in, redirect to login page
            router.push("/login")
          }
        } else {
          // If auth is not initialized, redirect to login page
          router.push("/login")
        }
      } catch (error) {
        console.error("Error checking authentication state:", error)
        router.push("/login")
      } finally {
        setIsInitialized(true)
      }
    }
    
    checkAuth()
  }, [router])

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUser(null)
    
    // Clear localStorage
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("user")
    
    router.push("/")
  }

  // Show loading state while checking authentication
  if (!isInitialized) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center">
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  // Show nothing while redirecting
  if (!isLoggedIn || !user) {
    return null
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="icon" 
          className="mr-4"
          onClick={() => router.push("/")}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">User Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* User Profile Card */}
        <Card className="md:col-span-1">
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src="/placeholder-avatar.jpg" alt={user.name} />
              <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{user.name}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start" onClick={() => router.push("/profile")}>
                <User className="mr-2 h-4 w-4" />
                Profile
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => router.push("/orders")}>
                <ShoppingBag className="mr-2 h-4 w-4" />
                Orders
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => router.push("/payment-methods")}>
                <CreditCard className="mr-2 h-4 w-4" />
                Payment Methods
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => router.push("/settings")}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="destructive" className="w-full" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </CardFooter>
        </Card>

        {/* Main Content */}
        <div className="md:col-span-3">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Account Overview</CardTitle>
                  <CardDescription>Your account summary and recent activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
                      <p className="text-2xl font-bold">12</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h3 className="text-sm font-medium text-gray-500">Wishlist Items</h3>
                      <p className="text-2xl font-bold">5</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h3 className="text-sm font-medium text-gray-500">Reward Points</h3>
                      <p className="text-2xl font-bold">250</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>Your most recent purchases</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3].map((order) => (
                      <div key={order} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">Order #{1000 + order}</p>
                          <p className="text-sm text-gray-500">Placed on {new Date().toLocaleDateString()}</p>
                        </div>
                        <Badge variant={order === 1 ? "default" : "outline"}>
                          {order === 1 ? "Delivered" : "Processing"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>Your Orders</CardTitle>
                  <CardDescription>View and manage your orders</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((order) => (
                      <div key={order} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">Order #{1000 + order}</p>
                          <p className="text-sm text-gray-500">Placed on {new Date().toLocaleDateString()}</p>
                        </div>
                        <Badge variant={order % 2 === 0 ? "default" : "outline"}>
                          {order % 2 === 0 ? "Delivered" : "Processing"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="wishlist">
              <Card>
                <CardHeader>
                  <CardTitle>Your Wishlist</CardTitle>
                  <CardDescription>Items you've saved for later</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((item) => (
                      <div key={item} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-gray-200 rounded-md mr-4"></div>
                          <div>
                            <p className="font-medium">Product {item}</p>
                            <p className="text-sm text-gray-500">$99.99</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">Add to Cart</Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
} 