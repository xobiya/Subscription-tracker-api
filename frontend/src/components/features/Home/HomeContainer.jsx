import React, { useEffect, useState } from 'react'
import HomeView from './HomeView'
import { useAuth } from '../../../contexts/AuthContext'
import subscriptionService from '../../../services/subscriptionService'

export default function HomeContainer() {
  const { getUser, getToken } = useAuth()
  const user = getUser()
  const token = getToken()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [subscriptions, setSubscriptions] = useState([])

  useEffect(() => {
    if (!user || !token) return
    fetchSubs()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, user?._id, token])

  async function fetchSubs() {
    setLoading(true)
    setError(null)
    try {
      const userId = user?._id || user?.id || (user && user.userId)
      const data = await subscriptionService.fetchSubscriptions({ userId, token })
      setSubscriptions(data || [])
    } catch (err) {
      setError(err?.message || String(err))
    } finally {
      setLoading(false)
    }
  }

  const total = subscriptions.reduce((s, i) => s + (Number(i.price) || 0), 0)

  const displayName = (user && (user.username || user.name || user.email)) || 'User'

  return (
    <HomeView
      userDisplayName={displayName}
      loading={loading}
      error={error}
      subscriptions={subscriptions}
      total={total}
      onRefresh={fetchSubs}
    />
  )
}
