import React from 'react'
import PropTypes from 'prop-types'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, TrendingUp, Calendar, Download, ArrowUpRight, ArrowDownRight, Bell, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import ErrorMessage from '../../../components/ui/ErrorMessage'

// Modern Glass Effect + Soft Gradients + Fluid Layout
function StatCard({ title, value, subtitle, trend, icon: Icon, color }) {
  const base = {
    blue: 'from-blue-500/20 to-indigo-500/20',
    green: 'from-green-500/20 to-emerald-500/20',
    orange: 'from-orange-400/20 to-amber-500/20',
    purple: 'from-purple-500/20 to-pink-500/20',
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className={`p-6 border backdrop-blur-xl bg-gradient-to-br ${base[color]} shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-2xl transition-all hover:scale-[1.02]`}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-gray-600 font-medium mb-1">{title}</p>
            <p className="text-4xl font-extrabold text-gray-900">{value}</p>

            {subtitle && (
              <div className={`flex items-center gap-1 mt-2 text-sm ${trend > 0 ? 'text-green-600' : 'text-red-500'}`}>
                {trend > 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                {Math.abs(trend)}% {subtitle}
              </div>
            )}
          </div>

          <div className="p-3 bg-white/60 backdrop-blur rounded-xl shadow">
            <Icon className="w-6 h-6 text-gray-800" />
          </div>
        </div>
      </Card>
    </motion.div>
  )
}


function DashboardView({ user, stats, loading, error, timeRange, setTimeRange, onReload }) {
  const navigate = useNavigate()

  if (loading) return <div className="p-6 animate-pulse text-gray-400">Loading...</div>
  if (error) return <ErrorMessage error={error} onRetry={onReload} />

  return (
    <div className="p-6 space-y-8">
      {/* Header Section */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
          <p className="text-gray-600">Welcome back, <span className="font-semibold text-indigo-600">{user?.name}</span>.</p>
        </div>

        <div className="flex gap-3 items-center">
          <select className="px-4 py-2 rounded-xl border bg-white shadow focus:ring-2 focus:ring-indigo-400" value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>

          <Button className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg" onClick={() => navigate('/subscriptions')}>
            <Plus className="w-5 h-5 mr-2" /> Add Subscription
          </Button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Spending" value={stats.total} subtitle="from last month" trend={stats.monthlyChange} icon={TrendingUp} color="blue" />
        <StatCard title="Active Subscriptions" value={stats.count} icon={Sparkles} color="green" />
        <StatCard title="Upcoming Renewals" value={stats.upcoming?.length || 0} icon={Calendar} color="orange" />
        <StatCard title="Avg per Service" value={stats.averagePerService} icon={Bell} color="purple" />
      </div>

      {/* Renewals + Side Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6 rounded-2xl shadow bg-white/70 backdrop-blur-xl">
          <h3 className="text-xl font-bold mb-4">Upcoming Renewals</h3>
          <AnimatePresence>
            {stats.upcoming?.length ? (
              stats.upcoming.map((sub, i) => (
                <motion.div key={sub.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="p-4 rounded-xl shadow bg-white/50 backdrop-blur mb-3 border border-gray-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-bold text-gray-900">{sub.name}</p>
                      <span className="text-sm text-gray-500">{sub.category}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">${sub.price}</p>
                      <p className="text-sm text-gray-500">{new Date(sub.endDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-10 text-gray-500">No upcoming renewals 🎉</div>
            )}
          </AnimatePresence>
        </Card>

        {/* Quick Actions */}
        <Card className="p-6 rounded-2xl bg-white/70 backdrop-blur-xl shadow space-y-4">
          <h3 className="text-xl font-bold mb-2">Quick Actions</h3>
          <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl"><Plus className="w-5 h-5 mr-2" /> Add Subscription</Button>
          <Button variant="outline" className="w-full rounded-xl border-gray-300"><Download className="w-5 h-5 mr-2" /> Export Report</Button>
          <Button variant="outline" className="w-full rounded-xl border-gray-300"><Bell className="w-5 h-5 mr-2" /> Manage Alerts</Button>
        </Card>
      </div>
    </div>
  )
}

DashboardView.propTypes = {
  user: PropTypes.object,
  stats: PropTypes.object,
  loading: PropTypes.bool,
  error: PropTypes.any,
  timeRange: PropTypes.string,
  setTimeRange: PropTypes.func,
  onReload: PropTypes.func,
}

export default DashboardView;
