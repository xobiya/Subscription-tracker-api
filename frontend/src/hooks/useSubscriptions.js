import { useCallback, useEffect, useState, useContext } from 'react'
import subscriptionService from '../services/subscriptionService'
import { AuthContext } from '../contexts/AuthContext'

/**
 * useSubscriptions hook - loads subscriptions and exposes CRUD helpers.
 * Automatically uses auth from AuthContext when available to hit backend.
 */
export function useSubscriptions(initialLoad = true) {
  const { user, token } = useContext(AuthContext)

  const [data, setData] = useState([])
  const [loading, setLoading] = useState(initialLoad)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const opts = {}
      if (user && token) opts.userId = user._id || user.id || user.userId
      if (token) opts.token = token
      const subs = await subscriptionService.fetchSubscriptions(opts)
      setData(subs || [])
      return subs
    } catch (err) {
      setError(err)
      return null
    } finally {
      setLoading(false)
    }
  }, [user, token])

  useEffect(() => {
    if (initialLoad) load()
  }, [initialLoad, load])

  const create = useCallback(async (payload) => {
    setError(null)
    try {
      const res = await subscriptionService.createSubscription(payload, token ? { token } : {})
      setData((d) => [res, ...d])
      return res
    } catch (err) {
      setError(err)
      throw err
    }
  }, [token])

  const update = useCallback(async (id, payload) => {
    setError(null)
    try {
      const res = await subscriptionService.updateSubscription(id, payload, token ? { token } : {})
      setData((d) => d.map((s) => (s.id === id ? res : s)))
      return res
    } catch (err) {
      setError(err)
      throw err
    }
  }, [token])

  const remove = useCallback(async (id) => {
    setError(null)
    try {
      await subscriptionService.deleteSubscription(id, token ? { token } : {})
      setData((d) => d.filter((s) => s.id !== id))
      return true
    } catch (err) {
      setError(err)
      throw err
    }
  }, [token])

  return { data, loading, error, reload: load, create, update, remove }
}

export default useSubscriptions
