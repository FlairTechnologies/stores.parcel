"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import axios from "axios"
import ProductCard from "@/components/product-card"
import Breadcrumb from "@/components/breadcrumb"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Clock, MapPin, Phone, Heart, Share2, Filter, Loader2 } from "lucide-react"
import { getToken } from "@/storage/tokenStorage"
import { Store as BaseStore } from "@/lib/types"

interface Store extends BaseStore {
  reviewCount?: number
  deliveryTime?: string
  distance?: string
  phone?: string
  email?: string
}

interface Product {
  id: string
  name: string
  price: number
  image: string
  description?: string
  storeId: string
  category?: string
  inStock?: boolean
  discount?: number
  discountPrice?: number
}

export default function StorePage() {
  const params = useParams()
  const storeId = params.storeId as string

  const [store, setStore] = useState<Store | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Transform API product data to match component expectations
  const transformProduct = (apiProduct: any): Product => ({
    id: apiProduct._id,
    name: apiProduct.descr || "Unnamed Product",
    price: parseFloat(apiProduct.price) || 0,
    image: apiProduct.imgs?.[0] ? String(apiProduct.imgs[0]) : "/placeholder.svg",
    description: apiProduct.descr,
    storeId: apiProduct.store?._id || storeId,
    inStock: apiProduct.inStock ?? true,
    discount: apiProduct.discount || 0,
    discountPrice: parseFloat(apiProduct.discountPrice) || 0
  })

  // Helper to extract store data from a product's store field
  const createStoreFromProduct = (apiProduct: any): Store => {
    const s = apiProduct.store || {}
    return {
      id: s._id || storeId,
      _id: s._id || storeId,
      name: s.name || "Unnamed Store",
      image: s.image || "/placeholder.svg",
      description: s.description || "",
      rating: s.rating || 0,
      isOpen: s.isOpen !== false,
      reviewCount: s.reviewCount || 0,
      deliveryTime: s.deliveryTime || "30-45 min delivery",
      distance: s.distance || "2.5 km away",
      category: s.category || "",
      totalRatings: s.totalRatings || 0,
      address: s.address || "",
      owner: s.owner || "",
      phone: s.phone || "",
      email: s.email || "",
      createdAt: s.createdAt || "",
      updatedAt: s.updatedAt || ""
    }
  }

  useEffect(() => {
    const fetchStoreData = async () => {
      const token = getToken()
      if (!storeId) {
        setError('Store ID not found')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        
        // Fetch products data from API
        const response = await axios.get(`/api/products/stores/${storeId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        
        if (response.data && response.data.status === 200) {
          const apiProducts = response.data.data || []
          
          // Transform products
          const transformedProducts = apiProducts.map(transformProduct)
          setProducts(transformedProducts)
          
          // Create store object from first product (if available)
          if (apiProducts.length > 0) {
            const storeData = createStoreFromProduct(apiProducts[0])
            setStore(storeData)
            return
          }
        } else {
          setError('Failed to load store data')
        }
      } catch (err) {
        console.error('Error fetching store data:', err)
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 404) {
            setError('Store not found')
          } else if (err.response?.status === 401) {
            setError('Unauthorized. Please log in again.')
          } else {
            setError('Failed to load store data. Please try again.')
          }
        } else {
          setError('An unexpected error occurred')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchStoreData()
  }, [storeId])

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading store...</span>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !store) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {error || 'Store not found'}
          </h2>
          <p className="text-gray-600 mb-4">
            The store you're looking for doesn't exist or couldn't be loaded.
          </p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  const breadcrumbItems = [
    { label: "Stores", href: "/stores" }, 
    { label: store.name }
  ]

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
              <Image 
                src={store.image || "/placeholder.svg"} 
                alt={store.name} 
                fill 
                className="object-cover" 
              />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-2xl md:text-3xl font-bold">{store.name}</h1>
                <Badge className={`text-white text-xs ${store.isOpen !== false ? 'bg-green-500' : 'bg-red-500'}`}>
                  <div className={`w-2 h-2 rounded-full mr-1 ${store.isOpen !== false ? 'bg-white' : 'bg-white'}`}></div>
                  {store.isOpen !== false ? 'Open' : 'Closed'}
                </Badge>
              </div>

              <p className="text-lg text-gray-300 mb-4">{store.description}</p>

              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{store.rating || '0'}</span>
                  <span className="text-gray-400">({store.reviewCount || '0'} reviews)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span>{store.deliveryTime || '30-45 min delivery'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span>{store.distance || '2.5 km away'}</span>
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
            <div className="text-2xl font-bold text-gray-900 mb-2">{products.length}</div>
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

        {products.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No products available</h3>
            <p className="text-gray-500">This store hasn't added any products yet. Check back later!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}