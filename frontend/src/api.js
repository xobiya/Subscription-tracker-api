const API_BASE = '/api'; // proxied to backend by Vite

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, options);
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.message || 'Request failed');
  return json;
}

export async function register({ username, email, password }) {
  return request('/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  });
}

export async function login({ email, password }) {
  return request('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
}

export async function getSubscriptions(userId, token) {
  return request(`/subscriptions/user/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function createSubscription(data, token) {
  return request('/subscriptions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
}

export default {
  register,
  login,
  getSubscriptions,
  createSubscription,
};
