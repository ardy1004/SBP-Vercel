import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Building2,
  Users,
  TrendingUp,
  Eye,
  Plus,
  BarChart3,
  MessageSquare,
  Globe
} from 'lucide-react'

export default function AdminDashboard() {
  // Mock data - in real app, this would come from API
  const stats = {
    totalProperties: 156,
    activeListings: 142,
    totalLeads: 89,
    monthlyViews: 12450,
    recentLeads: 12,
    conversionRate: 3.2
  }

  const recentActivities = [
    {
      id: 1,
      type: 'property_added',
      message: 'New property added: Rumah Minimalis Condongcatur',
      time: '2 hours ago'
    },
    {
      id: 2,
      type: 'lead_received',
      message: 'New lead inquiry for Apartment Malioboro',
      time: '4 hours ago'
    },
    {
      id: 3,
      type: 'property_sold',
      message: 'Property sold: Kost Syariah UGM',
      time: '1 day ago'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, Admin!</h1>
          <p className="text-gray-600 mt-1">Here's what's happening with your properties today.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Property
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProperties}</div>
            <p className="text-xs text-muted-foreground">
              +12 from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeListings}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeListings} currently live
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLeads}</div>
            <p className="text-xs text-muted-foreground">
              +{stats.recentLeads} this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.monthlyViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +18% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Plus className="w-4 h-4 mr-2" />
              Add New Property
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <BarChart3 className="w-4 h-4 mr-2" />
              View Analytics
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <MessageSquare className="w-4 h-4 mr-2" />
              Manage Leads
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Globe className="w-4 h-4 mr-2" />
              Create Landing Page
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                  <Badge
                    variant={activity.type === 'lead_received' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {activity.type.replace('_', ' ')}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{stats.conversionRate}%</div>
              <p className="text-sm text-gray-600">Conversion Rate</p>
              <div className="flex items-center justify-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-xs text-green-600">+0.5%</span>
              </div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">24</div>
              <p className="text-sm text-gray-600">Properties Sold This Month</p>
              <div className="flex items-center justify-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-xs text-green-600">+12%</span>
              </div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">4.8</div>
              <p className="text-sm text-gray-600">Average Rating</p>
              <div className="flex items-center justify-center mt-2">
                <span className="text-xs text-gray-600">⭐⭐⭐⭐⭐</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}