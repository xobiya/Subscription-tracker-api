const API_BASE = import.meta.env.VITE_API_BASE || '/api/v1'

const defaultHeaders = () => ({
  'Content-Type': 'application/json',
})

function getStoredToken() {
  try {
    const raw = localStorage.getItem('auth')
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return parsed?.token ?? null
  } catch (e) {
    return null
  }
}

async function request(path, { method = 'GET', body, headers = {}, token } = {}) {
  // If caller didn't provide a token, try to read a saved token from localStorage (dev-friendly)
  const candidateToken = token ?? getStoredToken()
  // Normalize token: strip any leading 'Bearer ' in case callers accidentally stored full header
  const normalizedToken = typeof candidateToken === 'string' && candidateToken.trim().length ? String(candidateToken).replace(/^Bearer\s+/i, '') : null

  const opts = {
    method,
    headers: {
      ...defaultHeaders(),
      ...headers,
      ...(normalizedToken ? { Authorization: `Bearer ${normalizedToken}` } : {}),
    },
  }

  if (body) {
    opts.body = typeof body === 'string' ? body : JSON.stringify(body)
  }

  try {
    const res = await fetch(`${API_BASE}${path}`, opts)
    const text = await res.text()
    let data = null
    try {
      data = text ? JSON.parse(text) : null
    } catch (parseError) {
      data = text
    }

    // If server responded with a standard { success, data } envelope, unwrap it
    if (res.ok) {
      if (data && typeof data === 'object' && Object.prototype.hasOwnProperty.call(data, 'success')) {
        if (data.success) {
          // return the inner data for convenience, but keep envelope semantics via success flag
          return { success: true, data: data.data ?? null, status: res.status }
        }
        const message = data.message ?? data.error ?? JSON.stringify(data)
        return { success: false, message, status: res.status }
      }

      return { success: true, data, status: res.status }
    }

    // Non-OK HTTP statuses
    const message = data && (data.message || data.error) ? (data.message || data.error) : (typeof data === 'string' ? data : res.statusText)
    return { success: false, message, status: res.status }
  } catch (error) {
    return { success: false, message: error.message }
  }
}

export async function register({ username, email, password }) {
  return request('/auth/register', { method: 'POST', body: { username, email, password } })
}

export async function login({ email, password }) {
  return request('/auth/login', { method: 'POST', body: { email, password } })
}

export async function getSubscriptions(userId, token) {
  return request(`/subscriptions/user/${userId}`, { method: 'GET', token })
}

export async function createSubscription(data, token) {
  return request('/subscriptions', { method: 'POST', token, body: data })
}

export async function updateSubscription(id, data, token) {
  return request(`/subscriptions/${id}`, { method: 'PUT', token, body: data })
}

export async function deleteSubscription(id, token) {
  return request(`/subscriptions/${id}`, { method: 'DELETE', token })
}

export async function getNotificationPreferences(userId, token) {
  return request(`/users/${userId}/preferences`, { method: 'GET', token })
}

export async function updateNotificationPreferences(userId, payload, token) {
  return request(`/users/${userId}/preferences`, { method: 'PUT', token, body: payload })
}

export default {
  register,
  login,
  getSubscriptions,
  createSubscription,
  updateSubscription,
  deleteSubscription,
  getNotificationPreferences,
  updateNotificationPreferences,
}
