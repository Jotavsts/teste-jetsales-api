# 📋 Task Manager - Desafio Técnico

Este projeto foi desenvolvido como parte de um desafio técnico. O objetivo é criar uma aplicação fullstack para cadastro, listagem e simulação de notificações de tarefas. A aplicação possui autenticação com JWT e usa BullMQ com Redis para simular o agendamento de tarefas.

## 🧱 Arquitetura

- **Frontend**: React + TypeScript + Vite
- **Backend**: Node.js + Express + TypeScript
- **Banco de dados**: LowDB (JSON)
- **Mensageria**: BullMQ + Redis (simulação de notificações)
- **Autenticação**: JWT (token com expiração)

---

## ✅ Funcionalidades

### Backend

- [x] Login com usuário fixo (`admin` / `password`)
- [x] Geração de token JWT
- [x] Rota pública para listar tarefas (`GET /tasks`)
- [x] Rota protegida para criar tarefas (`POST /tasks`)
- [x] Rota protegida para editar tarefas (`PUT /tasks/:id`)
- [x] Rota protegida para excluir tarefas (`DELETE /tasks/:id`)
- [x] Agendamento simulado de notificação com BullMQ

### Frontend

- [x] Interface para listar tarefas
- [x] Criação de tarefas via formulário
- [x] Exclusão de tarefas via botão
- [x] Integração com backend usando `fetch` e token JWT

---

## ⚠️ Ponto pendente

A **exclusão de tarefas** ainda **não está funcionando corretamente**.

- O botão de exclusão está implementado no frontend
- A requisição DELETE é enviada com token JWT no cabeçalho
- O backend possui middleware de autenticação funcional
- Porém, o servidor responde com erro `401 Unauthorized`
- Causas possíveis:
  - Token mal formatado
  - Token expirado ou incorreto
  - Problema de leitura no middleware

Como o foco do desafio foi validar a estrutura da aplicação e a integração entre as partes, esta etapa foi deixada para correção futura.

---

## 🚀 Como rodar o projeto

### 1. Clonar o repositório

```bash
git clone https://github.com/seu-usuario/seu-repositorio.git
cd seu-repositorio
```

---

### 2. Rodar o backend

```bash
cd backend
npm install
```

Crie um arquivo `.env` com o seguinte conteúdo:

```ini
JWT_SECRET=uma_chave_super_secreta
JWT_EXPIRES_IN=1h
NOTIFY_OFFSET_MINUTES=1
REDIS_HOST=localhost
REDIS_PORT=6379
```

Depois, inicie o servidor:

```bash
npm run dev
```

---

### 3. Rodar o Redis (se ainda não estiver rodando)

```bash
docker-compose up -d
```

> **Importante**: o Redis é necessário para o funcionamento das notificações com BullMQ.

---

### 4. Rodar o frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🔐 Login

Para gerar o token JWT, use o endpoint:

```http
POST http://localhost:3000/login
```

**Body:**

```json
{
  "username": "admin",
  "password": "password"
}
```

Você receberá um token no formato:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Salve esse token no navegador para autenticar requisições:

```js
localStorage.setItem("token", "SUA_CHAVE_JWT");
```

---

## 📂 Estrutura de Pastas

```bash
project-root/
├── backend/
│   ├── src/
│   │   ├── index.ts          # Servidor principal
│   │   ├── auth.ts           # JWT middleware
│   │   ├── database.ts       # Configuração do LowDB
│   │   ├── queue.ts          # Fila de notificações
│   └── .env                  # Variáveis de ambiente
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── TaskList.tsx  # Lista de tarefas
│   └── vite.config.ts        # Configuração do Vite
│
├── docker-compose.yml        # Redis
└── README.md
```

---

## 🧪 Funcionalidades

- [x] Listar tarefas
- [x] Criar tarefas com autenticação
- [x] Agendar notificação via BullMQ
- [x] Estilização com Tailwind no frontend
- [x] Login com geração de token JWT
- [ ] **Excluir tarefa (em progresso - problema de autenticação)**

---

## ⚠️ Observações

- A **exclusão de tarefas está com erro de autenticação**, mesmo com o token inserido corretamente. O backend retorna 401 e a tarefa não é removida.
- Todas as outras funcionalidades estão operando normalmente: criação, listagem e login.

---

## 📌 Conclusão

Mesmo com o erro na exclusão de tarefas, o projeto cumpre seu objetivo de demonstrar uma integração frontend + backend com autenticação JWT, fila assíncrona e agendamento de notificações. A base está pronta para futuras melhorias.

---

## 🚀 Sobre mim

Projeto Criado por:

https://github.com/Jotavsts
