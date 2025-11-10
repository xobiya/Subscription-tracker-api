import React from 'react'
import PropTypes from 'prop-types'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, TrendingUp, Calendar, Download, ArrowUpRight, ArrowDownRight, Bell, Sparkles } from 'lucide-react'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'

function StatCard({ title, value, subtitle, trend, icon: Icon, color = 'blue' }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden">
      <Card className="p-6 hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50/50">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {typeof value === 'number' ? `$${value.toFixed(2)}` : value}
            </p>
            {subtitle && (
              <div className={`flex items-center gap-1 text-sm ${trend > 0 ? 'text-red-500' : 'text-green-500'}`}>
                {trend > 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                <span>{Math.abs(trend)}% {subtitle}</span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-2xl bg-${color}-500/10`}>
            <Icon className={`w-6 h-6 text-${color}-500`} />
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

function CategoryItem({ name, value, percentage, color }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <div className="flex items-center gap-3">
        <div className={`w-3 h-3 rounded-full bg-${color}-500`} />
        <span className="font-medium text-gray-700">{name}</span>
      </div>
      <div className="text-right">
        <div className="font-semibold text-gray-900">${value.toFixed(2)}</div>
        <div className="text-sm text-gray-500">{percentage}%</div>
      </div>
    </div>
  )
}

function SubscriptionCard({ subscription }) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-white to-gray-50/50 border border-gray-200/50 hover:border-blue-200 transition-all duration-300">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold">
          {subscription.name.charAt(0)}
        </div>
        <div>
          <h4 className="font-semibold text-gray-900">{subscription.name}</h4>
          <p className="text-sm text-gray-500">{subscription.category}</p>
        </div>
      </div>
      <div className="text-right">
        <div className="font-bold text-gray-900">${subscription.price}</div>
        <div className="text-sm text-gray-500">
          {subscription.endDate ? new Date(subscription.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}
        </div>
      </div>
    </motion.div>
  )
}

export default function DashboardView({ user, stats, loading, error, timeRange, setTimeRange, onReload }) {
  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-64 mt-2 animate-pulse" />
          </div>
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-xl animate-pulse" />
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 bg-gray-200 rounded-xl animate-pulse" />
          <div className="h-96 bg-gray-200 rounded-xl animate-pulse" />
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, <span className="font-semibold text-blue-600">{user?.name || 'User'}</span>! Here's your subscription overview.</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white" value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Plus className="w-5 h-5 mr-2" />
            Add Subscription
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Spending" value={stats.total} subtitle="from last month" trend={stats.monthlyChange} icon={TrendingUp} color="blue" />
        <StatCard title="Active Subscriptions" value={stats.count} icon={Sparkles} color="green" />
        <StatCard title="Upcoming Renewals" value={stats.upcoming.length} icon={Calendar} color="orange" />
        <StatCard title="Average per Service" value={stats.averagePerService} icon={Bell} color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6 border-0 bg-gradient-to-br from-white to-blue-50/30 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Upcoming Renewals</h3>
              <p className="text-gray-600 text-sm">Subscriptions due in the next 30 days</p>
            </div>
            <Button variant="outline" className="border-gray-300">View All<ArrowUpRight className="w-4 h-4 ml-2" /></Button>
          </div>
          <div className="space-y-4">
            <AnimatePresence>
              {stats.upcoming && stats.upcoming.length ? (
                stats.upcoming.map((subscription, index) => (
                  <motion.div key={subscription.id || subscription._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}>
                    <SubscriptionCard subscription={subscription} />
                  </motion.div>
                ))
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No upcoming renewals</p>
                  <p className="text-sm">All caught up! 🎉</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-6 border-0 bg-gradient-to-br from-white to-purple-50/30 shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Spending by Category</h3>
            <div className="space-y-1">
              {Object.entries(stats.byCategory).length ? (
                Object.entries(stats.byCategory).map(([category, value], index) => {
                  const percentage = ((value / stats.total) * 100).toFixed(1)
                  const colors = ['blue', 'green', 'yellow', 'red', 'purple', 'pink']
                  const color = colors[index % colors.length]
                  return <CategoryItem key={category} name={category} value={value} percentage={percentage} color={color} />
                })
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="w-8 h-8 text-gray-400" />
                  </div>
                  <p>No category data</p>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-6 border-0 bg-gradient-to-br from-white to-green-50/30 shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button className="w-full justify-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"><Plus className="w-5 h-5 mr-2"/>Add Subscription</Button>
              <Button variant="outline" className="w-full justify-center border-gray-300"><Download className="w-5 h-5 mr-2"/>Export Report</Button>
              <Button variant="outline" className="w-full justify-center border-gray-300"><Bell className="w-5 h-5 mr-2"/>Manage Alerts</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

DashboardView.propTypes = {
  user: PropTypes.object,
  stats: PropTypes.object.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.any,
  timeRange: PropTypes.string,
  setTimeRange: PropTypes.func,
  onReload: PropTypes.func,
}
