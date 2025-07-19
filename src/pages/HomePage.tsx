import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Star, Clock, Truck } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
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

interface HomePageProps {
  language: 'en' | 'ka'
  addToCart: (item: Omit<CartItem, 'id'>) => void
}

const HomePage = ({ language, addToCart }: HomePageProps) => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const products = await blink.db.products.list({
          where: { isActive: "1" },
          limit: 3
        })
        
        setFeaturedProducts(products.map(p => ({
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

    fetchFeaturedProducts()
  }, [])

  const content = {
    en: {
      hero: {
        title: 'Traditional Georgian Roasted Pork',
        subtitle: 'Authentic flavors delivered fresh to your door',
        cta: 'Order Now',
        viewProducts: 'View All Products'
      },
      features: {
        title: 'Why Choose Piwkina.ge?',
        items: [
          {
            icon: Star,
            title: 'Premium Quality',
            description: 'Only the finest ingredients and traditional recipes'
          },
          {
            icon: Clock,
            title: 'Fresh Daily',
            description: 'Prepared fresh every day with authentic Georgian methods'
          },
          {
            icon: Truck,
            title: 'Fast Delivery',
            description: 'Quick and reliable delivery throughout Tbilisi'
          }
        ]
      },
      products: {
        title: 'Featured Products',
        pricePerKg: 'per kg',
        addToCart: 'Add to Cart'
      }
    },
    ka: {
      hero: {
        title: 'ტრადიციული ქართული შემწვარი გოჭი',
        subtitle: 'ავთენტური გემო მიტანილი ახლად თქვენს კართან',
        cta: 'შეკვეთა ახლავე',
        viewProducts: 'ყველა პროდუქტის ნახვა'
      },
      features: {
        title: 'რატომ აირჩიოთ Piwkina.ge?',
        items: [
          {
            icon: Star,
            title: 'პრემიუმ ხარისხი',
            description: 'მხოლოდ საუკეთესო ინგრედიენტები და ტრადიციული რეცეპტები'
          },
          {
            icon: Clock,
            title: 'ყოველდღე ახალი',
            description: 'ყოველდღე ახლად მომზადებული ავთენტური ქართული მეთოდებით'
          },
          {
            icon: Truck,
            title: 'სწრაფი მიტანა',
            description: 'სწრაფი და საიმედო მიტანა მთელ თბილისში'
          }
        ]
      },
      products: {
        title: 'რჩეული პროდუქტები',
        pricePerKg: 'კგ-ზე',
        addToCart: 'კალათაში დამატება'
      }
    }
  }

  const t = content[language]

  const handleAddToCart = (product: Product, weightKg: number = 1) => {
    addToCart({
      productId: product.id,
      name: language === 'en' ? product.nameEn : product.nameKa,
      pricePerKg: product.pricePerKg,
      weightKg,
      totalPrice: product.pricePerKg * weightKg,
      imageUrl: product.imageUrl
    })
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-accent/10 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                {t.hero.title}
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-lg">
                {t.hero.subtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/products">
                  <Button size="lg" className="w-full sm:w-auto">
                    {t.hero.cta}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/products">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    {t.hero.viewProducts}
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden bg-muted">
                <img
                  src="https://images.unsplash.com/photo-1544025162-d76694265947?w=600&h=600&fit=crop"
                  alt="Traditional Georgian Roasted Pork"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-primary text-primary-foreground p-4 rounded-xl shadow-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold">25₾</div>
                  <div className="text-sm opacity-90">{t.products.pricePerKg}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              {t.features.title}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {t.features.items.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="text-center border-0 shadow-sm">
                  <CardContent className="pt-8 pb-6">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              {t.products.title}
            </h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
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
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={product.imageUrl || 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=400&fit=crop'}
                      alt={language === 'en' ? product.nameEn : product.nameKa}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {language === 'en' ? product.nameEn : product.nameKa}
                    </h3>
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {language === 'en' ? product.descriptionEn : product.descriptionKa}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-primary">
                        {product.pricePerKg}₾ <span className="text-sm font-normal text-muted-foreground">{t.products.pricePerKg}</span>
                      </div>
                      <Button onClick={() => handleAddToCart(product)}>
                        {t.products.addToCart}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/products">
              <Button variant="outline" size="lg">
                {t.hero.viewProducts}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage