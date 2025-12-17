# 🏠 ImobPaga - Sistema de Gerenciamento de Aluguéis

SaaS completo para gerenciamento de aluguéis, incluindo onboarding, contratos, pagamentos e ciclo completo de documentos.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [🚀 Início Rápido com Docker](#-início-rápido-com-docker) ⭐
- [Instalação Local](#instalação-local)
- [Configuração do Ambiente](#configuração-do-ambiente)
- [Executando o Projeto](#executando-o-projeto)
- [Deploy em Produção (VPS)](#deploy-em-produção-vps)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Troubleshooting](#troubleshooting)

## 🎯 Visão Geral

O **ImobPaga** é uma plataforma SaaS que permite:

- ✅ **Gerenciamento de Propriedades** - Cadastro e controle de imóveis
- ✅ **Onboarding de Locadores e Locatários** - Fluxo completo de cadastro e configuração
- ✅ **Geração de Contratos** - Criação e assinatura de contratos de aluguel
- ✅ **Gestão de Pagamentos** - Controle de mensalidades e integração com Mercado Pago
- ✅ **Autenticação e Sessões** - Sistema seguro de login com sessões em PostgreSQL
- ✅ **Dashboard Personalizado** - Interfaces específicas para locadores e locatários

## 🛠 Tecnologias

### Frontend
- **React 18** + **TypeScript**
- **Vite** - Build tool e dev server
- **TailwindCSS** - Estilização
- **Radix UI** - Componentes acessíveis
- **React Query** - Gerenciamento de estado servidor
- **Wouter** - Roteamento

### Backend
- **Node.js** + **Express** + **TypeScript**
- **Drizzle ORM** - ORM TypeScript
- **PostgreSQL** (via Neon) - Banco de dados
- **Express Session** - Gerenciamento de sessões
- **Bcrypt** - Hash de senhas

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 20 ou superior)
- **npm** ou **yarn**
- **PostgreSQL** (local ou conta no [Neon](https://neon.tech), [Supabase](https://supabase.com), etc.)
- **Git**

### Opcional (para Windows)
- **cross-env** (já incluído nas dependências) - Para compatibilidade de scripts entre sistemas

## 🚀 Início Rápido com Docker

**Recomendado para começar rapidamente!**

Se você já tem **Docker Desktop** instalado, pode pular a instalação manual:

```bash
# 1. Configure o arquivo .env
cp env.example.txt .env
# Edite o .env e configure pelo menos SESSION_SECRET

# 2. Inicie os serviços (banco + app)
docker-compose -f docker-compose.dev.yml up -d

# 3. Configure o banco de dados (primeira vez)
docker-compose -f docker-compose.dev.yml exec app npm run db:push

# 4. Acesse a aplicação
# http://localhost:5000
```

📖 **Veja o guia completo**: [DOCKER.md](./DOCKER.md)

---

## 🚀 Instalação Local

### 1. Clone o repositório

```bash
git clone <url-do-repositório>
cd ImobPaga
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o banco de dados

Você precisa de uma instância PostgreSQL rodando. Você pode usar:

**Opção A: PostgreSQL Local**
```bash
# Instalar PostgreSQL (exemplo no Ubuntu/Debian)
sudo apt-get install postgresql

# Criar banco de dados
createdb imobpaga
```

**Opção B: Neon (Recomendado para desenvolvimento)**
1. Acesse [https://neon.tech](https://neon.tech)
2. Crie uma conta gratuita
3. Crie um novo projeto
4. Copie a connection string (DATABASE_URL)

**Opção C: Supabase**
1. Acesse [https://supabase.com](https://supabase.com)
2. Crie um novo projeto
3. Vá em Settings > Database > Connection string
4. Copie a connection string

### 4. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```bash
cp env.example.txt .env
# Ou crie manualmente seguindo o exemplo abaixo
```

**Exemplo de `.env`:**

```env
# Ambiente
NODE_ENV=development

# Porta do servidor
PORT=5000

# Banco de Dados (substitua pela sua connection string)
DATABASE_URL=postgresql://usuario:senha@localhost:5432/imobpaga

# Secret para sessões (gere uma string aleatória segura)
SESSION_SECRET=seu-secret-super-seguro-aqui-mude-em-producao

# CORS (em desenvolvimento pode deixar vazio)
ALLOWED_ORIGINS=

# Debug (opcional)
DEBUG_AUTH=false
```

**⚠️ IMPORTANTE:**
- Nunca commite o arquivo `.env` no Git (já está no `.gitignore`)
- Use um `SESSION_SECRET` único e seguro em produção
- Gere um secret seguro usando: `openssl rand -base64 32` ou similar

### 5. Configure o banco de dados

Execute o push do schema para criar as tabelas:

```bash
npm run db:push
```

Isso criará todas as tabelas necessárias no banco de dados.

### 6. Execute o projeto

```bash
npm run dev
```

O servidor estará rodando em `http://localhost:5000`

## ⚙️ Configuração do Ambiente

### Variáveis de Ambiente Necessárias

| Variável | Descrição | Obrigatória | Padrão |
|----------|-----------|-------------|--------|
| `NODE_ENV` | Ambiente (development/production) | Sim | `development` |
| `PORT` | Porta do servidor | Não | `5000` |
| `DATABASE_URL` | Connection string do PostgreSQL | Sim | - |
| `SESSION_SECRET` | Secret para assinar cookies | Sim | - |
| `ALLOWED_ORIGINS` | Domínios permitidos (CORS) | Não | `*` (dev) |
| `DEBUG_AUTH` | Habilita logs de autenticação | Não | `false` |

### Gerando um SESSION_SECRET Seguro

**Linux/Mac:**
```bash
openssl rand -base64 32
```

**PowerShell (Windows):**
```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})
```

**Node.js:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## 🏃 Executando o Projeto

### Desenvolvimento

```bash
npm run dev
```

- Servidor: `http://localhost:5000`
- Hot Module Replacement (HMR) ativado
- Logs detalhados no console

### Build para Produção

```bash
npm run build
```

Isso irá:
1. Compilar o frontend (React) para `dist/public`
2. Compilar o backend (Express) para `dist/index.js`

### Iniciar em Produção

```bash
npm start
```

Certifique-se de ter as variáveis de ambiente configuradas corretamente.

### Scripts Disponíveis

```bash
npm run dev          # Desenvolvimento (hot reload)
npm run build        # Build para produção
npm start            # Inicia servidor em produção
npm run check        # Verifica erros TypeScript
npm run db:push      # Envia schema para o banco
npm run db:generate  # Gera migrations (se necessário)
```

## 🚀 Deploy em Produção (VPS)

### Preparação do Servidor

1. **Conectar via SSH**
```bash
ssh usuario@seu-servidor.com
```

2. **Instalar Node.js (exemplo Ubuntu/Debian)**
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

3. **Instalar PostgreSQL (se local)**
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
```

4. **Clonar o repositório**
```bash
git clone <url-do-repositório> /var/www/imobpaga
cd /var/www/imobpaga
```

### Configuração em Produção

1. **Instalar dependências**
```bash
npm install --production
```

2. **Criar arquivo `.env`**
```bash
nano .env
```

Configure com valores de produção:
```env
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://usuario:senha@host:5432/imobpaga
SESSION_SECRET=seu-secret-super-seguro-gerado
ALLOWED_ORIGINS=https://seudominio.com,https://www.seudominio.com
DEBUG_AUTH=false
```

3. **Configurar banco de dados**
```bash
npm run db:push
```

4. **Build do projeto**
```bash
npm run build
```

### Gerenciando o Processo (PM2 - Recomendado)

1. **Instalar PM2**
```bash
npm install -g pm2
```

2. **Iniciar aplicação**
```bash
pm2 start dist/index.js --name imobpaga
```

3. **Configurar PM2 para iniciar no boot**
```bash
pm2 startup
pm2 save
```

4. **Comandos úteis do PM2**
```bash
pm2 list              # Lista processos
pm2 logs imobpaga     # Ver logs
pm2 restart imobpaga  # Reiniciar
pm2 stop imobpaga     # Parar
pm2 delete imobpaga   # Remover
```

### Configuração com Nginx (Recomendado)

Crie um arquivo de configuração do Nginx:

```bash
sudo nano /etc/nginx/sites-available/imobpaga
```

**Configuração do Nginx:**
```nginx
server {
    listen 80;
    server_name seudominio.com www.seudominio.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Ativar o site:
```bash
sudo ln -s /etc/nginx/sites-available/imobpaga /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### SSL com Let's Encrypt (Recomendado)

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d seudominio.com -d www.seudominio.com
```

### Atualizando em Produção

```bash
# Conectar ao servidor
ssh usuario@servidor

# Ir para o diretório
cd /var/www/imobpaga

# Atualizar código
git pull origin main

# Instalar novas dependências (se houver)
npm install --production

# Atualizar banco (se houver mudanças no schema)
npm run db:push

# Build do projeto
npm run build

# Reiniciar aplicação
pm2 restart imobpaga
```

## 📁 Estrutura do Projeto

```
ImobPaga/
├── client/              # Frontend React
│   ├── src/
│   │   ├── components/  # Componentes React
│   │   ├── pages/       # Páginas da aplicação
│   │   ├── hooks/       # React Hooks
│   │   └── lib/         # Utilitários
│   └── index.html
├── server/              # Backend Express
│   ├── index.ts         # Servidor principal
│   ├── routes.ts        # Rotas da API
│   ├── auth.ts          # Autenticação
│   ├── storage.ts       # Camada de acesso ao banco
│   └── vite.ts          # Configuração Vite
├── shared/              # Código compartilhado
│   └── schema.ts        # Schema do banco (Drizzle)
├── db/                  # Configuração do banco
│   └── index.ts
├── dist/                # Build de produção (gerado)
├── migrations/          # Migrations do banco (gerado)
├── package.json
├── vite.config.ts
├── drizzle.config.ts
└── .env                 # Variáveis de ambiente (não versionado)
```

## 🔧 Troubleshooting

### Erro: "DATABASE_URL must be set"

**Solução:** Certifique-se de que o arquivo `.env` existe e contém a variável `DATABASE_URL`.

### Erro: "Could not find the build directory"

**Solução:** Execute `npm run build` antes de `npm start` em produção.

### Cookies de sessão não funcionam

**Solução:**
- Verifique se `SESSION_SECRET` está configurado
- Em produção, certifique-se de que `secure: true` está ativo (via `NODE_ENV=production`)
- Verifique configuração de CORS e `ALLOWED_ORIGINS`

### Erro ao conectar ao banco de dados

**Solução:**
- Verifique se a connection string está correta
- Teste a conexão: `psql "sua-connection-string"`
- Verifique firewall/security groups do banco

### Porta já em uso

**Solução:**
```bash
# Ver qual processo está usando a porta
lsof -i :5000  # Linux/Mac
netstat -ano | findstr :5000  # Windows

# Alterar porta no .env
PORT=3000
```

## 📝 Notas Importantes

### Desenvolvimento Local

- Use `npm run dev` para desenvolvimento com hot reload
- O banco de dados é sincronizado automaticamente via `db:push`
- As sessões são armazenadas no PostgreSQL

### Produção

- **SEMPRE** use `NODE_ENV=production`
- **SEMPRE** use um `SESSION_SECRET` seguro e único
- **SEMPRE** configure `ALLOWED_ORIGINS` com seus domínios
- Use PM2 ou similar para gerenciar o processo
- Configure SSL/HTTPS
- Faça backup regular do banco de dados

### Segurança

- Nunca commite arquivos `.env`
- Use HTTPS em produção
- Configure firewall adequadamente
- Mantenha dependências atualizadas
- Use secrets seguros para produção

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique a seção [Troubleshooting](#troubleshooting)
2. Consulte os logs: `pm2 logs imobpaga` (produção)
3. Ative `DEBUG_AUTH=true` para logs detalhados de autenticação

## 📄 Licença

MIT

---

**Desenvolvido com ❤️ para facilitar o gerenciamento de aluguéis**

#   i m o b p a y  
 