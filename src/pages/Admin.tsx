import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, Users, Tag, BarChart3, Settings, LogOut,
  TrendingUp, TrendingDown, DollarSign, Calendar, Plus, Edit2, Trash2,
  Check, X, Eye, MoreVertical
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  mockDiscountCodes, 
  mockAdminVendors, 
  mockAnalytics, 
  topCategories,
  DiscountCode,
  AdminVendor
} from '@/data/adminData';
import { useStore } from '@/store/useStore';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function Admin() {
  const navigate = useNavigate();
  const { isAdminAuthenticated, adminLogout } = useStore();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [discountCodes, setDiscountCodes] = useState(mockDiscountCodes);
  const [vendors, setVendors] = useState(mockAdminVendors);
  const [isAddingCode, setIsAddingCode] = useState(false);

  if (!isAdminAuthenticated) {
    navigate('/admin/login');
    return null;
  }

  const handleLogout = () => {
    adminLogout();
    navigate('/admin/login');
  };

  const totalRevenue = mockAnalytics.reduce((sum, d) => sum + d.revenue, 0);
  const totalBookings = mockAnalytics.reduce((sum, d) => sum + d.bookings, 0);
  const avgBookingValue = totalRevenue / totalBookings;

  const toggleCodeStatus = (id: string) => {
    setDiscountCodes(codes => 
      codes.map(c => c.id === id ? { ...c, isActive: !c.isActive } : c)
    );
  };

  const updateVendorStatus = (id: string, status: AdminVendor['status']) => {
    setVendors(v => v.map(vendor => vendor.id === id ? { ...vendor, status } : vendor));
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border hidden lg:block">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-gold-light flex items-center justify-center">
              <span className="text-rich-black font-display font-bold text-lg">E</span>
            </div>
            <span className="font-display text-xl font-semibold">
              Admin
            </span>
          </Link>
        </div>

        <nav className="px-4 space-y-1">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'vendors', label: 'Vendors', icon: Users },
            { id: 'promotions', label: 'Promotions', icon: Tag },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === item.id
                  ? 'bg-gold/10 text-gold'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 w-64 p-4 border-t border-border">
          <Button variant="ghost" className="w-full justify-start text-destructive" onClick={handleLogout}>
            <LogOut className="h-5 w-5 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8">
          {/* Dashboard */}
          {activeTab === 'dashboard' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div>
                <h1 className="font-display text-3xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground">Welcome back, Admin</p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Total Revenue', value: `₦${(totalRevenue / 1000000).toFixed(1)}M`, change: '+12.5%', up: true, icon: DollarSign },
                  { label: 'Total Bookings', value: totalBookings, change: '+8.2%', up: true, icon: Calendar },
                  { label: 'Avg. Booking', value: `₦${(avgBookingValue / 1000).toFixed(0)}K`, change: '+3.1%', up: true, icon: TrendingUp },
                  { label: 'Active Vendors', value: vendors.filter(v => v.status === 'approved').length, change: '-2', up: false, icon: Users },
                ].map((stat, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center">
                          <stat.icon className="h-6 w-6 text-gold" />
                        </div>
                        <span className={`text-sm flex items-center gap-1 ${stat.up ? 'text-green-500' : 'text-destructive'}`}>
                          {stat.up ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                          {stat.change}
                        </span>
                      </div>
                      <p className="text-2xl font-bold mt-4">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={mockAnalytics}>
                        <defs>
                          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(43 70% 50%)" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="hsl(43 70% 50%)" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `₦${v/1000000}M`} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }}
                          formatter={(value: number) => [`₦${value.toLocaleString()}`, 'Revenue']}
                        />
                        <Area type="monotone" dataKey="revenue" stroke="hsl(43 70% 50%)" fillOpacity={1} fill="url(#colorRevenue)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Top Categories</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={topCategories} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} width={100} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }}
                        />
                        <Bar dataKey="bookings" fill="hsl(43 70% 50%)" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}

          {/* Vendors */}
          {activeTab === 'vendors' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-display text-3xl font-bold">Vendors</h1>
                  <p className="text-muted-foreground">Manage vendor accounts and approvals</p>
                </div>
                <Button variant="gold">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Vendor
                </Button>
              </div>

              <Tabs defaultValue="all">
                <TabsList>
                  <TabsTrigger value="all">All ({vendors.length})</TabsTrigger>
                  <TabsTrigger value="pending">Pending ({vendors.filter(v => v.status === 'pending').length})</TabsTrigger>
                  <TabsTrigger value="approved">Approved ({vendors.filter(v => v.status === 'approved').length})</TabsTrigger>
                  <TabsTrigger value="suspended">Suspended ({vendors.filter(v => v.status === 'suspended').length})</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-6">
                  <Card>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left p-4 font-medium">Vendor</th>
                            <th className="text-left p-4 font-medium">Specialty</th>
                            <th className="text-left p-4 font-medium">Status</th>
                            <th className="text-left p-4 font-medium">Revenue</th>
                            <th className="text-left p-4 font-medium">Bookings</th>
                            <th className="text-left p-4 font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {vendors.map((vendor) => (
                            <tr key={vendor.id} className="border-b border-border">
                              <td className="p-4">
                                <div>
                                  <p className="font-medium">{vendor.name}</p>
                                  <p className="text-sm text-muted-foreground">{vendor.email}</p>
                                </div>
                              </td>
                              <td className="p-4">{vendor.specialty}</td>
                              <td className="p-4">
                                <Badge variant={
                                  vendor.status === 'approved' ? 'default' :
                                  vendor.status === 'pending' ? 'secondary' : 'destructive'
                                }>
                                  {vendor.status}
                                </Badge>
                              </td>
                              <td className="p-4">₦{(vendor.revenue / 1000000).toFixed(1)}M</td>
                              <td className="p-4">{vendor.bookings}</td>
                              <td className="p-4">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="bg-popover border border-border">
                                    <DropdownMenuItem>
                                      <Eye className="h-4 w-4 mr-2" />
                                      View Details
                                    </DropdownMenuItem>
                                    {vendor.status === 'pending' && (
                                      <DropdownMenuItem onClick={() => updateVendorStatus(vendor.id, 'approved')}>
                                        <Check className="h-4 w-4 mr-2" />
                                        Approve
                                      </DropdownMenuItem>
                                    )}
                                    {vendor.status !== 'suspended' && (
                                      <DropdownMenuItem 
                                        onClick={() => updateVendorStatus(vendor.id, 'suspended')}
                                        className="text-destructive"
                                      >
                                        <X className="h-4 w-4 mr-2" />
                                        Suspend
                                      </DropdownMenuItem>
                                    )}
                                    {vendor.status === 'suspended' && (
                                      <DropdownMenuItem onClick={() => updateVendorStatus(vendor.id, 'approved')}>
                                        <Check className="h-4 w-4 mr-2" />
                                        Reactivate
                                      </DropdownMenuItem>
                                    )}
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>
          )}

          {/* Promotions */}
          {activeTab === 'promotions' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-display text-3xl font-bold">Promotions</h1>
                  <p className="text-muted-foreground">Manage discount codes and promotions</p>
                </div>
                <Dialog open={isAddingCode} onOpenChange={setIsAddingCode}>
                  <DialogTrigger asChild>
                    <Button variant="gold">
                      <Plus className="h-4 w-4 mr-2" />
                      New Code
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-card">
                    <DialogHeader>
                      <DialogTitle>Create Discount Code</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label>Code</Label>
                        <Input placeholder="e.g., SUMMER2024" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Type</Label>
                          <select className="w-full h-10 rounded-md border border-input bg-background px-3">
                            <option value="percentage">Percentage</option>
                            <option value="fixed">Fixed Amount</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label>Value</Label>
                          <Input type="number" placeholder="10" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Minimum Order (₦)</Label>
                        <Input type="number" placeholder="50000" />
                      </div>
                      <div className="space-y-2">
                        <Label>Expiry Date</Label>
                        <Input type="date" />
                      </div>
                      <Button variant="gold" className="w-full" onClick={() => setIsAddingCode(false)}>
                        Create Code
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid gap-4">
                {discountCodes.map((code) => (
                  <Card key={code.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center">
                            <Tag className="h-6 w-6 text-gold" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-lg">{code.code}</span>
                              <Badge variant={code.isActive ? 'default' : 'secondary'}>
                                {code.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {code.type === 'percentage' ? `${code.value}% off` : `₦${code.value.toLocaleString()} off`}
                              {code.minOrder && ` • Min: ₦${code.minOrder.toLocaleString()}`}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p className="font-medium">{code.usedCount}/{code.maxUses || '∞'}</p>
                            <p className="text-sm text-muted-foreground">Uses</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch 
                              checked={code.isActive} 
                              onCheckedChange={() => toggleCodeStatus(code.id)}
                            />
                            <Button variant="ghost" size="icon">
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {/* Analytics */}
          {activeTab === 'analytics' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div>
                <h1 className="font-display text-3xl font-bold">Analytics</h1>
                <p className="text-muted-foreground">Detailed performance metrics</p>
              </div>

              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Booking Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <AreaChart data={mockAnalytics}>
                        <defs>
                          <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(43 70% 50%)" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="hsl(43 70% 50%)" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }}
                        />
                        <Area type="monotone" dataKey="bookings" stroke="hsl(43 70% 50%)" fillOpacity={1} fill="url(#colorBookings)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}

          {/* Settings */}
          {activeTab === 'settings' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div>
                <h1 className="font-display text-3xl font-bold">Settings</h1>
                <p className="text-muted-foreground">Configure admin preferences</p>
              </div>

              <Card>
                <CardContent className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive email for new bookings</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Vendor Approval Required</p>
                      <p className="text-sm text-muted-foreground">New vendors need manual approval</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Maintenance Mode</p>
                      <p className="text-sm text-muted-foreground">Disable public access temporarily</p>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
