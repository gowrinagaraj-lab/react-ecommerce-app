import Message from './Message'
import { useAutoScroll } from '../../hooks/useAutoScroll'

const MessageList = ({ messages, loading }) => {
  const containerRef = useAutoScroll([messages, loading])

  return (
    <div className="chat-message-list" ref={containerRef}>
      {messages.length === 0 && !loading && (
        <p className="chat-empty muted">Ask me anything about your orders, products, or account.</p>
      )}

      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}

      {loading && (
        <div className="chat-message chat-message-bot">
          <span className="chat-message-sender">Bot</span>
          <p className="chat-typing">
            <span />
            <span />
            <span />
          </p>
        </div>
      )}
    </div>
  )
}

export default MessageList
