import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { MoreVertical, Edit, Trash2, Calendar, DollarSign } from 'lucide-react'

export default function SubscriptionCard({ subscription, onEdit, onDelete }){
  const [showMenu, setShowMenu] = useState(false)
  const categoryColor = {
    entertainment: 'bg-purple-500',
    productivity: 'bg-blue-500',
    utilities: 'bg-green-500',
    shopping: 'bg-orange-500',
    health: 'bg-red-500',
    education: 'bg-indigo-500',
    other: 'bg-gray-500'
  }
  const category = subscription.category || 'other'

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 ${categoryColor[category] || 'bg-gray-500'} rounded-xl flex items-center justify-center text-white font-bold text-lg`}>
              {subscription.name?.charAt(0)}
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">{subscription.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${categoryColor[category] || 'bg-gray-500'}`}>
                  {category}
                </span>
                <span className="text-sm text-gray-500 capitalize">{subscription.frequency}</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <MoreVertical className="w-5 h-5 text-gray-400" />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-10 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10 min-w-[120px]">
                <button
                  onClick={() => { onEdit && onEdit(subscription); setShowMenu(false) }}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => { onDelete && onDelete(subscription._id || subscription.id); setShowMenu(false) }}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2 text-gray-600">
            <DollarSign className="w-4 h-4" />
            <span className="font-semibold text-gray-900">${subscription.price}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">{new Date(subscription.startDate).toLocaleDateString()}</span>
          </div>
        </div>

        {subscription.notes && (
          <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">{subscription.notes}</p>
        )}
      </div>
    </motion.div>
  )
}
