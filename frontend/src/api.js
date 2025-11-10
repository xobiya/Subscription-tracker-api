const API_BASE = '/api'

async function request(path, opts = {}){
  try {
    const res = await fetch(API_BASE + path, opts)
    const text = await res.text()
    let data = null
    try { data = text ? JSON.parse(text) : null } catch(e){ data = text }

    if (!res.ok) {
      // normalize error shape
      const message = data && data.message ? data.message : (typeof data === 'string' ? data : res.statusText)
      return { success: false, message, status: res.status }
    }

    return { success: true, data, status: res.status }
  } catch (err) {
    return { success: false, message: err.message }
  }
}

export async function register({ username, email, password }){
  return request('/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, email, password }) })
}

export async function login({ email, password }){
  return request('/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) })
}

export async function getSubscriptions(userId, token){
  const headers = { 'Content-Type': 'application/json' }
  if(token) headers['Authorization'] = `Bearer ${token}`
  return request(`/subscriptions/user/${userId}`, { method: 'GET', headers })
}

export async function createSubscription(data, token){
  const headers = { 'Content-Type': 'application/json' }
  if(token) headers['Authorization'] = `Bearer ${token}`
  return request('/subscriptions', { method: 'POST', headers, body: JSON.stringify(data) })
}

export async function updateSubscription(id, data, token){
  const headers = { 'Content-Type': 'application/json' }
  if(token) headers['Authorization'] = `Bearer ${token}`
  return request(`/subscriptions/${id}`, { method: 'PUT', headers, body: JSON.stringify(data) })
}

export async function deleteSubscription(id, token){
  const headers = { 'Content-Type': 'application/json' }
  if(token) headers['Authorization'] = `Bearer ${token}`
  return request(`/subscriptions/${id}`, { method: 'DELETE', headers })
}

export default { register, login, getSubscriptions, createSubscription, updateSubscription, deleteSubscription }
