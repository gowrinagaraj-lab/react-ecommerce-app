import { useState } from 'react'

const ChatInput = ({ onSend, disabled }) => {
  const [value, setValue] = useState('')

  const handleSend = () => {
    if (!value.trim() || disabled) return
    onSend(value)
    setValue('')
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="chat-input">
      <textarea
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask something... (Enter to send, Shift+Enter for a new line)"
        rows={1}
        disabled={disabled}
      />
      <button type="button" onClick={handleSend} disabled={disabled || !value.trim()}>
        Send
      </button>
    </div>
  )
}

export default ChatInput
