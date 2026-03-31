/**
 * 🤖 Chat IA - Componente Principal
 * Gerencia o estado global da conversa e a comunicação com o backend.
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import axios from 'axios'
import ChatHeader from './components/ChatHeader.jsx'
import MessageList from './components/MessageList.jsx'
import ChatInput from './components/ChatInput.jsx'
import './App.css'

function App() {
  // ─── Estado da Conversa ──────────────────────────────────
  const [messages, setMessages] = useState(() => {
    // Carrega histórico do localStorage ao iniciar
    try {
      const saved = localStorage.getItem('chat-ia-history')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const messagesEndRef = useRef(null)

  // ─── Salva no localStorage sempre que messages muda ──────
  useEffect(() => {
    try {
      localStorage.setItem('chat-ia-history', JSON.stringify(messages))
    } catch {
      // Ignora erros de quota
    }
  }, [messages])

  // ─── Scroll automático para a última mensagem ────────────
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading, scrollToBottom])

  // ─── Envio de Mensagem ───────────────────────────────────
  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || isLoading) return

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toISOString(),
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)
    setError(null)

    // Prepara histórico para a API (só role + content)
    const historyForApi = messages.map(m => ({
      role: m.role,
      content: m.content,
    }))

    try {
      // O Vite proxy redireciona /chat → http://localhost:3001/chat
      const response = await axios.post('/chat', {
        message: text.trim(),
        history: historyForApi,
      })

      const aiMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: response.data.reply,
        timestamp: new Date().toISOString(),
      }

      setMessages(prev => [...prev, aiMessage])

    } catch (err) {
      const errorMsg = err.response?.data?.error
        || 'Erro ao conectar com o servidor. Verifique se o backend está rodando na porta 3001.'
      setError(errorMsg)

      // Remove mensagem do usuário se não houve resposta do servidor
      if (!err.response) {
        setMessages(prev => prev.filter(m => m.id !== userMessage.id))
      }
    } finally {
      setIsLoading(false)
    }
  }, [messages, isLoading])

  // ─── Limpar Conversa ─────────────────────────────────────
  const clearChat = useCallback(() => {
    if (messages.length === 0) return
    if (window.confirm('Deseja apagar todo o histórico da conversa?')) {
      setMessages([])
      setError(null)
      localStorage.removeItem('chat-ia-history')
    }
  }, [messages.length])

  return (
    <div className="app-container">
      <div className="chat-wrapper">
        <ChatHeader onClearChat={clearChat} messageCount={messages.length} />
        <MessageList
          messages={messages}
          isLoading={isLoading}
          error={error}
          messagesEndRef={messagesEndRef}
        />
        <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
      </div>
    </div>
  )
}

export default App
