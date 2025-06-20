import ProductCard from "@/components/product-card"
import Breadcrumb from "@/components/breadcrumb"
import { stores, products } from "@/lib/data"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Clock, MapPin, Phone, Heart, Share2, Filter } from "lucide-react"

export default function StorePage({ params }: { params: { storeId: string } }) {
  const store = stores.find((s) => s.id === params.storeId)
  const storeProducts = products.filter((p) => p.storeId === params.storeId)

  if (!store) {
    return <div className="container mx-auto px-4 py-8">Store not found</div>
  }

  const breadcrumbItems = [{ label: "Stores", href: "/stores" }, { label: store.name }]

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={breadcrumbItems} />

      {/* Store Header */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-gray-900 to-gray-800 text-white mb-8">
        <div className="absolute inset-0">
          <Image
            src="/placeholder.svg?height=300&width=1200"
            alt={`${store.name} banner`}
            fill
            className="object-cover opacity-20"
          />
        </div>
        <div className="relative px-8 py-12 md:px-12 md:py-16">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden border-2 border-white/20 shadow-lg">
              <Image src={store.image || "/placeholder.svg"} alt={store.name} fill className="object-cover" />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-2xl md:text-3xl font-bold">{store.name}</h1>
                <Badge className="bg-green-500 text-white text-xs">
                  <div className="w-2 h-2 bg-white rounded-full mr-1"></div>
                  Open
                </Badge>
              </div>

              <p className="text-lg text-gray-300 mb-4">{store.description}</p>

              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">4.8</span>
                  <span className="text-gray-400">(2,340 reviews)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span>30-45 min delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span>2.5 km away</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Heart className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Share2 className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Phone className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Store Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">Free</div>
            <div className="text-gray-600 text-sm">Delivery on orders above ₦5,000</div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 mb-2">30-45</div>
            <div className="text-gray-600 text-sm">Minutes average delivery time</div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 mb-2">500+</div>
            <div className="text-gray-600 text-sm">Products available</div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Our Products</h2>
            <p className="text-gray-600">Fresh products, great prices, fast delivery</p>
          </div>
          <Button variant="outline" className="flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-50">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {storeProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  )
}
