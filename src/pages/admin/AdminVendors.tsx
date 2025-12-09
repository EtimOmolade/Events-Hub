import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Search, Loader2, MoreVertical, Check, X, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { Switch } from '@/components/ui/switch';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminProtectedRoute } from '@/components/admin/AdminProtectedRoute';
import { toast } from 'sonner';
import { vendors as localVendors } from '@/data/services';

interface Vendor {
  id: string;
  name: string;
  specialty: string;
  bio: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  location: string;
  verified: boolean;
  portfolio: string[];
  active?: boolean;
}

export default function AdminVendors() {
  const [vendors, setVendors] = useState<Vendor[]>(
    localVendors.map(v => ({ ...v, active: true }))
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    specialty: '',
    bio: '',
    avatar: '',
    location: '',
    verified: false,
    active: true,
  });

  const openCreateDialog = () => {
    setEditingVendor(null);
    setFormData({
      name: '',
      specialty: '',
      bio: '',
      avatar: '',
      location: '',
      verified: false,
      active: true,
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (vendor: Vendor) => {
    setEditingVendor(vendor);
    setFormData({
      name: vendor.name,
      specialty: vendor.specialty || '',
      bio: vendor.bio || '',
      avatar: vendor.avatar || '',
      location: vendor.location || '',
      verified: vendor.verified,
      active: vendor.active ?? true,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    if (editingVendor) {
      setVendors(prev =>
        prev.map(v => v.id === editingVendor.id ? { ...v, ...formData } : v)
      );
      toast.success('Vendor updated successfully');
    } else {
      const newVendor: Vendor = {
        id: `vendor-${Date.now()}`,
        ...formData,
        rating: 4.5,
        reviewCount: 0,
        portfolio: [],
      };
      setVendors(prev => [...prev, newVendor]);
      toast.success('Vendor created successfully');
    }

    setIsDialogOpen(false);
    setIsSaving(false);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this vendor?')) return;
    setVendors(prev => prev.filter(v => v.id !== id));
    toast.success('Vendor deleted successfully');
  };

  const toggleActive = (vendor: Vendor) => {
    setVendors(prev =>
      prev.map(v => v.id === vendor.id ? { ...v, active: !v.active } : v)
    );
  };

  const toggleVerified = (vendor: Vendor) => {
    setVendors(prev =>
      prev.map(v => v.id === vendor.id ? { ...v, verified: !v.verified } : v)
    );
    toast.success(vendor.verified ? 'Vendor unverified' : 'Vendor verified');
  };

  const filteredVendors = vendors.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.specialty?.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'active') return matchesSearch && v.active;
    if (activeTab === 'inactive') return matchesSearch && !v.active;
    if (activeTab === 'verified') return matchesSearch && v.verified;
    return matchesSearch;
  });

  const activeCount = vendors.filter(v => v.active).length;
  const inactiveCount = vendors.filter(v => !v.active).length;
  const verifiedCount = vendors.filter(v => v.verified).length;

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
              <h1 className="font-display text-3xl font-bold">Vendors</h1>
              <p className="text-muted-foreground">Manage vendor accounts</p>
            </div>
            <Button variant="gold" onClick={openCreateDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Add Vendor
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <TabsList>
                <TabsTrigger value="all">All ({vendors.length})</TabsTrigger>
                <TabsTrigger value="active">Active ({activeCount})</TabsTrigger>
                <TabsTrigger value="inactive">Inactive ({inactiveCount})</TabsTrigger>
                <TabsTrigger value="verified">Verified ({verifiedCount})</TabsTrigger>
              </TabsList>
              <div className="relative w-full sm:w-auto sm:min-w-[300px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search vendors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <TabsContent value={activeTab} className="mt-6">
              <Card>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-4 font-medium">Vendor</th>
                        <th className="text-left p-4 font-medium">Specialty</th>
                        <th className="text-left p-4 font-medium">Location</th>
                        <th className="text-left p-4 font-medium">Rating</th>
                        <th className="text-left p-4 font-medium">Status</th>
                        <th className="text-left p-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredVendors.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-muted-foreground">
                            No vendors found.
                          </td>
                        </tr>
                      ) : (
                        filteredVendors.map((vendor) => (
                          <tr key={vendor.id} className="border-b border-border">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                {vendor.avatar ? (
                                  <img
                                    src={vendor.avatar}
                                    alt={vendor.name}
                                    className="w-10 h-10 rounded-full object-cover"
                                  />
                                ) : (
                                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                                    <span className="text-sm font-medium">
                                      {vendor.name.charAt(0)}
                                    </span>
                                  </div>
                                )}
                                <div>
                                  <p className="font-medium flex items-center gap-2">
                                    {vendor.name}
                                    {vendor.verified && (
                                      <Badge variant="outline" className="text-xs">
                                        <Check className="h-3 w-3 mr-1" />
                                        Verified
                                      </Badge>
                                    )}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">{vendor.specialty || '-'}</td>
                            <td className="p-4">{vendor.location || '-'}</td>
                            <td className="p-4">
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-gold text-gold" />
                                <span>{vendor.rating}</span>
                                <span className="text-muted-foreground text-sm">
                                  ({vendor.reviewCount})
                                </span>
                              </div>
                            </td>
                            <td className="p-4">
                              <Badge variant={vendor.active ? 'default' : 'secondary'}>
                                {vendor.active ? 'Active' : 'Inactive'}
                              </Badge>
                            </td>
                            <td className="p-4">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => openEditDialog(vendor)}>
                                    <Edit2 className="h-4 w-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => toggleVerified(vendor)}>
                                    {vendor.verified ? (
                                      <>
                                        <X className="h-4 w-4 mr-2" />
                                        Remove Verification
                                      </>
                                    ) : (
                                      <>
                                        <Check className="h-4 w-4 mr-2" />
                                        Verify Vendor
                                      </>
                                    )}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => toggleActive(vendor)}>
                                    {vendor.active ? (
                                      <>
                                        <X className="h-4 w-4 mr-2" />
                                        Deactivate
                                      </>
                                    ) : (
                                      <>
                                        <Check className="h-4 w-4 mr-2" />
                                        Activate
                                      </>
                                    )}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleDelete(vendor.id)}
                                    className="text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            </TabsContent>
          </Tabs>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>
                  {editingVendor ? 'Edit Vendor' : 'Create Vendor'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specialty">Specialty</Label>
                  <Input
                    id="specialty"
                    value={formData.specialty}
                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                    placeholder="e.g., Wedding Planning, Catering"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="avatar">Avatar URL</Label>
                  <Input
                    id="avatar"
                    value={formData.avatar}
                    onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Lagos, Nigeria"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Switch
                      id="verified"
                      checked={formData.verified}
                      onCheckedChange={(checked) => setFormData({ ...formData, verified: checked })}
                    />
                    <Label htmlFor="verified">Verified</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="active"
                      checked={formData.active}
                      onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                    />
                    <Label htmlFor="active">Active</Label>
                  </div>
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
                    ) : editingVendor ? (
                      'Update Vendor'
                    ) : (
                      'Create Vendor'
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
