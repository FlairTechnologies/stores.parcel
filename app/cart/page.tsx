"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import Breadcrumb from "@/components/breadcrumb"
import { Minus, Plus, Trash2, ShoppingBag, CreditCard, Truck, Shield, ArrowRight } from "lucide-react"
import axios from "axios"
import { useToast } from "@/components/ui/use-toast"
import { getToken } from "@/storage/tokenStorage"

// Updated type to match API response structure
type ApiCartItem = {
  productId: {
    _id: string
    descr: string
    store: string
    price: string
    discount: number
    imgs: string[]
    inStock: boolean
  }
  quantity: number
  individualPrice: number
  totalPrice: number
  _id: string
}

type CartItem = {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
  storeName?: string
  inStock: boolean
}

export default function CartPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [cart, setCart] = useState<CartItem[]>([])
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [loading, setLoading] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // Ensure component only runs on client side
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Transform API response to match frontend structure
  const transformCartItems = (apiItems: ApiCartItem[]): CartItem[] => {
    return apiItems.map((item) => ({
      id: item.productId._id,
      name: item.productId.descr,
      price: parseInt(item.productId.price),
      quantity: item.quantity,
      image: item.productId.imgs?.[0] || "/placeholder.svg",
      storeName: item.productId.store, // You might want to fetch store name separately
      inStock: item.productId.inStock
    }))
  }

  const fetchCart = async () => {
    const token = getToken()
    try {
      const response = await axios.get("/api/products/cart", {
        headers: { Authorization: `Bearer ${token}` }
      })
      console.log("Cart fetched:", response.data)
      
      // Transform the API response to match frontend structure
      const apiCartItems = response.data.data.cart.items || []
      const transformedItems = transformCartItems(apiCartItems)
      setCart(transformedItems)
    } catch (err: any) {
      console.error("Cart fetch error:", err)
      const errorMessage = err.response?.data?.message || "Failed to fetch cart items"
      toast({ title: "Error", description: errorMessage, variant: "destructive" })
    }
  }

  useEffect(() => {
    if (isClient) {
      fetchCart()
    }
  }, [isClient])

  const updateQuantity = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return

    try {
      const token = getToken()
      if (!token) {
        toast({ title: "Error", description: "Please log in", variant: "destructive" })
        return
      }

      const currentItem = cart.find((item) => item.id === productId)
      if (!currentItem) return

      const currentQuantity = currentItem.quantity

      if (newQuantity > currentQuantity) {
        // Increase quantity
        const increaseBy = newQuantity - currentQuantity
        for (let i = 0; i < increaseBy; i++) {
          await axios.post(
            `/api/products/${productId}/add-to-cart`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          )
        }
      } else {
        // Decrease quantity
        const decreaseBy = currentQuantity - newQuantity
        for (let i = 0; i < decreaseBy; i++) {
          await axios.post(
            `/api/products/${productId}/reduce-quantity`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          )
        }
      }

      await fetchCart()
    } catch (err: any) {
      console.error("Update quantity error:", err)
      const errorMessage = err.response?.data?.message || "Failed to update quantity"
      toast({ title: "Error", description: errorMessage, variant: "destructive" })
    }
  }

  const removeFromCart = async (productId: string) => {
    try {
      const token = getToken()
      if (!token) {
        toast({ title: "Error", description: "Please log in", variant: "destructive" })
        return
      }

      await axios.post(
        `/api/products/${productId}/reduce-quantity`,
        { removeAll: true },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      await fetchCart()
    } catch (err: any) {
      console.error("Remove item error:", err)
      const errorMessage = err.response?.data?.message || "Failed to remove item"
      toast({ title: "Error", description: errorMessage, variant: "destructive" })
    }
  }

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      toast({ title: "Error", description: "Your cart is empty", variant: "destructive" })
      return
    }

    try {
      setLoading(true)
      const token = getToken()
      if (!token) {
        toast({ title: "Error", description: "Please log in", variant: "destructive" })
        return
      }

      await axios.post(
        "/api/products/checkout",
        { paymentMethod },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      await axios.post(
        "/api/products/clear-cart",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )

      toast({ title: "Success", description: "Order placed successfully!", variant: "default" })
      router.push("/order-success")
    } catch (err: any) {
      console.error("Checkout error:", err)
      const errorMessage = err.response?.data?.message || "Checkout failed. Please try again"
      toast({ title: "Checkout Failed", description: errorMessage, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  // Don't render anything on server side to avoid hydration issues
  if (!isClient) {
    return null
  }

  // Ensure cart is always an array before using reduce
  const cartItems = Array.isArray(cart) ? cart : []
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const deliveryFee = subtotal >= 5000 ? 0 : 500
  const total = subtotal + deliveryFee

  const breadcrumbItems = [{ label: "Cart" }]

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb items={breadcrumbItems} />
        <div className="max-w-md mx-auto text-center py-16">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="h-10 w-10 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8">Looks like you haven't added any products to your cart yet.</p>
          <Link href="/stores">
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-3">Start Shopping</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={breadcrumbItems} />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
        <p className="text-gray-600">
          {cartItems.length} item{cartItems.length !== 1 ? "s" : ""} in your cart
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border border-gray-100 rounded-lg hover:border-gray-200 transition-colors"
                >
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>

                  <div className="flex-grow">
                    <h3 className="font-medium text-gray-900 mb-1">{item.name}</h3>
                    {/* {item.storeName && (
                      <p className="text-gray-600 text-sm mb-2">{item.storeName}</p>
                    )} */}
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-lg">
                        ₦{item.price.toLocaleString()}
                      </span>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${
                          item.inStock 
                            ? "bg-green-100 text-green-700" 
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {item.inStock ? "In stock" : "Out of stock"}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 hover:bg-gray-50"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="px-3 py-1 font-medium min-w-[2rem] text-center">{item.quantity}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 hover:bg-gray-50"
                        disabled={!item.inStock}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 sticky top-24">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                <span className="font-medium">₦{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee</span>
                <span className={`font-medium ${deliveryFee === 0 ? "text-green-600" : ""}`}>
                  {deliveryFee === 0 ? "Free" : `₦${deliveryFee.toLocaleString()}`}
                </span>
              </div>
              {subtotal < 5000 && (
                <div className="text-sm text-gray-700 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                  Add ₦{(5000 - subtotal).toLocaleString()} more for free delivery!
                </div>
              )}
              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-semibold text-gray-900">
                  <span>Total</span>
                  <span>₦{total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-3">Payment Method</label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger className="w-full border-gray-300">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="card">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Bank Transfer
                    </div>
                  </SelectItem>
                  {/* <SelectItem value="transfer">Bank Transfer</SelectItem>
                  <SelectItem value="wallet">Digital Wallet</SelectItem> */}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handlePlaceOrder}
              disabled={loading || cartItems.length === 0}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-lg font-medium shadow-sm hover:shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center justify-center gap-2">
                {loading ? "Processing..." : "Place Order"}
                {!loading && <ArrowRight className="h-5 w-5" />}
              </div>
            </Button>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Shield className="h-4 w-4" />
                  <span>Secure</span>
                </div>
                <div className="flex items-center gap-1">
                  <Truck className="h-4 w-4" />
                  <span>Fast Delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}