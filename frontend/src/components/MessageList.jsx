import './MessageList.css'

// ─── Mensagem individual ─────────────────────────────────────

function Message({ message }) {
  const isUser = message.role === 'user'

  const time = new Date(message.timestamp).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className={`message-row ${isUser ? 'user' : 'ai'}`}>
      {!isUser && (
        <div className="avatar-mini" aria-hidden="true">🤖</div>
      )}
      <div className={`bubble ${isUser ? 'bubble-user' : 'bubble-ai'}`}>
        <p className="bubble-text">
          {message.content.split('\n').map((line, i, arr) => (
            <span key={i}>
              {line}
              {i < arr.length - 1 && <br />}
            </span>
          ))}
        </p>
        <div className="bubble-footer">
          <span className="bubble-time">{time}</span>
          {isUser && <span className="bubble-check" aria-label="Enviado">✓✓</span>}
        </div>
      </div>
    </div>
  )
}

// ─── Indicador digitando... ──────────────────────────────────

function TypingIndicator() {
  return (
    <div className="message-row ai">
      <div className="avatar-mini">🤖</div>
      <div className="bubble bubble-ai typing-bubble">
        <div className="typing-dots">
          <span /><span /><span />
        </div>
      </div>
    </div>
  )
}

// ─── Estado vazio ────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="empty-state">
      <div className="empty-icon">💬</div>
      <h2 className="empty-title">Olá! Sou seu assistente IA</h2>
      <p className="empty-subtitle">
        Faça uma pergunta, peça ajuda ou só bate papo.<br />
        Estou aqui para te ajudar!
      </p>
      <div className="empty-suggestions">
        <p className="suggestions-label">Sugestões para começar:</p>
        <div className="suggestions-grid">
          {[
            '💡 Explique o que é inteligência artificial',
            '✍️ Me ajude a escrever um e-mail profissional',
            '🧮 Como funciona o algoritmo de ordenação?',
            '🌎 Quais são as capitais da América do Sul?',
          ].map((s, i) => (
            <span key={i} className="suggestion-chip">{s}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Banner de erro ──────────────────────────────────────────

function ErrorBanner({ message }) {
  return (
    <div className="error-banner">
      <span>⚠️</span>
      <span>{message}</span>
    </div>
  )
}

// ─── Componente principal ────────────────────────────────────

function MessageList({ messages, isLoading, error, messagesEndRef }) {
  return (
    <div className="message-list" role="log" aria-live="polite">
      <div className="chat-bg-pattern" aria-hidden="true" />
      {messages.length === 0 && !isLoading && <EmptyState />}
      {messages.map(msg => (
        <Message key={msg.id} message={msg} />
      ))}
      {isLoading && <TypingIndicator />}
      {error && <ErrorBanner message={error} />}
      <div ref={messagesEndRef} />
    </div>
  )
}

export default MessageList
