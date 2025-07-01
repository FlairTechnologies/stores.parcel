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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import Breadcrumb from "@/components/breadcrumb"
import { Minus, Plus, Trash2, ShoppingBag, CreditCard, Truck, Shield, ArrowRight, User, Phone, MapPin, X, CheckCircle, AlertCircle } from "lucide-react"
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

type DeliveryInfo = {
  name: string
  phone: string
  address: string
}

type PaymentModalState = {
  isOpen: boolean
  authorizationUrl: string
  reference: string
  accessCode: string
}

export default function CartPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [cart, setCart] = useState<CartItem[]>([])
  const [paymentMethod, setPaymentMethod] = useState("paystack")
  const [loading, setLoading] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo>({
    name: "",
    phone: "",
    address: ""
  })
  const [paymentModal, setPaymentModal] = useState<PaymentModalState>({
    isOpen: false,
    authorizationUrl: "",
    reference: "",
    accessCode: ""
  })
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'verifying' | 'success' | 'failed'>('idle')

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
      storeName: item.productId.store,
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
        const increaseBy = newQuantity - currentQuantity
        for (let i = 0; i < increaseBy; i++) {
          await axios.post(
            `/api/products/${productId}/add-to-cart`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          )
        }
      } else {
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

  const verifyPayment = async (reference: string) => {
    try {
      setPaymentStatus('verifying')
      const token = getToken()

      const response = await axios.get(`/api/products/verify-payment?reference=${reference}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      console.log(response.data)

      if (response.data.data === 'success') {
        setPaymentStatus('success')

        // Clear cart after successful payment
        await axios.post(
          "/api/products/clear-cart",
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        )

        toast({ title: "Payment Successful!", description: "Your order has been placed successfully.", variant: "default" })

        // Redirect after a short delay

        setPaymentModal(prev => ({ ...prev, isOpen: false }))
        router.push("/order-success")

      } else {
        setPaymentStatus('failed')
        toast({ title: "Payment Failed", description: "Payment verification failed. Please try again.", variant: "destructive" })
      }
    } catch (err: any) {
      console.error("Payment verification error:", err)
      setPaymentStatus('failed')
      toast({ title: "Verification Error", description: "Failed to verify payment. Please contact support.", variant: "destructive" })
    }
  }

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      toast({ title: "Error", description: "Your cart is empty", variant: "destructive" })
      return
    }

    // Validate delivery information
    if (!deliveryInfo.name.trim()) {
      toast({ title: "Error", description: "Please enter receiver's name", variant: "destructive" })
      return
    }
    if (!deliveryInfo.phone.trim()) {
      toast({ title: "Error", description: "Please enter receiver's phone number", variant: "destructive" })
      return
    }
    if (!deliveryInfo.address.trim()) {
      toast({ title: "Error", description: "Please enter delivery address", variant: "destructive" })
      return
    }

    try {
      setLoading(true)
      const token = getToken()

      // Create order with delivery information
      const orderResponse = await axios.post(
        "/api/products/create-order",
        {
          receiver: {
            name: deliveryInfo.name,
            phone: deliveryInfo.phone,
            address: deliveryInfo.address
          }
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      // console.log("Order created:", orderResponse.data)
      const orderId = orderResponse.data.data.orderId
      localStorage.setItem("orderId", orderId)

      if (!orderId) {
        throw new Error("Order ID not received from create-order response")
      }

      if (paymentMethod === "paystack") {
        // Checkout with Paystack
        const checkoutResponse = await axios.post(
          "/api/products/checkout",
          {
            orderId: orderId,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        )

        const { authorization_url, access_code, reference } = checkoutResponse.data.data

        // Open payment modal with Paystack checkout
        setPaymentModal({
          isOpen: true,
          authorizationUrl: authorization_url,
          reference: reference,
          accessCode: access_code
        })
        setPaymentStatus('idle')
      } else {
        // Bank transfer - existing logic
        await axios.post(
          "/api/products/checkout",
          {
            orderId: orderId,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        )

        await axios.post(
          "/api/products/clear-cart",
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        )

        toast({ title: "Success", description: "Order placed successfully!", variant: "default" })
        router.push("/order-success")
      }
    } catch (err: any) {
      console.error("Checkout error:", err)
      const errorMessage = err.response?.data?.message || "Checkout failed. Please try again"
      toast({ title: "Checkout Failed", description: errorMessage, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const closePaymentModal = () => {
    setPaymentModal(prev => ({ ...prev, isOpen: false }))
    setPaymentStatus('idle')
  }

  // Don't render anything on server side to avoid hydration issues
  if (!isClient) {
    return null
  }

  const cartItems = Array.isArray(cart) ? cart : []
  // localStorage.setItem("cartCount", cartItems.length.toString())

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
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-lg">
                        ₦{item.price.toLocaleString()}
                      </span>
                      <Badge
                        variant="secondary"
                        className={`text-xs ${item.inStock
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
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Information</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="receiver-name" className="text-gray-700 font-medium">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="h-4 w-4" />
                      Receiver's Name
                    </div>
                  </Label>
                  <Input
                    id="receiver-name"
                    type="text"
                    placeholder="Enter receiver's full name"
                    value={deliveryInfo.name}
                    onChange={(e) => setDeliveryInfo(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full border-gray-300"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="receiver-phone" className="text-gray-700 font-medium">
                    <div className="flex items-center gap-2 mb-2">
                      <Phone className="h-4 w-4" />
                      Phone Number
                    </div>
                  </Label>
                  <Input
                    id="receiver-phone"
                    type="tel"
                    placeholder="e.g., 0804638822"
                    value={deliveryInfo.phone}
                    onChange={(e) => setDeliveryInfo(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full border-gray-300"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="delivery-address" className="text-gray-700 font-medium">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-4 w-4" />
                      Delivery Address
                    </div>
                  </Label>
                  <Input
                    id="delivery-address"
                    type="text"
                    placeholder="Enter full delivery address"
                    value={deliveryInfo.address}
                    onChange={(e) => setDeliveryInfo(prev => ({ ...prev, address: e.target.value }))}
                    className="w-full border-gray-300"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-3">Payment Method</label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paystack">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Pay with Card (Paystack)
                    </div>
                  </SelectItem>
                  {/* <SelectItem value="bank_transfer">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Bank Transfer
                    </div>
                  </SelectItem> */}
                </SelectContent>
              </Select>
              {paymentMethod === "bank_transfer" && (
                <p className="text-sm text-gray-600 mt-2">
                  You will receive bank details after placing your order
                </p>
              )}
            </div>

            <Button
              onClick={handlePlaceOrder}
              disabled={loading || cartItems.length === 0 || !deliveryInfo.name.trim() || !deliveryInfo.phone.trim() || !deliveryInfo.address.trim()}
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

      {/* Payment Modal */}
      <Dialog open={paymentModal.isOpen} onOpenChange={closePaymentModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Complete Payment
            </DialogTitle>
            <DialogDescription>
              Complete your payment securely with Paystack
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {paymentStatus === 'idle' && (
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="font-semibold text-lg">₦{total.toLocaleString()}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    Reference: {paymentModal.reference}
                  </div>
                </div>

                <div className="space-y-3">
                  <iframe
                    src={paymentModal.authorizationUrl}
                    className="w-full h-96 border border-gray-200 rounded-lg"
                    title="Paystack Payment"
                  />

                  <div className="flex gap-2">
                    <Button
                      onClick={() => verifyPayment(paymentModal.reference)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    >
                      I've Completed Payment
                    </Button>
                    <Button
                      onClick={closePaymentModal}
                      variant="outline"
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {paymentStatus === 'verifying' && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
                <h3 className="text-lg font-semibold mb-2">Verifying Payment...</h3>
                <p className="text-gray-600">Please wait while we confirm your payment.</p>
              </div>
            )}

            {paymentStatus === 'success' && (
              <div className="text-center py-8">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-green-700 mb-2">Payment Successful!</h3>
                <p className="text-gray-600">Your order has been placed successfully.</p>
                <p className="text-sm text-gray-500 mt-2">Redirecting to order confirmation...</p>
              </div>
            )}

            {paymentStatus === 'failed' && (
              <div className="text-center py-8">
                <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-red-700 mb-2">Payment Failed</h3>
                <p className="text-gray-600 mb-4">We couldn't verify your payment. Please try again.</p>
                <div className="space-y-2">
                  <Button
                    onClick={() => verifyPayment(paymentModal.reference)}
                    className="w-full bg-yellow-500 hover:bg-yellow-600"
                  >
                    Retry Verification
                  </Button>
                  <Button
                    onClick={closePaymentModal}
                    variant="outline"
                    className="w-full"
                  >
                    Close
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}