import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Loader2, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminProtectedRoute } from '@/components/admin/AdminProtectedRoute';
import { toast } from 'sonner';
import { categories as localCategories } from '@/data/services';

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>(
    localCategories.map(c => ({
      id: c.id,
      name: c.name,
      slug: c.id,
      icon: c.icon,
      description: c.description,
    }))
  );
  const [isLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    icon: '',
    description: '',
  });

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const openCreateDialog = () => {
    setEditingCategory(null);
    setFormData({ name: '', slug: '', icon: '', description: '' });
    setIsDialogOpen(true);
  };

  const openEditDialog = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      icon: category.icon || '',
      description: category.description || '',
    });
    setIsDialogOpen(true);
  };

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: editingCategory ? formData.slug : generateSlug(name),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    if (editingCategory) {
      setCategories(prev =>
        prev.map(c => c.id === editingCategory.id ? { ...c, ...formData } : c)
      );
      toast.success('Category updated successfully');
    } else {
      const newCategory: Category = {
        id: `cat-${Date.now()}`,
        ...formData,
      };
      setCategories(prev => [...prev, newCategory]);
      toast.success('Category created successfully');
    }

    setIsDialogOpen(false);
    setIsSaving(false);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    setCategories(prev => prev.filter(c => c.id !== id));
    toast.success('Category deleted successfully');
  };

  return (
    <AdminProtectedRoute>
      <AdminLayout>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl font-bold">Categories</h1>
              <p className="text-muted-foreground">Manage service categories</p>
            </div>
            <Button variant="gold" onClick={openCreateDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gold" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.length === 0 ? (
                <Card className="col-span-full p-8 text-center text-muted-foreground">
                  No categories found. Create your first category to get started.
                </Card>
              ) : (
                categories.map((category) => (
                  <Card key={category.id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center text-2xl">
                          {category.icon || '📦'}
                        </div>
                        <div>
                          <h3 className="font-semibold">{category.name}</h3>
                          <p className="text-sm text-muted-foreground">{category.slug}</p>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditDialog(category)}>
                            <Edit2 className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(category.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    {category.description && (
                      <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                        {category.description}
                      </p>
                    )}
                  </Card>
                ))
              )}
            </div>
          )}

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingCategory ? 'Edit Category' : 'Create Category'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="icon">Icon (emoji)</Label>
                  <Input
                    id="icon"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    placeholder="💍"
                    maxLength={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="gold" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : editingCategory ? (
                      'Update Category'
                    ) : (
                      'Create Category'
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </motion.div>
      </AdminLayout>
    </AdminProtectedRoute>
  );
}
