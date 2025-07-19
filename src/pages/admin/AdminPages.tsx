import { useState, useEffect, useCallback } from 'react'
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Textarea } from '../../components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog'
import { Badge } from '../../components/ui/badge'
import { Switch } from '../../components/ui/switch'
import { useToast } from '../../hooks/use-toast'
import blink from '../../blink/client'

interface Page {
  id: string
  titleEn: string
  titleKa: string
  slug: string
  contentEn?: string
  contentKa?: string
  isPublished: boolean
  createdAt: string
  updatedAt: string
}

const AdminPages = () => {
  const [pages, setPages] = useState<Page[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPage, setEditingPage] = useState<Page | null>(null)
  const [formData, setFormData] = useState({
    titleEn: '',
    titleKa: '',
    slug: '',
    contentEn: '',
    contentKa: ''
  })
  const { toast } = useToast()

  const fetchPages = useCallback(async () => {
    try {
      const result = await blink.db.pages.list({
        orderBy: { createdAt: 'desc' }
      })
      
      setPages(result.map(page => ({
        id: page.id,
        titleEn: page.title_en,
        titleKa: page.title_ka,
        slug: page.slug,
        contentEn: page.content_en,
        contentKa: page.content_ka,
        isPublished: Number(page.is_published) > 0,
        createdAt: page.created_at,
        updatedAt: page.updated_at
      })))
    } catch (error) {
      console.error('Error fetching pages:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch pages',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchPages()
  }, [fetchPages])

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.titleEn || !formData.titleKa || !formData.slug) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      })
      return
    }

    try {
      const user = await blink.auth.me()
      const pageData = {
        titleEn: formData.titleEn,
        titleKa: formData.titleKa,
        slug: formData.slug,
        contentEn: formData.contentEn || null,
        contentKa: formData.contentKa || null,
        isPublished: true,
        userId: user.id
      }

      if (editingPage) {
        await blink.db.pages.update(editingPage.id, pageData)
        toast({
          title: 'Success',
          description: 'Page updated successfully'
        })
      } else {
        await blink.db.pages.create({
          id: `page_${Date.now()}`,
          ...pageData
        })
        toast({
          title: 'Success',
          description: 'Page created successfully'
        })
      }

      setIsDialogOpen(false)
      setEditingPage(null)
      setFormData({
        titleEn: '',
        titleKa: '',
        slug: '',
        contentEn: '',
        contentKa: ''
      })
      fetchPages()
    } catch (error) {
      console.error('Error saving page:', error)
      toast({
        title: 'Error',
        description: 'Failed to save page',
        variant: 'destructive'
      })
    }
  }

  const handleEdit = (page: Page) => {
    setEditingPage(page)
    setFormData({
      titleEn: page.titleEn,
      titleKa: page.titleKa,
      slug: page.slug,
      contentEn: page.contentEn || '',
      contentKa: page.contentKa || ''
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (pageId: string) => {
    if (!confirm('Are you sure you want to delete this page?')) return

    try {
      await blink.db.pages.delete(pageId)
      toast({
        title: 'Success',
        description: 'Page deleted successfully'
      })
      fetchPages()
    } catch (error) {
      console.error('Error deleting page:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete page',
        variant: 'destructive'
      })
    }
  }

  const togglePageStatus = async (page: Page) => {
    try {
      await blink.db.pages.update(page.id, {
        isPublished: !page.isPublished
      })
      toast({
        title: 'Success',
        description: `Page ${page.isPublished ? 'unpublished' : 'published'} successfully`
      })
      fetchPages()
    } catch (error) {
      console.error('Error updating page status:', error)
      toast({
        title: 'Error',
        description: 'Failed to update page status',
        variant: 'destructive'
      })
    }
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Pages Management</h1>
            <p className="text-muted-foreground">Manage website content pages</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingPage(null)
                setFormData({
                  titleEn: '',
                  titleKa: '',
                  slug: '',
                  contentEn: '',
                  contentKa: ''
                })
              }}>
                <Plus className="mr-2 h-4 w-4" />
                Add Page
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingPage ? 'Edit Page' : 'Add New Page'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="titleEn">Title (English) *</Label>
                    <Input
                      id="titleEn"
                      value={formData.titleEn}
                      onChange={(e) => {
                        const title = e.target.value
                        setFormData(prev => ({ 
                          ...prev, 
                          titleEn: title,
                          slug: prev.slug || generateSlug(title)
                        }))
                      }}
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
                  <Label htmlFor="slug">URL Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="about-us"
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    This will be the URL: /{formData.slug}
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="contentEn">Content (English)</Label>
                    <Textarea
                      id="contentEn"
                      value={formData.contentEn}
                      onChange={(e) => setFormData(prev => ({ ...prev, contentEn: e.target.value }))}
                      rows={10}
                      placeholder="Enter page content in English..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="contentKa">Content (Georgian)</Label>
                    <Textarea
                      id="contentKa"
                      value={formData.contentKa}
                      onChange={(e) => setFormData(prev => ({ ...prev, contentKa: e.target.value }))}
                      rows={10}
                      placeholder="Enter page content in Georgian..."
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-4 border-t">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingPage ? 'Update Page' : 'Create Page'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Pages List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-3 bg-muted rounded mb-4"></div>
                  <div className="h-8 bg-muted rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : pages.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No pages found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pages.map((page) => (
              <Card key={page.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-foreground truncate">
                          {page.titleEn}
                        </h3>
                        <Badge variant={page.isPublished ? 'default' : 'secondary'}>
                          {page.isPublished ? 'Published' : 'Draft'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2 truncate">
                        {page.titleKa}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        /{page.slug}
                      </p>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground mb-4">
                    <p>Created: {new Date(page.createdAt).toLocaleDateString()}</p>
                    <p>Updated: {new Date(page.updatedAt).toLocaleDateString()}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Label htmlFor={`published-${page.id}`} className="text-xs">
                        Published
                      </Label>
                      <Switch
                        id={`published-${page.id}`}
                        checked={page.isPublished}
                        onCheckedChange={() => togglePageStatus(page)}
                      />
                    </div>

                    <div className="flex items-center space-x-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(page)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(page.id)}
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
            <CardTitle>Page Management Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• Pages are accessible via their URL slug (e.g., /about-us)</p>
              <p>• URL slugs should be lowercase, use hyphens instead of spaces</p>
              <p>• Content supports basic text formatting and line breaks</p>
              <p>• Only published pages will be visible on the website</p>
              <p>• Both English and Georgian content should be provided for bilingual support</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AdminPages