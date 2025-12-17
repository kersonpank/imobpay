# ⚡ Acesso Rápido ao pgAdmin - ImobPaga

## ✅ Status Atual

✅ **pgAdmin iniciado e rodando!**  
✅ **Acessível em:** http://localhost:5050

---

## 🚀 Como Acessar AGORA

### Passo 1: Abrir no Navegador

**URL:** http://localhost:5050

**Ou clique aqui:** [http://localhost:5050](http://localhost:5050)

### Passo 2: Fazer Login

**Credenciais:**
- **Email:** `admin@imobpaga.com`
- **Senha:** `admin123`

Clique em **"Login"**

### Passo 3: Adicionar Servidor PostgreSQL

Após fazer login, você verá a interface do pgAdmin. Agora precisa adicionar o servidor PostgreSQL:

1. **No menu esquerdo**, encontre **"Servers"**
2. **Clique com botão direito** em "Servers"
3. Clique em **"Register"** → **"Server..."**

### Passo 4: Configurar Conexão

#### Na aba "General":
- **Name:** `ImobPaga Local` (ou qualquer nome que você quiser)

#### Na aba "Connection" (IMPORTANTE):
- **Host name/address:** `postgres` ⚠️ **NÃO use `localhost`!**
- **Port:** `5432`
- **Maintenance database:** `imobpaga`
- **Username:** `imobpaga`
- **Password:** `imobpaga_dev_password`
- ✅ **Marque:** "Save password" (para não precisar digitar sempre)

#### Clique em "Save"

**⚠️ IMPORTANTE:** Use `postgres` como host (nome do serviço no Docker), não `localhost`!

---

## 📊 Explorar o Banco

### Ver Todas as Tabelas

No menu esquerdo, expanda:
- **"Servers"** → **"ImobPaga Local"** → **"Databases"** → **"imobpaga"** → **"Schemas"** → **"public"** → **"Tables"**

Você verá:
- `users` - Usuários do sistema
- `properties` - Imóveis cadastrados
- `contracts` - Contratos de aluguel
- `payments` - Pagamentos/cobranças
- `documents` - Documentos enviados
- `sessions` - Sessões de usuários
- `tenant_settings` - Configurações do Mercado Pago
- `onboarding_data` - Dados de onboarding

### Ver Dados de uma Tabela

1. **Clique com botão direito** em uma tabela (ex: `users`)
2. Clique em **"View/Edit Data"** → **"First 100 Rows"**

### Executar Queries SQL

1. **Clique com botão direito** em **"imobpaga"** (database)
2. Clique em **"Query Tool"**
3. Digite sua query:
   ```sql
   SELECT * FROM users;
   ```
4. Clique em **▶️ Executar** (ou pressione F5)

### Exemplos de Queries Úteis

```sql
-- Ver todos os usuários
SELECT id, email, role, created_at FROM users;

-- Ver usuários locadores
SELECT * FROM users WHERE role = 'landlord';

-- Ver todas as propriedades
SELECT title, address, rent_value, status FROM properties;

-- Contar registros por tabela
SELECT 
    'users' as tabela, COUNT(*) FROM users
UNION ALL
SELECT 'properties', COUNT(*) FROM properties
UNION ALL
SELECT 'contracts', COUNT(*) FROM contracts;
```

---

## 🔄 Reiniciar pgAdmin (se necessário)

### Se não conseguir acessar:

```powershell
# Parar pgAdmin
docker compose -f docker-compose.dev.yml stop pgadmin

# Iniciar novamente
docker compose -f docker-compose.dev.yml start pgadmin

# Ou usar o script
.\scripts\iniciar-pgadmin.ps1
```

---

## 🛠️ Alternativas (Se pgAdmin não funcionar)

### DBeaver (Desktop App)

1. **Baixar:** https://dbeaver.io/download/
2. **Instalar** o DBeaver Community Edition
3. **Criar conexão:**
   - Tipo: PostgreSQL
   - Host: `localhost`
   - Port: `5432`
   - Database: `imobpaga`
   - Username: `imobpaga`
   - Password: `imobpaga_dev_password`

### TablePlus (Desktop App)

1. **Baixar:** https://tableplus.com/
2. **Instalar** o TablePlus
3. **Criar conexão:**
   - Tipo: PostgreSQL
   - Host: `localhost`
   - Port: `5432`
   - User: `imobpaga`
   - Password: `imobpaga_dev_password`
   - Database: `imobpaga`

---

## 📝 Informações de Conexão (Resumo)

### Para pgAdmin (dentro do Docker):
```
Host: postgres
Port: 5432
Database: imobpaga
Username: imobpaga
Password: imobpaga_dev_password
```

### Para DBeaver/TablePlus (ferramentas externas):
```
Host: localhost
Port: 5432
Database: imobpaga
Username: imobpaga
Password: imobpaga_dev_password
```

---

## ✅ Checklist de Acesso

- [ ] pgAdmin está rodando (`docker compose ps pgadmin`)
- [ ] Acessei http://localhost:5050
- [ ] Fiz login (admin@imobpaga.com / admin123)
- [ ] Adicionei servidor PostgreSQL
- [ ] Usei `postgres` como host (não localhost)
- [ ] Consegui ver as tabelas
- [ ] Consigo executar queries SQL

---

## 🆘 Problemas Comuns

### pgAdmin não carrega no navegador

**Solução:**
```powershell
# Verificar se está rodando
docker compose -f docker-compose.dev.yml ps pgadmin

# Ver logs
docker compose -f docker-compose.dev.yml logs pgadmin

# Reiniciar
docker compose -f docker-compose.dev.yml restart pgadmin
```

### Erro ao conectar no pgAdmin: "Unable to connect to server"

**Solução:**
- ✅ Verifique se o host é `postgres` (não `localhost`)
- ✅ Verifique se a senha está correta: `imobpaga_dev_password`
- ✅ Verifique se o PostgreSQL está rodando:
  ```powershell
  docker compose -f docker-compose.dev.yml ps postgres
  ```

### Esqueci as credenciais

**pgAdmin Login:**
- Email: `admin@imobpaga.com`
- Senha: `admin123`

**PostgreSQL (ao adicionar servidor):**
- Host: `postgres`
- Port: `5432`
- Database: `imobpaga`
- Username: `imobpaga`
- Password: `imobpaga_dev_password`

---

## 🎯 Próximos Passos

Após acessar o pgAdmin:

1. ✅ Explore as tabelas
2. ✅ Veja os dados (se houver)
3. ✅ Execute queries SQL
4. ✅ Exporte dados (se necessário)
5. ✅ Use para desenvolvimento

---

**Agora você pode acessar o banco via interface gráfica! 🎉**

**URL:** http://localhost:5050






