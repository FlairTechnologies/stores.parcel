import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Clock, MapPin, Truck } from "lucide-react"
import type { Store } from "@/lib/types"

export default function StoreCard({ store }: { store: Store }) {
  return (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-200 hover:border-gray-300">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={store.image}
          alt={store.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
        <div className="absolute top-4 left-4">
          <Badge className={`text-white text-xs ${store.isOpen ? 'bg-green-500' : 'bg-red-500'}`}>
            <div className={`w-2 h-2 rounded-full mr-1 ${store.isOpen ? 'bg-white' : 'bg-white'}`}></div>
            {store.isOpen ? 'Open' : 'Closed'}
          </Badge>
        </div>
        <div className="absolute top-4 right-4">
          <Badge className="bg-white/95 text-gray-700 text-xs">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
            {store.rating > 0 ? store.rating.toFixed(1) : 'New'}
          </Badge>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-yellow-600 transition-colors">
              {store.name}
            </h3>
            <p className="text-gray-600 text-sm line-clamp-2">{store.description}</p>
          </div>
        </div>

        <div className="mb-3">
          <Badge variant="outline" className="text-xs">
            {store.category}
          </Badge>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>30-45 min</span>
          </div>
          <div className="flex items-center gap-1">
            <Truck className="h-4 w-4" />
            <span>₦200 delivery</span>
          </div>
          {store.totalRatings > 0 && (
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4" />
              <span>({store.totalRatings})</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 text-sm text-gray-500 mb-4">
          <MapPin className="h-4 w-4" />
          <span className="truncate">{store.address}</span>
        </div>

        <Link href={`/stores/${store.id}`}>
          <Button 
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2.5 rounded-lg shadow-sm hover:shadow transition-all"
            disabled={!store.isOpen}
          >
            {store.isOpen ? 'Visit Store' : 'Store Closed'}
          </Button>
        </Link>
      </div>
    </div>
  )
}