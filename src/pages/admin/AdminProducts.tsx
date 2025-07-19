import { useState, useEffect, useCallback } from 'react'
import { Plus, Edit, Trash2, Search, Eye, EyeOff } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Textarea } from '../../components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog'
import { Badge } from '../../components/ui/badge'
import { useToast } from '../../hooks/use-toast'
import blink from '../../blink/client'

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
  createdAt: string
}

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    nameEn: '',
    nameKa: '',
    descriptionEn: '',
    descriptionKa: '',
    pricePerKg: '',
    imageUrl: '',
    category: 'main'
  })
  const { toast } = useToast()

  const fetchProducts = useCallback(async () => {
    try {
      const result = await blink.db.products.list({
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
        isActive: Number(p.is_active) > 0,
        createdAt: p.created_at
      })))
    } catch (error) {
      console.error('Error fetching products:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch products',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.nameEn || !formData.nameKa || !formData.pricePerKg) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      })
      return
    }

    try {
      const user = await blink.auth.me()
      const productData = {
        nameEn: formData.nameEn,
        nameKa: formData.nameKa,
        descriptionEn: formData.descriptionEn || null,
        descriptionKa: formData.descriptionKa || null,
        pricePerKg: parseFloat(formData.pricePerKg),
        imageUrl: formData.imageUrl || null,
        category: formData.category,
        isActive: true,
        userId: user.id
      }

      if (editingProduct) {
        await blink.db.products.update(editingProduct.id, productData)
        toast({
          title: 'Success',
          description: 'Product updated successfully'
        })
      } else {
        await blink.db.products.create({
          id: `prod_${Date.now()}`,
          ...productData
        })
        toast({
          title: 'Success',
          description: 'Product created successfully'
        })
      }

      setIsDialogOpen(false)
      setEditingProduct(null)
      setFormData({
        nameEn: '',
        nameKa: '',
        descriptionEn: '',
        descriptionKa: '',
        pricePerKg: '',
        imageUrl: '',
        category: 'main'
      })
      fetchProducts()
    } catch (error) {
      console.error('Error saving product:', error)
      toast({
        title: 'Error',
        description: 'Failed to save product',
        variant: 'destructive'
      })
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      nameEn: product.nameEn,
      nameKa: product.nameKa,
      descriptionEn: product.descriptionEn || '',
      descriptionKa: product.descriptionKa || '',
      pricePerKg: product.pricePerKg.toString(),
      imageUrl: product.imageUrl || '',
      category: product.category
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      await blink.db.products.delete(productId)
      toast({
        title: 'Success',
        description: 'Product deleted successfully'
      })
      fetchProducts()
    } catch (error) {
      console.error('Error deleting product:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete product',
        variant: 'destructive'
      })
    }
  }

  const toggleProductStatus = async (product: Product) => {
    try {
      await blink.db.products.update(product.id, {
        isActive: !product.isActive
      })
      toast({
        title: 'Success',
        description: `Product ${product.isActive ? 'deactivated' : 'activated'} successfully`
      })
      fetchProducts()
    } catch (error) {
      console.error('Error updating product status:', error)
      toast({
        title: 'Error',
        description: 'Failed to update product status',
        variant: 'destructive'
      })
    }
  }

  const filteredProducts = products.filter(product =>
    product.nameEn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.nameKa?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Products Management</h1>
            <p className="text-muted-foreground">Manage your product catalog</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingProduct(null)
                setFormData({
                  nameEn: '',
                  nameKa: '',
                  descriptionEn: '',
                  descriptionKa: '',
                  pricePerKg: '',
                  imageUrl: '',
                  category: 'main'
                })
              }}>
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nameEn">Name (English) *</Label>
                    <Input
                      id="nameEn"
                      value={formData.nameEn}
                      onChange={(e) => setFormData(prev => ({ ...prev, nameEn: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="nameKa">Name (Georgian) *</Label>
                    <Input
                      id="nameKa"
                      value={formData.nameKa}
                      onChange={(e) => setFormData(prev => ({ ...prev, nameKa: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="descriptionEn">Description (English)</Label>
                    <Textarea
                      id="descriptionEn"
                      value={formData.descriptionEn}
                      onChange={(e) => setFormData(prev => ({ ...prev, descriptionEn: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="descriptionKa">Description (Georgian)</Label>
                    <Textarea
                      id="descriptionKa"
                      value={formData.descriptionKa}
                      onChange={(e) => setFormData(prev => ({ ...prev, descriptionKa: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="pricePerKg">Price per KG (₾) *</Label>
                    <Input
                      id="pricePerKg"
                      type="number"
                      step="0.01"
                      value={formData.pricePerKg}
                      onChange={(e) => setFormData(prev => ({ ...prev, pricePerKg: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <select
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-input rounded-md"
                    >
                      <option value="main">Main Products</option>
                      <option value="special">Special Items</option>
                      <option value="seasonal">Seasonal</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="imageUrl">Image URL</Label>
                  <Input
                    id="imageUrl"
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingProduct ? 'Update Product' : 'Create Product'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="aspect-square bg-muted"></div>
                <CardContent className="p-4">
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-3 bg-muted rounded mb-4"></div>
                  <div className="h-8 bg-muted rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <div className="aspect-square overflow-hidden relative">
                  <img
                    src={product.imageUrl || 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=400&fit=crop'}
                    alt={product.nameEn}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2">
                    <Badge variant={product.isActive ? 'default' : 'secondary'}>
                      {product.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-foreground mb-1">
                    {product.nameEn}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {product.nameKa}
                  </p>
                  <p className="text-lg font-bold text-primary mb-4">
                    {product.pricePerKg}₾ per kg
                  </p>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(product)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleProductStatus(product)}
                    >
                      {product.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(product.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminProducts