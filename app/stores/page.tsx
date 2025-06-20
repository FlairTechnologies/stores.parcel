import StoreCard from "@/components/store-card"
import CategoryFilter from "@/components/category-filter"
import { stores } from "@/lib/data"
import { Sparkles, TrendingUp, Clock, Shield } from "lucide-react"

export default function StoresPage() {
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
                <span>500+ Local Stores</span>
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

      {/* Category Filter
      <CategoryFilter /> */}

      {/* Featured Stores Section */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Stores</h2>
            <p className="text-gray-600">Hand-picked stores with the best products and service</p>
          </div>
        </div>

        {/* Stores Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map((store) => (
            <StoreCard key={store.id} store={store} />
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-gray-900 mb-2">500+</div>
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
