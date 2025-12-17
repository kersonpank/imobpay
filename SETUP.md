# ⚙️ Configuração Inicial do ImobPaga

## 🔴 Problema Encontrado

O erro `role "usuario" não existe` indica que a `DATABASE_URL` no arquivo `.env` ainda está com valores de exemplo.

## ✅ Solução: Configurar o Banco de Dados

Você precisa configurar uma instância PostgreSQL. Escolha uma das opções abaixo:

---

## Opção 1: Neon (Mais Fácil - Recomendado) 🟢

1. **Acesse**: https://neon.tech
2. **Crie uma conta gratuita** (não precisa de cartão de crédito)
3. **Crie um novo projeto**:
   - Clique em "Create Project"
   - Escolha um nome (ex: "imobpaga")
   - Selecione uma região próxima (ex: AWS São Paulo)
4. **Copie a connection string**:
   - Após criar o projeto, você verá "Connection string"
   - Formato: `postgresql://usuario:senha@ep-xxx.region.aws.neon.tech/neondb?sslmode=require`
5. **Cole no arquivo `.env`**:
   ```env
   DATABASE_URL=postgresql://usuario:senha@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
   ```

---

## Opção 2: PostgreSQL Local (Windows)

### Instalar PostgreSQL no Windows

1. **Baixe o instalador**: https://www.postgresql.org/download/windows/
2. **Instale** (anote a senha do usuário `postgres`)
3. **Abra o pgAdmin** ou PowerShell e conecte ao PostgreSQL

### Criar banco de dados

No PowerShell:
```powershell
# Conectar ao PostgreSQL (ajuste a senha)
psql -U postgres -h localhost

# No prompt do psql:
CREATE DATABASE imobpaga;
\q
```

### Configurar no .env

```env
DATABASE_URL=postgresql://postgres:SUA_SENHA@localhost:5432/imobpaga
```

---

## Opção 3: Supabase (Alternativa)

1. **Acesse**: https://supabase.com
2. **Crie uma conta gratuita**
3. **Crie um novo projeto**
4. **Vá em**: Settings > Database > Connection string
5. **Copie a connection string** e cole no `.env`

---

## 📝 Configurar o arquivo `.env`

Abra o arquivo `.env` e configure:

```env
# Ambiente
NODE_ENV=development

# Porta
PORT=5000

# Banco de Dados - SUBSTITUA pelos seus valores reais!
DATABASE_URL=postgresql://usuario:senha@host:porta/database

# SESSION_SECRET - Gere um novo (veja comando abaixo)
SESSION_SECRET=coloque-um-secret-seguro-aqui

# CORS
ALLOWED_ORIGINS=

# Debug
DEBUG_AUTH=false

# OpenAI (opcional - apenas se quiser gerar contratos com IA)
# OPENAI_API_KEY=sk-...
```

### Gerar SESSION_SECRET Seguro

No PowerShell:
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Copie o resultado e cole no `.env` como valor de `SESSION_SECRET`.

---

## 🚀 Após Configurar

1. **Salve o arquivo `.env`**

2. **Execute o push do schema**:
   ```powershell
   npm run db:push
   ```

3. **Se funcionar, inicie o servidor**:
   ```powershell
   npm run dev
   ```

---

## ❌ Desabilitar auto-push no postinstall (Temporário)

Se quiser evitar o erro no `npm install`, você pode temporariamente remover o script `postinstall` do `package.json`:

```json
{
  "scripts": {
    // Remova ou comente esta linha:
    // "postinstall": "npm run db:push"
  }
}
```

Ou simplesmente ignore o erro do postinstall e execute manualmente:
```powershell
npm run db:push
```

---

## 🔍 Verificar se está Configurado Corretamente

Para testar se a connection string está correta, você pode usar:

```powershell
# No PowerShell (se tiver psql instalado)
psql "SUA_CONNECTION_STRING"

# Ou criar um arquivo de teste test-db.js:
node -e "require('dotenv').config(); const { Pool } = require('pg'); const pool = new Pool({ connectionString: process.env.DATABASE_URL }); pool.query('SELECT NOW()').then(r => { console.log('✅ Conexão OK!', r.rows); process.exit(0); }).catch(e => { console.error('❌ Erro:', e.message); process.exit(1); });"
```

---

## 💡 Dica Rápida

**Para começar rapidamente**, use o **Neon** (Opção 1). É gratuito, não precisa instalar nada e funciona imediatamente.

Após configurar o `.env` com a connection string real, execute:
```powershell
npm run db:push
npm run dev
```

