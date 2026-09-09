import { useEffect, useRef, useState } from 'react'
import { sendMessage as sendMessageRequest } from '../services/chatService'

const STORAGE_KEY = 'ecom_chat_history'

const readStoredMessages = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY))
    return Array.isArray(stored) ? stored : []
  } catch {
    return []
  }
}

export function useChat() {
  const [messages, setMessages] = useState(readStoredMessages)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const nextId = useRef(messages.reduce((max, m) => Math.max(max, m.id), 0) + 1)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
  }, [messages])

  const makeId = () => nextId.current++

  const sendMessage = async (text) => {
    const trimmed = text.trim()
    if (!trimmed || loading) return

    setMessages((prev) => [...prev, { id: makeId(), sender: 'user', text: trimmed }])
    setError(null)
    setLoading(true)

    try {
      const { reply } = await sendMessageRequest(trimmed)
      setMessages((prev) => [...prev, { id: makeId(), sender: 'bot', text: reply }])
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const clearHistory = () => {
    setMessages([])
  }

  return { messages, loading, error, sendMessage, clearHistory }
}
