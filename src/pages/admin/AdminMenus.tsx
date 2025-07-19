import { useState, useEffect, useCallback } from 'react'
import { Plus, Edit, Trash2, GripVertical } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog'
import { Badge } from '../../components/ui/badge'
import { Switch } from '../../components/ui/switch'
import { useToast } from '../../hooks/use-toast'
import blink from '../../blink/client'

interface MenuItem {
  id: string
  titleEn: string
  titleKa: string
  url: string
  orderIndex: number
  isActive: boolean
}

const AdminMenus = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [formData, setFormData] = useState({
    titleEn: '',
    titleKa: '',
    url: '',
    orderIndex: 0
  })
  const { toast } = useToast()

  const fetchMenuItems = useCallback(async () => {
    try {
      const result = await blink.db.menuItems.list({
        orderBy: { orderIndex: 'asc' }
      })
      
      setMenuItems(result.map(item => ({
        id: item.id,
        titleEn: item.title_en,
        titleKa: item.title_ka,
        url: item.url,
        orderIndex: item.order_index,
        isActive: Number(item.is_active) > 0
      })))
    } catch (error) {
      console.error('Error fetching menu items:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch menu items',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchMenuItems()
  }, [fetchMenuItems])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.titleEn || !formData.titleKa || !formData.url) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      })
      return
    }

    try {
      const user = await blink.auth.me()
      const itemData = {
        titleEn: formData.titleEn,
        titleKa: formData.titleKa,
        url: formData.url,
        orderIndex: formData.orderIndex,
        isActive: true,
        userId: user.id
      }

      if (editingItem) {
        await blink.db.menuItems.update(editingItem.id, itemData)
        toast({
          title: 'Success',
          description: 'Menu item updated successfully'
        })
      } else {
        await blink.db.menuItems.create({
          id: `menu_${Date.now()}`,
          ...itemData
        })
        toast({
          title: 'Success',
          description: 'Menu item created successfully'
        })
      }

      setIsDialogOpen(false)
      setEditingItem(null)
      setFormData({
        titleEn: '',
        titleKa: '',
        url: '',
        orderIndex: 0
      })
      fetchMenuItems()
    } catch (error) {
      console.error('Error saving menu item:', error)
      toast({
        title: 'Error',
        description: 'Failed to save menu item',
        variant: 'destructive'
      })
    }
  }

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item)
    setFormData({
      titleEn: item.titleEn,
      titleKa: item.titleKa,
      url: item.url,
      orderIndex: item.orderIndex
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this menu item?')) return

    try {
      await blink.db.menuItems.delete(itemId)
      toast({
        title: 'Success',
        description: 'Menu item deleted successfully'
      })
      fetchMenuItems()
    } catch (error) {
      console.error('Error deleting menu item:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete menu item',
        variant: 'destructive'
      })
    }
  }

  const toggleItemStatus = async (item: MenuItem) => {
    try {
      await blink.db.menuItems.update(item.id, {
        isActive: !item.isActive
      })
      toast({
        title: 'Success',
        description: `Menu item ${item.isActive ? 'deactivated' : 'activated'} successfully`
      })
      fetchMenuItems()
    } catch (error) {
      console.error('Error updating menu item status:', error)
      toast({
        title: 'Error',
        description: 'Failed to update menu item status',
        variant: 'destructive'
      })
    }
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Menu Management</h1>
            <p className="text-muted-foreground">Manage website navigation menu</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingItem(null)
                setFormData({
                  titleEn: '',
                  titleKa: '',
                  url: '',
                  orderIndex: menuItems.length
                })
              }}>
                <Plus className="mr-2 h-4 w-4" />
                Add Menu Item
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="titleEn">Title (English) *</Label>
                    <Input
                      id="titleEn"
                      value={formData.titleEn}
                      onChange={(e) => setFormData(prev => ({ ...prev, titleEn: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="titleKa">Title (Georgian) *</Label>
                    <Input
                      id="titleKa"
                      value={formData.titleKa}
                      onChange={(e) => setFormData(prev => ({ ...prev, titleKa: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="url">URL *</Label>
                  <Input
                    id="url"
                    value={formData.url}
                    onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                    placeholder="/about"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="orderIndex">Order Index</Label>
                  <Input
                    id="orderIndex"
                    type="number"
                    value={formData.orderIndex}
                    onChange={(e) => setFormData(prev => ({ ...prev, orderIndex: parseInt(e.target.value) || 0 }))}
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingItem ? 'Update Menu Item' : 'Create Menu Item'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Menu Items List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-3 bg-muted rounded mb-4"></div>
                  <div className="h-8 bg-muted rounded w-32"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : menuItems.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No menu items found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {menuItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-foreground">
                            {item.titleEn}
                          </h3>
                          <Badge variant={item.isActive ? 'default' : 'secondary'}>
                            {item.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Georgian: {item.titleKa}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          URL: {item.url} • Order: {item.orderIndex}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-2">
                        <Label htmlFor={`active-${item.id}`} className="text-sm">
                          Active
                        </Label>
                        <Switch
                          id={`active-${item.id}`}
                          checked={item.isActive}
                          onCheckedChange={() => toggleItemStatus(item)}
                        />
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(item)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Instructions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Menu Management Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• Menu items are displayed in the website header navigation</p>
              <p>• Order Index determines the display order (lower numbers appear first)</p>
              <p>• URLs should start with "/" for internal pages (e.g., "/about", "/contact")</p>
              <p>• Use external URLs for links to other websites (e.g., "https://example.com")</p>
              <p>• Inactive menu items will not be displayed on the website</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AdminMenus