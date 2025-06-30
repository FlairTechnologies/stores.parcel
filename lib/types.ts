// lib/types.ts
export interface Store {
  _id: string
  id: string
  name: string
  description: string
  image: string
  category: string
  rating: number
  totalRatings: number
  address: string
  isOpen: boolean
  owner: string
  createdAt: string
  updatedAt: string
}

export interface Product {
  id: string
  storeId: string
  name: string
  price: number
  image: string
}

export interface CartItem extends Product {
  quantity: number
  storeName: string
}
