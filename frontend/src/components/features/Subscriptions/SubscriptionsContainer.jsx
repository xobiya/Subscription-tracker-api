import React, { useMemo, useState } from 'react'
import { useSubscriptions } from '../../../hooks/useSubscriptions'
import SubscriptionsView from './SubscriptionsView'
import { useForm } from '../../../hooks/useForm'

const defaultForm = {
  name: '',
  price: 0,
  currency: 'USD',
  frequency: 'monthly',
  category: 'entertainment',
  paymentMethod: 'credit_card',
  startDate: new Date().toISOString().split('T')[0],
  notes: ''
}

export default function SubscriptionsContainer(){
  const { data, loading, error, reload, create, update, remove } = useSubscriptions(true)
  const { values: form, setValues: setFormValues, reset: resetForm } = useForm(defaultForm)

  const [open, setOpen] = useState(false)
  const [editingSubscription, setEditingSubscription] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [showArchived, setShowArchived] = useState(false)

  const categories = useMemo(() => [
    { value: 'entertainment', label: 'Entertainment', color: 'bg-purple-500' },
    { value: 'productivity', label: 'Productivity', color: 'bg-blue-500' },
    { value: 'utilities', label: 'Utilities', color: 'bg-green-500' },
    { value: 'shopping', label: 'Shopping', color: 'bg-orange-500' },
    { value: 'health', label: 'Health & Fitness', color: 'bg-red-500' },
    { value: 'education', label: 'Education', color: 'bg-indigo-500' },
    { value: 'other', label: 'Other', color: 'bg-gray-500' }
  ], [])

  const frequencies = useMemo(() => [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' }
  ], [])

  const list = data || []

  const fetchList = async () => {
    await reload()
  }

  const submit = async (payload) => {
    if (editingSubscription) {
      await update(editingSubscription._id || editingSubscription.id, payload)
    } else {
      await create(payload)
    }
    await fetchList()
    resetForm()
    setEditingSubscription(null)
    setOpen(false)
  }

  const handleEdit = (subscription) => {
    setFormValues({
      name: subscription.name,
      price: subscription.price,
      currency: subscription.currency || 'USD',
      frequency: subscription.frequency,
      category: subscription.category,
      paymentMethod: subscription.paymentMethod || 'credit_card',
      startDate: subscription.startDate ? (subscription.startDate.split ? subscription.startDate.split('T')[0] : subscription.startDate) : new Date().toISOString().split('T')[0],
      notes: subscription.notes || ''
    })
    setEditingSubscription(subscription)
    setOpen(true)
  }

  const handleDelete = async (id) => {
    await remove(id)
    await fetchList()
  }

  return (
    <SubscriptionsView
      list={list}
      loading={loading}
      error={error}
      categories={categories}
      frequencies={frequencies}
      open={open}
      setOpen={setOpen}
      form={form}
      setForm={setFormValues}
      onSubmit={submit}
      onCancel={() => { setOpen(false); resetForm(); setEditingSubscription(null) }}
      onRefresh={fetchList}
      onEdit={handleEdit}
      onDelete={handleDelete}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      selectedCategory={selectedCategory}
      setSelectedCategory={setSelectedCategory}
      sortBy={sortBy}
      setSortBy={setSortBy}
      showArchived={showArchived}
      setShowArchived={setShowArchived}
      editingSubscription={editingSubscription}
    />
  )
}
