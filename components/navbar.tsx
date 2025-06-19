"use client"

import Link from "next/link"
import { useState } from "react"
import { ShoppingCart, Search, Menu, X, User, Heart, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCart } from "@/lib/cart-context"
import { Badge } from "@/components/ui/badge"

export default function Navbar() {
  const { cart } = useCart()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <>
      <header className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-slate-200">
        <div className="container mx-auto px-4">
          {/* Top bar */}
          <div className="hidden md:flex items-center justify-between py-2 text-sm text-slate-600 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>Lagos, Nigeria</span>
              </div>
              <span>Free delivery on orders above ₦5,000</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/help" className="hover:text-slate-900 transition-colors">
                Help
              </Link>
              <Link href="/track" className="hover:text-slate-900 transition-colors">
                Track Order
              </Link>
            </div>
          </div>

          {/* Main navigation */}
          <div className="flex items-center justify-between py-4">
            <Link href="/stores" className="flex items-center group">
              <div className="relative w-10 h-10 mr-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <div className="w-6 h-6 bg-white rounded-md flex items-center justify-center">
                  <div className="w-3 h-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-sm"></div>
                </div>
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  ParcelShop
                </span>
                <div className="text-xs text-slate-500 -mt-1">Your Local Market</div>
              </div>
            </Link>

            {/* Search bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-8">
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search for stores, products, or categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-3 w-full rounded-full border-2 border-slate-200 focus:border-blue-500 focus:ring-0 bg-slate-50 focus:bg-white transition-all"
                />
                {searchQuery && (
                  <Button
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full bg-blue-600 hover:bg-blue-700"
                  >
                    Search
                  </Button>
                )}
              </div>
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-2">
              {/* Mobile search */}
              <Button variant="ghost" size="icon" className="md:hidden">
                <Search className="h-5 w-5" />
              </Button>

              {/* Wishlist */}
              <Button variant="ghost" size="icon" className="hidden sm:flex relative">
                <Heart className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-xs">
                  2
                </Badge>
              </Button>

              {/* Cart */}
              <Link href="/cart">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {cartItemCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-yellow-500 text-xs font-semibold">
                      {cartItemCount}
                    </Badge>
                  )}
                </Button>
              </Link>

              {/* User menu */}
              <Button variant="ghost" size="icon" className="hidden sm:flex">
                <User className="h-5 w-5" />
              </Button>

              {/* Mobile menu toggle */}
              <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>

              {/* Login button - Desktop */}
              <Button className="hidden md:flex bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6">
                Sign In
              </Button>
            </div>
          </div>

          {/* Categories - Desktop */}
          <div className="hidden md:flex items-center gap-8 py-3 border-t border-slate-100">
            <Link
              href="/stores?category=groceries"
              className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors"
            >
              Groceries
            </Link>
            <Link
              href="/stores?category=electronics"
              className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors"
            >
              Electronics
            </Link>
            <Link
              href="/stores?category=fashion"
              className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors"
            >
              Fashion
            </Link>
            <Link
              href="/stores?category=home"
              className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors"
            >
              Home & Garden
            </Link>
            <Link
              href="/stores?category=health"
              className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors"
            >
              Health & Beauty
            </Link>
            <Link
              href="/stores?category=sports"
              className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors"
            >
              Sports
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
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
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input type="text" placeholder="Search..." className="pl-10 rounded-full" />
              </div>
            </div>

            {/* Mobile navigation */}
            <nav className="space-y-4">
              <Link href="/stores" className="block py-2 text-slate-700 hover:text-blue-600 font-medium">
                All Stores
              </Link>
              <Link href="/stores?category=groceries" className="block py-2 text-slate-700 hover:text-blue-600">
                Groceries
              </Link>
              <Link href="/stores?category=electronics" className="block py-2 text-slate-700 hover:text-blue-600">
                Electronics
              </Link>
              <Link href="/stores?category=fashion" className="block py-2 text-slate-700 hover:text-blue-600">
                Fashion
              </Link>
              <Link href="/stores?category=home" className="block py-2 text-slate-700 hover:text-blue-600">
                Home & Garden
              </Link>
              <Link href="/cart" className="block py-2 text-slate-700 hover:text-blue-600">
                Cart ({cartItemCount})
              </Link>
              <Link href="/wishlist" className="block py-2 text-slate-700 hover:text-blue-600">
                Wishlist
              </Link>
              <Link href="/orders" className="block py-2 text-slate-700 hover:text-blue-600">
                My Orders
              </Link>
              <Link href="/help" className="block py-2 text-slate-700 hover:text-blue-600">
                Help & Support
              </Link>
            </nav>

            <div className="mt-8 pt-6 border-t">
              <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                Sign In
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
