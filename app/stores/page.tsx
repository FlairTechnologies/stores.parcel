import StoreCard from "@/components/store-card"
import CategoryFilter from "@/components/category-filter"
import { stores } from "@/lib/data"
import { Sparkles, TrendingUp, Clock, Shield } from "lucide-react"

export default function StoresPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white mb-12">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative px-8 py-16 md:px-16 md:py-24">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-6 w-6 text-yellow-400" />
              <span className="text-yellow-400 font-medium">Discover Local Stores</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">Browse Local Stores</h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
              Discover amazing products from trusted local businesses. Fast delivery, great prices, and exceptional
              service.
            </p>
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-400" />
                <span>500+ Local Stores</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-400" />
                <span>30-60 min delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-purple-400" />
                <span>Secure payments</span>
              </div>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-32 w-20 h-20 bg-yellow-400/20 rounded-full blur-lg"></div>
      </section>

      {/* Category Filter */}
      <CategoryFilter />

      {/* Featured Stores Section */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Featured Stores</h2>
            <p className="text-slate-600">Hand-picked stores with the best products and service</p>
          </div>
        </div>

        {/* Stores Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stores.map((store) => (
            <StoreCard key={store.id} store={store} />
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
            <div className="text-slate-600">Local Stores</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-600 mb-2">10k+</div>
            <div className="text-slate-600">Happy Customers</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-600 mb-2">50k+</div>
            <div className="text-slate-600">Products</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-yellow-600 mb-2">4.8★</div>
            <div className="text-slate-600">Average Rating</div>
          </div>
        </div>
      </section>
    </div>
  )
}
