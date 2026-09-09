import { renderMarkdown } from '../../utils/markdown'

const Message = ({ message }) => {
  const isUser = message.sender === 'user'

  return (
    <div className={`chat-message chat-message-${message.sender}`}>
      <span className="chat-message-sender">{isUser ? 'You' : 'Bot'}</span>
      <p
        className="chat-message-text"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(message.text) }}
      />
    </div>
  )
}

export default Message
