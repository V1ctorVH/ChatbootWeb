import './ChatHeader.css'

const TrashIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
    <path d="M10 11v6M14 11v6"/>
    <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
  </svg>
)

const WaveIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <rect x="2" y="10" width="2" height="4" rx="1" opacity="0.5"/>
    <rect x="6" y="7" width="2" height="10" rx="1" opacity="0.7"/>
    <rect x="10" y="4" width="2" height="16" rx="1"/>
    <rect x="14" y="7" width="2" height="10" rx="1" opacity="0.7"/>
    <rect x="18" y="10" width="2" height="4" rx="1" opacity="0.5"/>
  </svg>
)

function ChatHeader({ onClearChat, messageCount }) {
  return (
    <header className="chat-header">
      <div className="header-left">
        <div className="ai-avatar">
          <span className="ai-avatar-emoji">🤖</span>
          <span className="ai-status-dot" title="Online" />
        </div>
        <div className="ai-info">
          <h1 className="ai-name">Chat IA</h1>
          <div className="ai-status">
            <WaveIcon />
            <span>online agora</span>
          </div>
        </div>
      </div>
      <div className="header-right">
        {messageCount > 0 && (
          <span className="message-counter">
            {messageCount} msg{messageCount !== 1 ? 's' : ''}
          </span>
        )}
        <button
          className="btn-clear"
          onClick={onClearChat}
          disabled={messageCount === 0}
          title="Limpar conversa"
          aria-label="Limpar conversa"
        >
          <TrashIcon />
        </button>
      </div>
    </header>
  )
}

export default ChatHeader
