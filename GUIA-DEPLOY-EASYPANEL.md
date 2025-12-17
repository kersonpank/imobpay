# 🚀 Guia Completo: Deploy no Easypanel

Este guia detalha passo a passo como fazer o deploy da aplicação ImobPaga no Easypanel.

---

## 📋 Pré-requisitos

Antes de começar, você precisa ter:

1. ✅ Conta no Easypanel (crie em [easypanel.io](https://easypanel.io))
2. ✅ Repositório Git da aplicação (GitHub, GitLab, ou Bitbucket)
3. ✅ Acesso ao repositório para configurar webhooks (opcional, para deploy automático)
4. ✅ Banco de dados PostgreSQL (pode ser provisionado no Easypanel ou externo)

---

## 📝 Passo 1: Preparar o Repositório

### 1.1 Verificar arquivos necessários

Certifique-se de que os seguintes arquivos estão no repositório:

- ✅ `Dockerfile` (já existe)
- ✅ `package.json` (já existe)
- ✅ `.dockerignore` (vamos criar se não existir)

### 1.2 Criar arquivo .dockerignore (se não existir)

Crie um arquivo `.dockerignore` na raiz do projeto para otimizar o build:

```
node_modules
npm-debug.log
.env
.env.local
.env.*.local
dist
.git
.gitignore
README.md
*.md
.vscode
.idea
coverage
.nyc_output
backups
```

---

## 📝 Passo 2: Configurar o Projeto no Easypanel

### 2.1 Acessar o Easypanel

1. Acesse [easypanel.io](https://easypanel.io) e faça login
2. Clique em **"New Project"** ou **"Novo Projeto"**

### 2.2 Criar Novo Projeto

1. **Nome do Projeto**: `imobpaga` (ou o nome que preferir)
2. **Descrição**: "Sistema de gerenciamento de aluguéis e contratos"
3. Clique em **"Create"** ou **"Criar"**

---

## 📝 Passo 3: Criar Serviço da Aplicação

### 3.1 Adicionar Novo Serviço

1. No projeto criado, clique em **"Add Service"** ou **"Adicionar Serviço"**
2. Selecione **"App"** ou **"Aplicação"**

### 3.2 Configurar o Serviço

#### 3.2.1 Informações Básicas

- **Nome do Serviço**: `app` (ou `imobpaga-app`)
- **Descrição**: "Aplicação principal ImobPaga"

#### 3.2.2 Configuração de Build

1. **Source Type**: Selecione **"Git Repository"**
2. **Repository URL**: Cole a URL do seu repositório Git
   - Exemplo: `https://github.com/seu-usuario/imobpaga.git`
3. **Branch**: `main` ou `master` (depende da sua branch principal)
4. **Build Method**: Selecione **"Dockerfile"**
5. **Dockerfile Path**: Deixe em branco (usa o Dockerfile na raiz) ou coloque `./Dockerfile`
6. **Docker Context**: Deixe em branco (usa a raiz do projeto)

#### 3.2.3 Configuração de Porta

- **Port**: `5000` (porta padrão da aplicação)
- **Protocol**: `HTTP`

#### 3.2.4 Variáveis de Ambiente

Adicione as seguintes variáveis de ambiente clicando em **"Add Environment Variable"**:

| Variável | Valor | Descrição |
|----------|-------|-----------|
| `NODE_ENV` | `production` | Ambiente de produção |
| `PORT` | `5000` | Porta da aplicação |
| `DATABASE_URL` | `postgresql://...` | **Será configurado depois** |
| `SESSION_SECRET` | `[GERAR UM SECRET SEGURO]` | Secret para sessões |
| `ALLOWED_ORIGINS` | `https://seu-dominio.com` | Domínios permitidos (CORS) |

**⚠️ IMPORTANTE - Gerar SESSION_SECRET:**

Execute um dos comandos abaixo para gerar um secret seguro:

**Linux/Mac:**
```bash
openssl rand -base64 32
```

**Windows (PowerShell):**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

**Node.js:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Cole o resultado na variável `SESSION_SECRET`.

#### 3.2.5 Recursos (Resources)

Configure os recursos conforme necessário:

- **CPU**: Mínimo `0.5` cores (recomendado `1` core)
- **Memory**: Mínimo `512MB` (recomendado `1GB`)
- **Storage**: `1GB` (para uploads de arquivos)

#### 3.2.6 Volumes (Persistent Storage)

Adicione um volume para persistir os uploads:

1. Clique em **"Add Volume"**
2. **Volume Name**: `uploads`
3. **Mount Path**: `/app/uploads`
4. **Size**: `5GB` (ajuste conforme necessário)

---

## 📝 Passo 4: Criar Banco de Dados PostgreSQL

### 4.1 Adicionar Serviço de Banco de Dados

1. No mesmo projeto, clique em **"Add Service"**
2. Selecione **"Database"** ou **"Banco de Dados"**
3. Escolha **"PostgreSQL"**

### 4.2 Configurar PostgreSQL

#### 4.2.1 Informações Básicas

- **Nome do Serviço**: `postgres` ou `imobpaga-db`
- **Versão**: `16` (ou a mais recente)

#### 4.2.2 Credenciais

- **Database Name**: `imobpaga`
- **Username**: `imobpaga` (ou o que preferir)
- **Password**: **Gere uma senha forte e segura!**

⚠️ **ANOTE ESSAS CREDENCIAIS!** Você precisará delas para configurar a `DATABASE_URL`.

#### 4.2.3 Recursos

- **CPU**: `0.5` cores
- **Memory**: `512MB` (mínimo) ou `1GB` (recomendado)
- **Storage**: `10GB` (ajuste conforme necessário)

### 4.3 Obter URL de Conexão

Após criar o banco de dados:

1. No serviço do PostgreSQL, procure por **"Connection String"** ou **"DATABASE_URL"**
2. Copie a URL completa
3. Formato esperado: `postgresql://usuario:senha@host:porta/database`

**Exemplo:**
```
postgresql://imobpaga:senha_segura@postgres.imobpaga:5432/imobpaga
```

### 4.4 Atualizar DATABASE_URL na Aplicação

1. Volte para o serviço da aplicação (`app`)
2. Edite a variável de ambiente `DATABASE_URL`
3. Cole a URL de conexão copiada
4. Salve as alterações

---

## 📝 Passo 5: Configurar Domínio e SSL

### 5.1 Adicionar Domínio

1. No serviço da aplicação, vá em **"Domains"** ou **"Domínios"**
2. Clique em **"Add Domain"**
3. Digite seu domínio (ex: `app.imobpaga.com`)
4. O Easypanel configurará automaticamente o SSL/HTTPS

### 5.2 Atualizar ALLOWED_ORIGINS

1. Volte para as variáveis de ambiente
2. Atualize `ALLOWED_ORIGINS` com seu domínio:
   ```
   https://app.imobpaga.com
   ```
   Se tiver múltiplos domínios, separe por vírgula:
   ```
   https://app.imobpaga.com,https://www.imobpaga.com
   ```

---

## 📝 Passo 6: Executar Migrações do Banco de Dados

### 6.1 Opção 1: Executar via Terminal do Easypanel

1. No serviço da aplicação, vá em **"Terminal"** ou **"Console"**
2. Execute os comandos de migração:

```bash
npm run db:push
```

Ou, se preferir usar migrações:

```bash
npm run db:generate
npm run db:migrate
```

### 6.2 Opção 2: Executar Localmente (conectando ao banco remoto)

1. Configure a `DATABASE_URL` localmente apontando para o banco no Easypanel
2. Execute localmente:
```bash
npm run db:push
```

---

## 📝 Passo 7: Fazer o Deploy

### 7.1 Deploy Manual

1. No serviço da aplicação, clique em **"Deploy"** ou **"Fazer Deploy"**
2. Selecione a branch (geralmente `main` ou `master`)
3. Clique em **"Deploy Now"**

### 7.2 Deploy Automático (Recomendado)

Para configurar deploy automático quando houver push no repositório:

1. No serviço da aplicação, vá em **"Settings"** → **"Webhooks"**
2. Copie a URL do webhook
3. No seu repositório Git (GitHub/GitLab/Bitbucket):
   - Vá em **Settings** → **Webhooks**
   - Adicione a URL do webhook
   - Eventos: `push` (quando houver push na branch principal)

---

## 📝 Passo 8: Verificar o Deploy

### 8.1 Verificar Logs

1. No serviço da aplicação, vá em **"Logs"**
2. Verifique se não há erros
3. Procure por: `serving on port 5000`

### 8.2 Testar a Aplicação

1. Acesse o domínio configurado (ex: `https://app.imobpaga.com`)
2. Teste o login/registro
3. Verifique se as funcionalidades estão funcionando

### 8.3 Verificar Banco de Dados

1. No serviço do PostgreSQL, verifique os logs
2. Confirme que as tabelas foram criadas (se possível, use um cliente SQL)

---

## 🔧 Configurações Adicionais (Opcional)

### Configurar OpenAI (para geração de contratos)

Se você usar a funcionalidade de geração de contratos com IA:

1. No serviço da aplicação, adicione a variável:
   - `OPENAI_API_KEY`: Sua chave da API OpenAI
   - `OPENAI_MODEL`: `gpt-4o-mini` (ou outro modelo)

### Configurar Backup Automático

1. No serviço do PostgreSQL, configure backups automáticos
2. Defina frequência (diário, semanal, etc.)

### Monitoramento

1. Configure alertas no Easypanel para:
   - CPU alto
   - Memória alta
   - Serviço offline
   - Erros nos logs

---

## 🐛 Troubleshooting (Solução de Problemas)

### Problema: Aplicação não inicia

**Solução:**
1. Verifique os logs do serviço
2. Confirme que todas as variáveis de ambiente estão configuradas
3. Verifique se a `DATABASE_URL` está correta
4. Confirme que a porta está configurada como `5000`

### Problema: Erro de conexão com banco de dados

**Solução:**
1. Verifique se o serviço do PostgreSQL está rodando
2. Confirme que a `DATABASE_URL` está correta
3. Verifique se o nome do serviço do banco está correto na URL
4. No Easypanel, serviços na mesma rede podem se comunicar pelo nome do serviço

### Problema: Uploads não persistem

**Solução:**
1. Verifique se o volume `uploads` está montado corretamente
2. Confirme que o caminho de montagem é `/app/uploads`
3. Verifique as permissões do volume

### Problema: CORS errors

**Solução:**
1. Verifique se `ALLOWED_ORIGINS` está configurado com o domínio correto
2. Certifique-se de usar `https://` no domínio
3. Se estiver testando localmente, adicione `http://localhost:5000` temporariamente

---

## 📚 Recursos Úteis

- [Documentação do Easypanel](https://easypanel.io/docs)
- [Documentação do Docker](https://docs.docker.com/)
- [Documentação do PostgreSQL](https://www.postgresql.org/docs/)

---

## ✅ Checklist Final

Antes de considerar o deploy completo, verifique:

- [ ] Aplicação está rodando e acessível
- [ ] Banco de dados está conectado
- [ ] Migrações foram executadas
- [ ] Domínio e SSL estão configurados
- [ ] Variáveis de ambiente estão todas configuradas
- [ ] Uploads estão funcionando
- [ ] Login/Registro estão funcionando
- [ ] Logs não mostram erros críticos
- [ ] Backup do banco de dados está configurado

---

## 🎉 Pronto!

Sua aplicação ImobPaga está no ar no Easypanel! 

Se tiver dúvidas ou problemas, consulte a seção de Troubleshooting ou a documentação do Easypanel.


