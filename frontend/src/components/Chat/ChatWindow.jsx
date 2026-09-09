import { useChat } from '../../hooks/useChat'
import MessageList from './MessageList'
import ChatInput from './ChatInput'
import './Chat.css'

const ChatWindow = () => {
  const { messages, loading, error, sendMessage, clearHistory } = useChat()

  return (
    <div className="chat-window">
      <div className="chat-header">
        <h1>AI Assistant</h1>
        {messages.length > 0 && (
          <button type="button" className="btn-secondary" onClick={clearHistory}>
            New chat
          </button>
        )}
      </div>

      <MessageList messages={messages} loading={loading} />

      {error && <p className="form-message error chat-error">{error}</p>}

      <ChatInput onSend={sendMessage} disabled={loading} />
    </div>
  )
}

export default ChatWindow
