import React, { useEffect, useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext'
import api from '../api'

export default function Home(){
  const { user, token } = useContext(AuthContext)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [subscriptions, setSubscriptions] = useState([])

  useEffect(()=>{
    if(!user || !token) return
    fetchSubs()
  }, [user, token])

  const fetchSubs = async ()=>{
    setLoading(true)
    setError(null)
    try{
      const res = await api.getSubscriptions(user._id || user.id || user.userId, token)
      if(res.success){
        setSubscriptions(res.data || [])
      } else {
        setError(res.message || 'Failed to fetch subscriptions')
      }
    } catch(err){
      setError(String(err))
    } finally{
      setLoading(false)
    }
  }

  const total = subscriptions.reduce((s, i) => s + (i.price || 0), 0)

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {user?.username || user?.name || 'User'}!</h1>
            <p className="text-gray-600 mt-1">Here's a quick summary of your subscriptions.</p>
          </div>
          <div className="space-x-3">
            <Link to="/subscriptions" className="px-4 py-2 bg-blue-600 text-white rounded-lg">Manage Subscriptions</Link>
            <Link to="/dashboard" className="px-4 py-2 border border-gray-200 rounded-lg">Open Dashboard</Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-6 shadow">
            <p className="text-sm text-gray-500">Active subscriptions</p>
            <p className="text-2xl font-bold mt-2">{subscriptions.length}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow">
            <p className="text-sm text-gray-500">Estimated monthly total</p>
            <p className="text-2xl font-bold mt-2">${total.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow">
            <p className="text-sm text-gray-500">Last sync</p>
            <p className="text-2xl font-bold mt-2">{subscriptions.length ? new Date().toLocaleString() : '—'}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow">
          <h3 className="font-semibold mb-4">Recent subscriptions</h3>
          {loading ? (
            <p className="text-sm text-gray-500">Loading…</p>
          ) : error ? (
            <p className="text-sm text-red-500">{error}</p>
          ) : subscriptions.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {subscriptions.slice(0,6).map(sub => (
                <div key={sub._id || sub.id} className="p-3 border rounded-lg">
                  <div className="flex justify-between">
                    <div>
                      <div className="font-medium">{sub.name}</div>
                      <div className="text-xs text-gray-500">{sub.frequency} • {sub.category}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">${(sub.price||0).toFixed(2)}</div>
                      <div className="text-xs text-gray-500">{sub.paymentMethod || ''}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No subscriptions yet — start by adding one.</p>
          )}
        </div>
      </div>
    </div>
  )
}
