import { useState, useEffect } from 'react'
import { Search, Filter, Plus, Minus } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Badge } from '../components/ui/badge'
import blink from '../blink/client'
import type { CartItem } from '../App'

interface Product {
  id: string
  nameEn: string
  nameKa: string
  descriptionEn?: string
  descriptionKa?: string
  pricePerKg: number
  imageUrl?: string
  category: string
  isActive: boolean
}

interface ProductsPageProps {
  language: 'en' | 'ka'
  addToCart: (item: Omit<CartItem, 'id'>) => void
}

const ProductsPage = ({ language, addToCart }: ProductsPageProps) => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [quantities, setQuantities] = useState<Record<string, number>>({})

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const result = await blink.db.products.list({
          where: { isActive: "1" },
          orderBy: { createdAt: 'desc' }
        })
        
        setProducts(result.map(p => ({
          id: p.id,
          nameEn: p.name_en,
          nameKa: p.name_ka,
          descriptionEn: p.description_en,
          descriptionKa: p.description_ka,
          pricePerKg: p.price_per_kg,
          imageUrl: p.image_url,
          category: p.category,
          isActive: Number(p.is_active) > 0
        })))
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const content = {
    en: {
      title: 'Our Products',
      subtitle: 'Fresh, traditional Georgian roasted pork delivered to your door',
      search: 'Search products...',
      category: 'Category',
      allCategories: 'All Categories',
      pricePerKg: 'per kg',
      addToCart: 'Add to Cart',
      quantity: 'Quantity (kg)',
      noProducts: 'No products found',
      noProductsDesc: 'Try adjusting your search or filter criteria'
    },
    ka: {
      title: 'ჩვენი პროდუქტები',
      subtitle: 'ახალი, ტრადიციული ქართული შემწვარი გოჭი მიტანილი თქვენს კართან',
      search: 'პროდუქტების ძიება...',
      category: 'კატეგორია',
      allCategories: 'ყველა კატეგორია',
      pricePerKg: 'კგ-ზე',
      addToCart: 'კალათაში დამატება',
      quantity: 'რაოდენობა (კგ)',
      noProducts: 'პროდუქტები ვერ მოიძებნა',
      noProductsDesc: 'სცადეთ ძიების ან ფილტრის კრიტერიუმების შეცვლა'
    }
  }

  const t = content[language]

  const categories = ['all', 'main', 'special', 'seasonal']
  const categoryNames = {
    en: {
      all: 'All Categories',
      main: 'Main Products',
      special: 'Special Items',
      seasonal: 'Seasonal'
    },
    ka: {
      all: 'ყველა კატეგორია',
      main: 'მთავარი პროდუქტები',
      special: 'სპეციალური',
      seasonal: 'სეზონური'
    }
  }

  const filteredProducts = products.filter(product => {
    const name = language === 'en' ? product.nameEn : product.nameKa
    const description = language === 'en' ? product.descriptionEn : product.descriptionKa
    
    const matchesSearch = (
      name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const updateQuantity = (productId: string, change: number) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(0.5, (prev[productId] || 1) + change)
    }))
  }

  const handleAddToCart = (product: Product) => {
    const quantity = quantities[product.id] || 1
    addToCart({
      productId: product.id,
      name: language === 'en' ? product.nameEn : product.nameKa,
      pricePerKg: product.pricePerKg,
      weightKg: quantity,
      totalPrice: product.pricePerKg * quantity,
      imageUrl: product.imageUrl
    })
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {t.title}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={t.search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder={t.category} />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {categoryNames[language][category as keyof typeof categoryNames.en]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="overflow-hidden">
                <div className="aspect-square bg-muted animate-pulse" />
                <CardContent className="p-6">
                  <div className="h-6 bg-muted rounded animate-pulse mb-2" />
                  <div className="h-4 bg-muted rounded animate-pulse mb-4" />
                  <div className="h-10 bg-muted rounded animate-pulse" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {t.noProducts}
            </h3>
            <p className="text-muted-foreground">
              {t.noProductsDesc}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => {
              const quantity = quantities[product.id] || 1
              return (
                <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-square overflow-hidden relative">
                    <img
                      src={product.imageUrl || 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=400&fit=crop'}
                      alt={language === 'en' ? product.nameEn : product.nameKa}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-3 left-3 bg-primary">
                      {categoryNames[language][product.category as keyof typeof categoryNames.en]}
                    </Badge>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {language === 'en' ? product.nameEn : product.nameKa}
                    </h3>
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {language === 'en' ? product.descriptionEn : product.descriptionKa}
                    </p>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold text-primary">
                          {product.pricePerKg}₾ 
                          <span className="text-sm font-normal text-muted-foreground ml-1">
                            {t.pricePerKg}
                          </span>
                        </div>
                      </div>

                      {/* Quantity Selector */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          {t.quantity}
                        </label>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(product.id, -0.5)}
                            disabled={quantity <= 0.5}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-16 text-center font-medium">
                            {quantity} kg
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(product.id, 0.5)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="text-lg font-semibold text-foreground">
                          Total: {(product.pricePerKg * quantity).toFixed(2)}₾
                        </div>
                        <Button onClick={() => handleAddToCart(product)}>
                          {t.addToCart}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductsPage