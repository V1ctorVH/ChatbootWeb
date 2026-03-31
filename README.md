# 🤖 Chat IA — WhatsApp Style com OpenAI

Interface de chat estilo WhatsApp com integração à API da OpenAI.
Desenvolvido com **React** no frontend e **Node.js + Express** no backend.

---

## 📁 Estrutura do Projeto

```
chat-ia/
├── frontend/          # React App
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatHeader.js   # Cabeçalho com info da IA
│   │   │   ├── ChatHeader.css
│   │   │   ├── MessageList.js  # Lista de mensagens
│   │   │   ├── MessageList.css
│   │   │   ├── ChatInput.js    # Campo de input
│   │   │   └── ChatInput.css
│   │   ├── App.js              # Componente principal + estado
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css           # Variáveis CSS globais
│   └── package.json
│
├── backend/           # Express Server
│   ├── server.js           # Servidor + rota /chat
│   ├── .env.example        # Modelo do arquivo .env
│   └── package.json
│
└── README.md
```

---

## ⚙️ Pré-requisitos

- [Node.js](https://nodejs.org/) v18 ou superior
- NPM (incluído com Node.js)
- Conta na [OpenAI](https://platform.openai.com/) com API Key

---

## 🚀 Instalação e Execução

### 1. Clone ou extraia o projeto

```bash
# Se veio como ZIP, extraia na pasta desejada
cd chat-ia
```

### 2. Configure o Backend

```bash
# Entre na pasta do backend
cd backend

# Instale as dependências
npm install

# Crie o arquivo .env copiando o exemplo
cp .env.example .env
```

Abra o arquivo `.env` e adicione sua API Key da OpenAI:

```env
PORT=3001
FRONTEND_URL=http://localhost:3000
OPENAI_API_KEY=sk-proj-SUA_CHAVE_AQUI
NODE_ENV=development
```

**Como obter sua API Key:**
1. Acesse https://platform.openai.com/api-keys
2. Clique em "Create new secret key"
3. Copie a chave gerada (começa com `sk-proj-...`)
4. Cole no arquivo `.env`

### 3. Configure o Frontend

```bash
# Em outro terminal, entre na pasta do frontend
cd frontend

# Instale as dependências
npm install
```

### 4. Execute o projeto

**Terminal 1 — Backend:**
```bash
cd backend
npm start
# Servidor rodando em http://localhost:3001
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm start
# App abrindo em http://localhost:3000
```

---

## 🔧 Scripts Disponíveis

### Backend
| Comando | Descrição |
|---------|-----------|
| `npm start` | Inicia o servidor em produção |
| `npm run dev` | Inicia com hot-reload (nodemon) |

### Frontend
| Comando | Descrição |
|---------|-----------|
| `npm start` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera a build de produção |

---

## 💬 Funcionalidades

- ✅ Mensagens do usuário à **direita** (bolhas verdes)
- ✅ Mensagens da IA à **esquerda** (bolhas escuras)
- ✅ Indicador de **"digitando..."** animado
- ✅ **Scroll automático** para a última mensagem
- ✅ **Histórico salvo** no localStorage
- ✅ **Limpar conversa** com confirmação
- ✅ **Contador de mensagens** no cabeçalho
- ✅ Suporte a **múltiplas linhas** (Shift+Enter)
- ✅ Horário de envio em cada mensagem
- ✅ **Responsivo** para mobile e desktop
- ✅ Tratamento de **erros** com mensagens amigáveis

---

## 🔌 API do Backend

### `POST /chat`

Envia uma mensagem para a IA e retorna a resposta.

**Request body:**
```json
{
  "message": "Olá, como você está?",
  "history": [
    { "role": "user", "content": "Mensagem anterior" },
    { "role": "assistant", "content": "Resposta anterior" }
  ]
}
```

**Response (200 OK):**
```json
{
  "reply": "Estou bem, obrigado! Como posso ajudar?",
  "usage": {
    "prompt_tokens": 45,
    "completion_tokens": 12,
    "total_tokens": 57
  }
}
```

**Códigos de erro:**
- `400` — Mensagem inválida
- `401` — API Key inválida
- `429` — Limite de requisições atingido
- `500` — Erro interno do servidor

### `GET /health`

Verifica se o servidor está rodando.

```json
{ "status": "ok", "message": "Servidor rodando! 🚀" }
```

---

## 🌐 Deploy em Produção

### Backend (Railway, Render, Heroku, etc.)
1. Configure a variável de ambiente `OPENAI_API_KEY`
2. Configure `FRONTEND_URL` com a URL do seu frontend
3. O comando de start é `npm start`

### Frontend (Vercel, Netlify, etc.)
1. Crie a variável `REACT_APP_API_URL` com a URL do backend
   - Ex: `REACT_APP_API_URL=https://seu-backend.railway.app`
2. O comando de build é `npm run build`

---

## 🛠️ Tecnologias Utilizadas

| Camada | Tecnologia |
|--------|-----------|
| Frontend | React 18, CSS Modules |
| Backend | Node.js, Express 4 |
| IA | OpenAI API (GPT-3.5-turbo) |
| HTTP | Axios |
| Auth | dotenv |
| Dev | nodemon |

---

## 📝 Licença

Projeto educacional de livre uso.
