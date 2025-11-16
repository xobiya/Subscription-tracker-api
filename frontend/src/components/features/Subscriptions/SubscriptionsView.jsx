import React from 'react'
import PropTypes from 'prop-types'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, RefreshCw } from 'lucide-react'
import SubscriptionCard from '../../../components/subscriptions/SubscriptionCard'
import Modal from '../../../components/ui/Modal'
import FAB from '../../../components/ui/FAB'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'
import ErrorMessage from '../../../components/ui/ErrorMessage'
import Loading from '../../../components/ui/Loading'

export default function SubscriptionsView({
  list,
  loading,
  error,
  categories,
  frequencies,
  open,
  setOpen,
  form,
  setForm,
  onSubmit,
  onCancel,
  onRefresh,
  onEdit,
  onDelete,
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  showArchived,
  setShowArchived,
  editingSubscription
}){
  const filteredSubscriptions = (list || [])
    .filter(sub => {
      const name = (sub.name || '').toLowerCase()
      const matchesSearch = name.includes((searchTerm || '').toLowerCase())
      const matchesCategory = (selectedCategory === 'all' || sub.category === selectedCategory)
      // include item if it's not archived, or if the user asked to show archived
      const matchesArchived = (!sub.archived) || showArchived
      return matchesSearch && matchesCategory && matchesArchived
    })
    .sort((a, b) => {
      switch(sortBy) {
        case 'price': return b.price - a.price
        case 'date': return new Date(b.startDate) - new Date(a.startDate)
        case 'name': return a.name.localeCompare(b.name)
        default: return 0
      }
    })

  const totalMonthly = filteredSubscriptions.reduce((sum, sub) => sum + (Number(sub.price) || 0), 0)

  const submitForm = (e) => {
    e.preventDefault()
    onSubmit(form)
  }

  if (loading) return <Loading count={6} />

  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Subscriptions</h1>
          <p className="text-gray-600 mt-1">Manage all your subscriptions in one place</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={onRefresh} variant="outline" className="border-gray-300"><RefreshCw className="w-4 h-4 mr-2"/>Refresh</Button>
          <Button onClick={() => { setOpen(true) }} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"><Plus className="w-5 h-5 mr-2"/>Add Subscription</Button>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input type="text" placeholder="Search subscriptions..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
        </div>

        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white">
          <option value="all">All Categories</option>
          {categories.map(category => <option key={category.value} value={category.value}>{category.label}</option>)}
        </select>

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white">
          <option value="name">Sort by Name</option>
          <option value="price">Sort by Price</option>
          <option value="date">Sort by Date</option>
        </select>
      </motion.div>

      {filteredSubscriptions.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Total Monthly</p>
              <p className="text-3xl font-bold">${totalMonthly.toFixed(2)}</p>
              <p className="text-blue-100 text-sm mt-1">{filteredSubscriptions.length} active subscriptions</p>
            </div>
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            <ErrorMessage error={error} onRetry={onRefresh} />
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{[...Array(6)].map((_, i) => (<div key={i} className="bg-white rounded-2xl shadow-lg p-6 animate-pulse"><div className="flex items-center gap-3 mb-4"><div className="w-12 h-12 bg-gray-200 rounded-xl"></div><div className="space-y-2 flex-1"><div className="h-4 bg-gray-200 rounded w-3/4"></div><div className="h-3 bg-gray-200 rounded w-1/2"></div></div></div><div className="space-y-2"><div className="h-3 bg-gray-200 rounded"></div><div className="h-3 bg-gray-200 rounded w-2/3"></div></div></div>))}</div>
      ) : (
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredSubscriptions.length > 0 ? (
              filteredSubscriptions.map((subscription, index) => (
                <motion.div key={subscription.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: index * 0.1 }}>
                  <SubscriptionCard subscription={subscription} onEdit={onEdit} onDelete={(id) => onDelete(id)} />
                </motion.div>
              ))
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-full text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"><Plus className="w-10 h-10 text-gray-400" /></div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No subscriptions found</h3>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

          <Modal open={open} onClose={onCancel} title={editingSubscription ? 'Edit Subscription' : 'Add New Subscription'} size="lg">
        <form onSubmit={submitForm} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Service Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g., Netflix, Spotify..." required />
            <Input label="Price" type="number" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value === '' ? '' : parseFloat(e.target.value) })} placeholder="0.00" required />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required>
                {(categories || []).map(category => (<option key={category.value} value={category.value}>{category.label}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Billing Frequency</label>
              <select value={form.frequency} onChange={e => setForm({ ...form, frequency: e.target.value })} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required>
                {(frequencies || []).map(freq => (<option key={freq.value} value={freq.value}>{freq.label}</option>))}
              </select>
            </div>
            <Input label="Start Date" type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} required />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
              <select value={form.paymentMethod} onChange={e => setForm({ ...form, paymentMethod: e.target.value })} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required>
                <option value="credit_card">Credit Card</option>
                <option value="debit_card">Debit Card</option>
                <option value="paypal">PayPal</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
            <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Add any notes about this subscription..." rows="3" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" />
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
            <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">{editingSubscription ? 'Update Subscription' : 'Create Subscription'}</Button>
          </div>
        </form>
      </Modal>

      <FAB onClick={() => setOpen(true)} icon={Plus} className="lg:hidden" />
    </div>
  )
}

SubscriptionsView.propTypes = {
  list: PropTypes.array,
  loading: PropTypes.bool,
  error: PropTypes.any,
  categories: PropTypes.array.isRequired,
  frequencies: PropTypes.array.isRequired,
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  form: PropTypes.object,
  setForm: PropTypes.func,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
  onRefresh: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  searchTerm: PropTypes.string,
  setSearchTerm: PropTypes.func,
  selectedCategory: PropTypes.string,
  setSelectedCategory: PropTypes.func,
  sortBy: PropTypes.string,
  setSortBy: PropTypes.func,
  showArchived: PropTypes.bool,
  setShowArchived: PropTypes.func,
  editingSubscription: PropTypes.object,
}
