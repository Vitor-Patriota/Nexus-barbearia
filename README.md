# Bronx BarberStore

Aplicação full-stack para barbearia premium com agendamento online e painel administrativo.

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Frontend | React 18 + TypeScript + Vite |
| Estilização | CSS Modules (dark mode, neon) |
| Roteamento | React Router v6 |
| Gráficos | Recharts |
| Backend | Node.js + Express + TypeScript |
| Banco de Dados | Firebase Firestore |
| Autenticação | Firebase Auth |


### 2. Frontend

```bash
cd frontend
cp .env.example .env
# Preencha as variáveis do Firebase Client SDK no .env
npm install
npm run dev
```

Acesse: `http://localhost:3000`

### 3. Backend

```bash
cd backend
cp .env.example .env
# Cole o JSON da Service Account no .env
npm install
npm run dev
```

API disponível em: `http://localhost:5000`

## Deploy na Vercel

O backend precisa estar hospedado separadamente. Configure `VITE_API_URL` no projeto frontend como a URL pública da API terminando em `/api` (por exemplo, `https://api.exemplo.com/api`) e configure as variáveis `VITE_FIREBASE_*` do `.env.example` no build da Vercel. No backend, defina `CORS_ORIGINS` com a origem exata do frontend e `ADMIN_EMAILS` com os e-mails das contas administrativas cadastradas no Firebase Authentication.

## Endpoints da API

### Público

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/api/services` | Lista todos os serviços |
| `GET` | `/api/barbers` | Lista todos os barbeiros |
| `POST` | `/api/appointments` | Cria novo agendamento |

### Protegidos (requer token Firebase e e-mail listado em `ADMIN_EMAILS`)

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/api/appointments?date=YYYY-MM-DD` | Busca agendamentos por data |
| `PATCH` | `/api/appointments/:id/status` | Atualiza status (finalizar/cancelar) |
| `POST` | `/api/services` | Cria serviço |
| `PUT` | `/api/services/:id` | Edita serviço |
| `DELETE` | `/api/services/:id` | Remove serviço |
| `POST` | `/api/barbers` | Cria barbeiro |
| `PUT` | `/api/barbers/:id` | Edita barbeiro |
| `DELETE` | `/api/barbers/:id` | Remove barbeiro |
| `GET` | `/api/admin/stats` | Estatísticas do dashboard |
| `GET` | `/api/admin/revenue?period=week\|month` | Dados do gráfico de receita |

`GET /api/appointments` também é protegido e retorna dados pessoais dos clientes; somente administradores devem acessá-lo.

### Agendamento (Multi-step)
1. Seleção do serviço
2. Seleção do barbeiro
3. Escolha de data e horário
4. Dados do cliente (nome, telefone, e-mail)
5. Confirmação e envio

### Dashboard Admin (`/admin`)
- Cards de resumo: Receita, Clientes, Pendentes, Concluídos
- Gráfico de receita (semana/mês) com Recharts
- Tabela de agendamentos do dia
- Botões "Finalizar" (com modal para valor final/desconto) e "Cancelar"
- Gestão de Serviços (CRUD)
- Gestão de Barbeiros (CRUD + disponibilidade)

