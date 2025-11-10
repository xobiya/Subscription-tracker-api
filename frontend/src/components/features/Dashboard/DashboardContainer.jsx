import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../../contexts/AuthContext'
import { useSubscriptions } from '../../../hooks/useSubscriptions'
import DashboardView from './DashboardView'

export default function DashboardContainer() {
  const { user, token } = useContext(AuthContext)
  const { data, loading, error, reload } = useSubscriptions(false)
  const [timeRange, setTimeRange] = useState('monthly')

  useEffect(() => {
    if (!user || !token) return
    reload()
  }, [user, token, reload])

  // derive stats from data so view is pure
  const stats = React.useMemo(() => {
    const total = data.reduce((s, i) => s + (i.price || 0), 0)
    const byCategory = {}
    data.forEach(s => { byCategory[s.category] = (byCategory[s.category] || 0) + (s.price || 0) })
    return {
      total,
      count: data.length,
      upcoming: data.slice(0, 5),
      byCategory,
      monthlyChange: Math.round((Math.random() * 20 - 10) * 10) / 10, // placeholder
      averagePerService: data.length ? total / data.length : 0,
    }
  }, [data])

  return (
    <DashboardView
      user={user}
      stats={stats}
      loading={loading}
      error={error}
      timeRange={timeRange}
      setTimeRange={setTimeRange}
      onReload={reload}
    />
  )
}
