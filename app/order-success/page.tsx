"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle,
  Package,
  Clock,
  MapPin,
  Phone,
  ArrowRight,
  Truck,
  CheckCheck
} from "lucide-react"
import { getToken } from "@/storage/tokenStorage"
import axios from "axios"

export default function OrderSuccessPage() {
  const [orderData, setOrderData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true)
        const orderId = localStorage.getItem("orderId")
        const token = getToken()

        // if (!orderId || !token) {
        //   setError("Missing order ID or token")
        //   return
        // }

        const response = await axios.get(`/api/products/fetch-order/${orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        setOrderData(response.data.data)

        if (response.data.status === "delivered") {
          localStorage.removeItem("orderId")
        }
      } catch (err: any) {
        setError(err?.response?.data?.message || err.message || "Failed to fetch order")
      } finally {
        setLoading(false)
      }
    }

    fetchOrderDetails()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "accepted":
        return "bg-blue-100 text-blue-800"
      case "transit":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusSteps = (currentStatus: string) => {
    const steps = [
      { key: "pending", label: "Order Placed", icon: CheckCircle },
      { key: "accepted", label: "Accepted", icon: Package },
      { key: "transit", label: "On the way", icon: Truck },
      { key: "delivered", label: "Delivered", icon: CheckCheck }
    ]

    const statusOrder = ["pending", "accepted", "transit", "delivered"]
    const currentIndex = statusOrder.indexOf(currentStatus)

    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      active: index === currentIndex
    }))
  }

  const formatPrice = (price: string | number) => {
    const numericPrice = typeof price === "string" ? parseFloat(price) : price
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN"
    }).format(numericPrice)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  const formatStatus = (status?: string) => {
    if (!status) return "Unknown"
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-red-500 mb-4">Error: {error}</div>
          <Button onClick={() => window.location.href = "/stores"}>
            Continue Shopping
          </Button>
        </div>
      </div>
    )
  }

  if (!orderData) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-gray-600">No order data available</p>
          <Button onClick={() => window.location.href = "/stores"}>
            Continue Shopping
          </Button>
        </div>
      </div>
    )
  }

  const statusSteps = getStatusSteps(orderData.status)
  const itemCount = Array.isArray(orderData.items) ? orderData.items.length : 0

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h1>
          <p className="text-lg text-gray-600">Thank you for your order. We're preparing it for delivery.</p>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="text-center md:text-left">
              <div className="text-sm text-gray-500 mb-1">Order ID</div>
              <div className="text-xl font-semibold text-gray-900">{orderData.orderId}</div>
            </div>
            <div className="text-center md:text-right">
              <div className="text-sm text-gray-500 mb-1">Order Date</div>
              <div className="text-lg font-semibold text-gray-600">{formatDate(orderData.createdAt)}</div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Order Status</h3>
              <Badge className={getStatusColor(orderData.status)}>
                {formatStatus(orderData.status)}
              </Badge>

            </div>

            <div className="flex items-center justify-between mb-6">
              {statusSteps.map((step, index) => {
                const Icon = step.icon
                return (
                  <div key={step.key} className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${step.completed ? "bg-green-500" : step.active ? "bg-yellow-500" : "bg-gray-200"}`}>
                      <Icon className={`h-4 w-4 ${step.completed || step.active ? "text-white" : "text-gray-400"}`} />
                    </div>
                    <span className="text-xs text-gray-600">{step.label}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Delivery Info */}
        <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Delivery Information</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-gray-500" />
              <span className="text-gray-700">{orderData.receiversAddress}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-gray-500" />
              <span className="text-gray-700">{orderData.receiverPhone}</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-gray-500" />
              <span className="text-gray-700">Receiver: {orderData.receiverName}</span>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal ({itemCount} item{itemCount !== 1 ? "s" : ""})</span>
              <span>{formatPrice(orderData.cost)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Delivery Fee</span>
              <span>{formatPrice(orderData.fee)}</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-semibold">
              <span>Total</span>
              <span>{formatPrice(orderData.totalPrice)}</span>
            </div>
            <div className="text-sm text-green-600">
              Payment Status: {orderData.paymentStatus}
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button variant="outline" className="w-full py-3 rounded-lg border-gray-300" onClick={() => window.location.href = "/stores"}>
            Continue Shopping
          </Button>
          <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-lg" onClick={() => window.location.href = `/orders/${orderData.orderId}`}>
            <div className="flex items-center justify-center gap-2">
              Track Order <ArrowRight className="h-4 w-4" />
            </div>
          </Button>
        </div>

        <div className="text-center mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-600 mb-2">Need help with your order?</p>
          <Button variant="link" className="text-yellow-600 hover:text-yellow-700" onClick={() => window.location.href = "/support"}>
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  )
}
