import { useState, useRef, useEffect } from 'react'
import './ChatInput.css'

const SendIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
    style={{ transform: 'rotate(45deg)' }}>
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
)

const LoadingIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
  </svg>
)

function ChatInput({ onSendMessage, isLoading }) {
  const [text, setText] = useState('')
  const textareaRef = useRef(null)

  useEffect(() => {
    textareaRef.current?.focus()
  }, [])

  // Auto-resize do textarea
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`
  }, [text])

  useEffect(() => {
    if (!isLoading) textareaRef.current?.focus()
  }, [isLoading])

  const handleSubmit = () => {
    const trimmed = text.trim()
    if (!trimmed || isLoading) return
    onSendMessage(trimmed)
    setText('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const canSend = text.trim().length > 0 && !isLoading

  return (
    <div className="chat-input-container">
      <div className="input-hint">
        <span>Pressione <kbd>Enter</kbd> para enviar • <kbd>Shift + Enter</kbd> para nova linha</span>
      </div>
      <div className="input-row">
        <div className="textarea-wrapper">
          <textarea
            ref={textareaRef}
            className="chat-textarea"
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Digite sua mensagem..."
            rows={1}
            disabled={isLoading}
            maxLength={4000}
            aria-label="Campo de mensagem"
          />
          {text.length > 3500 && (
            <span className="char-counter">{text.length}/4000</span>
          )}
        </div>
        <button
          className={`send-button ${canSend ? 'active' : ''} ${isLoading ? 'loading' : ''}`}
          onClick={handleSubmit}
          disabled={!canSend}
          aria-label={isLoading ? 'Aguardando resposta' : 'Enviar mensagem'}
        >
          <span className="send-icon">
            {isLoading ? <LoadingIcon /> : <SendIcon />}
          </span>
        </button>
      </div>
    </div>
  )
}

export default ChatInput
