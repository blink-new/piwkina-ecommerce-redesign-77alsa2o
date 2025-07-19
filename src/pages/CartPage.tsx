import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Textarea } from '../components/ui/textarea'
import { Separator } from '../components/ui/separator'
import { useToast } from '../hooks/use-toast'
import blink from '../blink/client'
import type { CartItem } from '../App'

interface CartPageProps {
  language: 'en' | 'ka'
  cart: CartItem[]
  removeFromCart: (itemId: string) => void
  clearCart: () => void
}

const CartPage = ({ language, cart, removeFromCart, clearCart }: CartPageProps) => {
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    notes: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const content = {
    en: {
      title: 'Shopping Cart',
      emptyCart: 'Your cart is empty',
      emptyCartDesc: 'Add some delicious products to get started',
      continueShopping: 'Continue Shopping',
      item: 'Item',
      quantity: 'Quantity',
      price: 'Price',
      total: 'Total',
      subtotal: 'Subtotal',
      delivery: 'Delivery',
      free: 'Free',
      grandTotal: 'Grand Total',
      checkout: 'Checkout',
      customerInfo: 'Customer Information',
      name: 'Full Name',
      phone: 'Phone Number',
      email: 'Email (optional)',
      address: 'Delivery Address',
      notes: 'Order Notes (optional)',
      placeOrder: 'Place Order',
      orderSuccess: 'Order placed successfully!',
      orderError: 'Failed to place order. Please try again.',
      remove: 'Remove'
    },
    ka: {
      title: 'სავაჭრო კალათა',
      emptyCart: 'თქვენი კალათა ცარიელია',
      emptyCartDesc: 'დაამატეთ გემრიელი პროდუქტები დასაწყებად',
      continueShopping: 'შოპინგის გაგრძელება',
      item: 'პროდუქტი',
      quantity: 'რაოდენობა',
      price: 'ფასი',
      total: 'ჯამი',
      subtotal: 'ქვეჯამი',
      delivery: 'მიტანა',
      free: 'უფასო',
      grandTotal: 'საერთო ჯამი',
      checkout: 'შეკვეთა',
      customerInfo: 'მყიდველის ინფორმაცია',
      name: 'სრული სახელი',
      phone: 'ტელეფონის ნომერი',
      email: 'ელ-ფოსტა (არასავალდებულო)',
      address: 'მიტანის მისამართი',
      notes: 'შეკვეთის შენიშვნები (არასავალდებულო)',
      placeOrder: 'შეკვეთის გაფორმება',
      orderSuccess: 'შეკვეთა წარმატებით გაფორმდა!',
      orderError: 'შეკვეთის გაფორმება ვერ მოხერხდა. გთხოვთ სცადოთ ხელახლა.',
      remove: 'წაშლა'
    }
  }

  const t = content[language]

  const subtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0)
  const deliveryFee = 0 // Free delivery
  const grandTotal = subtotal + deliveryFee

  const handleSubmitOrder = async () => {
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
      toast({
        title: language === 'en' ? 'Missing Information' : 'ნაკლული ინფორმაცია',
        description: language === 'en' 
          ? 'Please fill in all required fields' 
          : 'გთხოვთ შეავსოთ ყველა სავალდებულო ველი',
        variant: 'destructive'
      })
      return
    }

    if (cart.length === 0) {
      toast({
        title: language === 'en' ? 'Empty Cart' : 'ცარიელი კალათა',
        description: language === 'en' 
          ? 'Please add items to your cart first' 
          : 'გთხოვთ ჯერ დაამატოთ პროდუქტები კალათაში',
        variant: 'destructive'
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Create order
      const orderId = `order_${Date.now()}`
      const user = await blink.auth.me()
      
      await blink.db.orders.create({
        id: orderId,
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone,
        customerEmail: customerInfo.email || null,
        customerAddress: customerInfo.address,
        totalAmount: grandTotal,
        status: 'pending',
        notes: customerInfo.notes || null,
        userId: user.id
      })

      // Create order items
      for (const item of cart) {
        await blink.db.orderItems.create({
          id: `item_${Date.now()}_${Math.random()}`,
          orderId,
          productId: item.productId,
          quantity: 1,
          weightKg: item.weightKg,
          unitPrice: item.pricePerKg,
          totalPrice: item.totalPrice,
          userId: user.id
        })
      }

      toast({
        title: t.orderSuccess,
        description: language === 'en' 
          ? 'We will contact you shortly to confirm your order' 
          : 'ჩვენ მალე დაგიკავშირდებით შეკვეთის დასადასტურებლად'
      })

      // Clear cart and form
      clearCart()
      setCustomerInfo({
        name: '',
        phone: '',
        email: '',
        address: '',
        notes: ''
      })

    } catch (error) {
      console.error('Error placing order:', error)
      toast({
        title: t.orderError,
        variant: 'destructive'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {t.emptyCart}
            </h2>
            <p className="text-muted-foreground mb-8">
              {t.emptyCartDesc}
            </p>
            <Link to="/products">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t.continueShopping}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">{t.title}</h1>
          <Link to="/products" className="text-primary hover:underline flex items-center">
            <ArrowLeft className="mr-1 h-4 w-4" />
            {t.continueShopping}
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>{t.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.imageUrl || 'https://images.unsplash.com/photo-1544025162-d76694265947?w=100&h=100&fit=crop'}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground truncate">
                          {item.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {item.pricePerKg}₾ {t.price.toLowerCase()} × {item.weightKg}kg
                        </p>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-semibold text-foreground">
                          {item.totalPrice.toFixed(2)}₾
                        </div>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary & Customer Info */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>{t.checkout}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t.subtotal}</span>
                  <span className="font-medium">{subtotal.toFixed(2)}₾</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t.delivery}</span>
                  <span className="font-medium text-green-600">{t.free}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-semibold">
                  <span>{t.grandTotal}</span>
                  <span>{grandTotal.toFixed(2)}₾</span>
                </div>
              </CardContent>
            </Card>

            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle>{t.customerInfo}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">{t.name} *</Label>
                  <Input
                    id="name"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">{t.phone} *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">{t.email}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="address">{t.address} *</Label>
                  <Textarea
                    id="address"
                    value={customerInfo.address}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, address: e.target.value }))}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="notes">{t.notes}</Label>
                  <Textarea
                    id="notes"
                    value={customerInfo.notes}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, notes: e.target.value }))}
                  />
                </div>

                <Button 
                  onClick={handleSubmitOrder} 
                  className="w-full" 
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {language === 'en' ? 'Processing...' : 'მუშავდება...'}
                    </div>
                  ) : (
                    t.placeOrder
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage