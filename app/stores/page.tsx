"use client"
import StoreCard from "@/components/store-card"
import CategoryFilter from "@/components/category-filter"
import { Sparkles, TrendingUp, Clock, Shield, Loader2 } from "lucide-react"
import { getToken } from "@/storage/tokenStorage"
import { useEffect, useState } from "react"
import axios from "axios"

export default function StoresPage() {
  const [stores, setStores] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const token = getToken()
        
        if (!token) {
          setError("Authentication required")
          setLoading(false)
          return
        }

        const response = await axios.get("/api/stores/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        
        if (response.data.message === "Successful" && response.data.data) {
          const transformedStores = response.data.data.map((store: any) => ({
            id: store._id,
            name: store.name,
            description: store.descr,
            category: store.mainGood,
            rating: store.avgRating,
            totalRatings: store.ratings?.length || 0,
            image: store.imgs?.[0],
            address: `${store.address.address}, ${store.address.city}, ${store.address.state}`,
            isOpen: store.isOpen,
            owner: store.owner,
            createdAt: store.createdAt,
            updatedAt: store.updatedAt
          }))
          
          setStores(transformedStores)
        } else {
          setError("No stores data received")
        }
      } catch (error: any) {
        setError(error.response?.data?.message || "Failed to fetch stores")
      } finally {
        setLoading(false)
      }
    }

    fetchStores()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading stores...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 mb-4">⚠️ {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-900 to-gray-800 text-white mb-12">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-yellow-400/5"></div>
        <div className="relative px-8 py-16 md:px-16 md:py-20">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-6 w-6 text-yellow-400" />
              <span className="text-yellow-400 font-medium">Discover Local Stores</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">Browse Local Stores</h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Discover amazing products from trusted local businesses. Fast delivery, great prices, and exceptional
              service.
            </p>
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-400" />
                <span>{stores.length}+ Local Stores</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-yellow-400" />
                <span>30-60 min delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-400" />
                <span>Secure payments</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Stores Section */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Stores</h2>
            <p className="text-gray-600">Hand-picked stores with the best products and service</p>
          </div>
        </div>

        {stores.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-600">No stores available at the moment</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map((store: any) => (
              <StoreCard key={store.id} store={store} />
            ))}
          </div>
        )}
      </section>

      {/* Stats Section */}
      <section className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{stores.length}+</div>
            <div className="text-gray-600">Local Stores</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-900 mb-2">10k+</div>
            <div className="text-gray-600">Happy Customers</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-900 mb-2">50k+</div>
            <div className="text-gray-600">Products</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-yellow-500 mb-2">4.8★</div>
            <div className="text-gray-600">Average Rating</div>
          </div>
        </div>
      </section>
    </div>
  )
}