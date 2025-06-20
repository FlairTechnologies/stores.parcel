"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/lib/cart-context"
import { CheckCircle, Package, Clock, MapPin, Phone, ArrowRight } from "lucide-react"

export default function OrderSuccessPage() {
  const { clearCart } = useCart()
  const [orderId, setOrderId] = useState("")

  useEffect(() => {
    setOrderId(`ORD-${Math.floor(100000 + Math.random() * 900000)}`)
    clearCart()
  }, [clearCart])

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

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="text-center md:text-left">
              <div className="text-sm text-gray-500 mb-1">Order ID</div>
              <div className="text-xl font-semibold text-gray-900">{orderId}</div>
            </div>
            <div className="text-center md:text-right">
              <div className="text-sm text-gray-500 mb-1">Estimated Delivery</div>
              <div className="text-xl font-semibold text-green-600">45-60 minutes</div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Order Status</h3>
              <Badge className="bg-yellow-100 text-yellow-800">Processing</Badge>
            </div>

            <div className="flex items-center justify-between mb-6">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mb-2">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
                <span className="text-xs text-gray-600">Order Placed</span>
              </div>
              <div className="flex-1 h-1 bg-yellow-200 mx-2"></div>
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center mb-2">
                  <Package className="h-4 w-4 text-white" />
                </div>
                <span className="text-xs text-gray-600">Preparing</span>
              </div>
              <div className="flex-1 h-1 bg-gray-200 mx-2"></div>
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mb-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                </div>
                <span className="text-xs text-gray-600">On the way</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Delivery Information</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-gray-500" />
              <span className="text-gray-700">123 Main Street, Lagos, Nigeria</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-gray-500" />
              <span className="text-gray-700">+234 123 456 7890</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-gray-500" />
              <span className="text-gray-700">Expected between 2:30 PM - 3:00 PM</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/stores" className="flex-1">
            <Button variant="outline" className="w-full py-3 rounded-lg border-gray-300">
              Continue Shopping
            </Button>
          </Link>
          <Link href={`/orders/${orderId}`} className="flex-1">
            <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-lg">
              <div className="flex items-center justify-center gap-2">
                Track Order
                <ArrowRight className="h-4 w-4" />
              </div>
            </Button>
          </Link>
        </div>

        <div className="text-center mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-600 mb-2">Need help with your order?</p>
          <Link href="/support">
            <Button variant="link" className="text-yellow-600 hover:text-yellow-700">
              Contact Support
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
