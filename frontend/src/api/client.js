const BASE_URL = 'http://localhost:5000/api'

/**
 * Thin fetch wrapper: prefixes the API base URL, sends/parses JSON, attaches a
 * Bearer token when provided, and throws an Error with the server message on
 * a non-2xx response.
 */
export async function apiFetch(path, { method = 'GET', body, token } = {}) {
  
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    throw new Error(data.message || 'Request failed')
  }

  return data
}
