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
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <CheckCircle className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Order Placed Successfully! 🎉</h1>
          <p className="text-lg text-slate-600">Thank you for your order. We're preparing it for delivery.</p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="text-center md:text-left">
              <div className="text-sm text-slate-500 mb-1">Order ID</div>
              <div className="text-xl font-bold text-slate-900">{orderId}</div>
            </div>
            <div className="text-center md:text-right">
              <div className="text-sm text-slate-500 mb-1">Estimated Delivery</div>
              <div className="text-xl font-bold text-green-600">45-60 minutes</div>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Order Status</h3>
              <Badge className="bg-blue-100 text-blue-800">Processing</Badge>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mb-2">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
                <span className="text-xs text-slate-600">Order Placed</span>
              </div>
              <div className="flex-1 h-1 bg-blue-200 mx-2"></div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mb-2 animate-pulse">
                  <Package className="h-5 w-5 text-white" />
                </div>
                <span className="text-xs text-slate-600">Preparing</span>
              </div>
              <div className="flex-1 h-1 bg-slate-200 mx-2"></div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center mb-2">
                  <Clock className="h-5 w-5 text-slate-400" />
                </div>
                <span className="text-xs text-slate-600">On the way</span>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Info */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8 border border-blue-100">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Delivery Information</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-blue-600" />
              <span className="text-slate-700">123 Main Street, Lagos, Nigeria</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-blue-600" />
              <span className="text-slate-700">+234 123 456 7890</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-blue-600" />
              <span className="text-slate-700">Expected between 2:30 PM - 3:00 PM</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/stores" className="flex-1">
            <Button variant="outline" className="w-full py-3 rounded-xl border-2">
              Continue Shopping
            </Button>
          </Link>
          <Link href={`/orders/${orderId}`} className="flex-1">
            <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 rounded-xl">
              <div className="flex items-center justify-center gap-2">
                Track Order
                <ArrowRight className="h-4 w-4" />
              </div>
            </Button>
          </Link>
        </div>

        {/* Support */}
        <div className="text-center mt-8 p-6 bg-slate-50 rounded-xl">
          <p className="text-slate-600 mb-2">Need help with your order?</p>
          <Link href="/support">
            <Button variant="link" className="text-blue-600 hover:text-blue-700">
              Contact Support
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
