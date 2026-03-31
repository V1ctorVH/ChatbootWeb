/**
 * 🤖 Chat IA - Backend Server
 * Node.js + Express + Groq API
 *
 * A Groq oferece modelos de LLM ultrarrápidos e gratuitos.
 * Documentação: https://console.groq.com/docs
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const Groq = require('groq-sdk');

// Carrega variáveis de ambiente do arquivo .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ─── Middlewares ─────────────────────────────────────────────────────────────

// Permite requisições do frontend (CORS)
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST'],
}));

// Parseia JSON no corpo das requisições
app.use(express.json());

// ─── Inicialização do cliente Groq ───────────────────────────────────────────
// O SDK da Groq é compatível com a interface da OpenAI — mesma API, mais velocidade!

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// ─── Modelos disponíveis na Groq (gratuitos) ─────────────────────────────────
// Você pode trocar o modelo abaixo conforme necessário:
//
//  'llama-3.3-70b-versatile'   → Llama 3.3 70B  (recomendado — rápido e inteligente)
//  'llama-3.1-8b-instant'      → Llama 3.1 8B   (mais rápido, respostas mais curtas)
//  'mixtral-8x7b-32768'        → Mixtral 8x7B   (bom para textos longos)
//  'gemma2-9b-it'              → Gemma 2 9B     (bom para perguntas diretas)
//
const MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

// ─── Rota de Health Check ─────────────────────────────────────────────────────

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Servidor rodando! 🚀',
    model: MODEL,
  });
});

// ─── Rota Principal: POST /chat ───────────────────────────────────────────────

/**
 * Recebe mensagem do usuário e histórico da conversa,
 * envia para a Groq API e retorna a resposta da IA.
 *
 * Body esperado:
 * {
 *   message: "texto do usuário",
 *   history: [ { role: "user" | "assistant", content: "..." }, ... ]
 * }
 */
app.post('/chat', async (req, res) => {
  const { message, history = [] } = req.body;

  // Validação básica da mensagem
  if (!message || typeof message !== 'string' || message.trim() === '') {
    return res.status(400).json({
      error: 'Mensagem inválida. Envie um campo "message" com texto.'
    });
  }

  // Verifica se a API Key está configurada
  if (!process.env.GROQ_API_KEY) {
    return res.status(500).json({
      error: 'API Key da Groq não configurada. Verifique o arquivo .env'
    });
  }

  try {
    // Monta o array de mensagens para a API
    // O system prompt define a personalidade e comportamento da IA
    const messages = [
      {
        role: 'system',
        content: `Você é um assistente inteligente, amigável e prestativo.
                  Responda sempre em português brasileiro, de forma clara e objetiva.
                  Seja conversacional e natural, como uma conversa de chat.
                  Quando usar listas ou tópicos, formate de forma legível.`
      },
      // Inclui o histórico anterior para manter o contexto da conversa
      ...history.map(msg => ({
        role: msg.role,       // 'user' ou 'assistant'
        content: msg.content,
      })),
      // Mensagem atual do usuário
      { role: 'user', content: message.trim() }
    ];

    // Chama a API da Groq (interface idêntica à OpenAI)
    const completion = await groq.chat.completions.create({
      model: MODEL,
      messages,
      max_tokens: 1024,
      temperature: 0.7,   // 0 = determinístico | 1 = muito criativo
      top_p: 1,
      stream: false,      // Para simplificar, não usamos streaming aqui
    });

    // Extrai a resposta da IA do resultado
    const aiResponse = completion.choices[0].message.content;

    // Log útil para desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      console.log(`📨 Usuário: "${message.substring(0, 60)}..."`);
      console.log(`🤖 IA: "${aiResponse.substring(0, 60)}..."`);
      console.log(`📊 Tokens usados: ${completion.usage?.total_tokens}`);
    }

    // Retorna a resposta para o frontend
    res.json({
      reply: aiResponse,
      model: completion.model,        // Qual modelo foi usado
      usage: completion.usage,        // Tokens consumidos
    });

  } catch (error) {
    console.error('❌ Erro ao chamar Groq API:', error.message);

    // Trata erros específicos retornados pela API
    if (error.status === 401) {
      return res.status(401).json({
        error: 'API Key da Groq inválida ou expirada. Verifique o arquivo .env'
      });
    }
    if (error.status === 429) {
      return res.status(429).json({
        error: 'Limite de requisições atingido. Aguarde alguns segundos e tente novamente.'
      });
    }
    if (error.status === 503 || error.status === 502) {
      return res.status(502).json({
        error: 'Serviço da Groq temporariamente indisponível. Tente novamente.'
      });
    }

    // Erro genérico
    res.status(500).json({
      error: 'Erro interno no servidor. Verifique os logs.',
      // Só exibe detalhes técnicos em modo desenvolvimento
      detail: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// ─── Inicia o servidor ────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`\n🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
  console.log(`🔑 Groq Key:     ${process.env.GROQ_API_KEY ? '✅ Configurada' : '❌ NÃO configurada'}`);
  console.log(`🧠 Modelo:       ${MODEL}\n`);
});
