import { apiFetch } from '../api/client'

export function sendMessage(message) {
  return apiFetch('/chat', { method: 'POST', body: { message } })
}
