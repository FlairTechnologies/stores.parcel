"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Plus, Star } from "lucide-react"
import type { Product } from "@/lib/types"
import { useCart } from "@/lib/cart-context"
import { stores } from "@/lib/data"
import { useState } from "react"

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart()
  const [isAdding, setIsAdding] = useState(false)
  const store = stores.find((s) => s.id === product.storeId)

  const handleAddToCart = async () => {
    setIsAdding(true)
    addToCart({
      ...product,
      quantity: 1,
      storeName: store?.name || "",
    })

    // Simulate loading state
    setTimeout(() => {
      setIsAdding(false)
    }, 500)
  }

  return (
    <div className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-100 hover:border-blue-200">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <Badge className="bg-red-500 text-white text-xs">-15%</Badge>
        </div>
        <div className="absolute top-3 right-3">
          <Button variant="ghost" size="icon" className="bg-white/80 hover:bg-white w-8 h-8">
            <Heart className="h-4 w-4" />
          </Button>
        </div>
        <div className="absolute bottom-3 left-3 right-3">
          <div className="flex items-center gap-1 text-xs text-white bg-black/50 rounded-full px-2 py-1 w-fit">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span>4.5</span>
          </div>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>

        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-lg font-bold text-slate-900">₦{product.price.toLocaleString()}</div>
            <div className="text-sm text-slate-500 line-through">
              ₦{Math.round(product.price * 1.15).toLocaleString()}
            </div>
          </div>
          <div className="text-xs text-slate-500">In stock</div>
        </div>

        <Button
          onClick={handleAddToCart}
          disabled={isAdding}
          className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold py-2.5 rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
        >
          {isAdding ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Adding...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add to Cart
            </div>
          )}
        </Button>
      </div>
    </div>
  )
}
