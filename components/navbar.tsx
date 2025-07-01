"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { ShoppingCart, Search, Menu, X, MapPin, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    // Initial read
    setCartCount(Number(localStorage.getItem("cartCount") || "0"))

    // Listen for changes (even from other tabs)
    const handler = () => {
      setCartCount(Number(localStorage.getItem("cartCount") || "0"))
    }
    window.addEventListener("storage", handler)
    return () => window.removeEventListener("storage", handler)
  }, [])


  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-200">
        <div className="container mx-auto px-4">
          {/* Top bar */}
          <div className="hidden md:flex items-center justify-between py-2 text-sm text-gray-600 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>Lagos, Nigeria</span>
              </div>
              <span>Free delivery on orders above ₦5,000</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/help" className="hover:text-gray-900 transition-colors">Help</Link>
              <Link href="/track" className="hover:text-gray-900 transition-colors">Track Order</Link>
            </div>
          </div>

          {/* Main nav */}
          <div className="flex items-center justify-between py-4">
            <Link href="/stores" className="flex items-center group">
              <Package className="text-yellow-500" size={40} />
              <div>
                <span className="text-2xl font-bold text-gray-900">Parcel</span>
              </div>
            </Link>

            {/* Search (Desktop only) */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-8">
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search for stores, products, or categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-3 w-full rounded-lg border border-gray-300 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 bg-white transition-all"
                />
                {searchQuery && (
                  <Button
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-md bg-yellow-500 hover:bg-yellow-600 text-white"
                  >
                    Search
                  </Button>
                )}
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Mobile search */}
              <Button variant="ghost" size="icon" className="md:hidden">
                <Search className="h-5 w-5" />
              </Button>

              {/* Cart */}
              <Link href="/cart" className="flex flex-row items-center">
                <Button variant="ghost" size="icon" className="relative w-10">
                  <ShoppingCart className="h-5 w-5" />

                  {/* <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-yellow-500 text-white text-xs font-semibold">
                    {cartCount}
                  </Badge> */}

                </Button>
                <p>Cart</p>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setIsMenuOpen(false)}>
          <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-semibold">Menu</h2>
              <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Mobile search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input type="text" placeholder="Search..." className="pl-10 rounded-lg border-gray-300" />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
