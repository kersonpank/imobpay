# ⚡ Teste Rápido da Aplicação

## ✅ Status Atual

✅ **Aplicação rodando:** http://localhost:5000  
✅ **pgAdmin rodando:** http://localhost:5050  
✅ **Banco de dados:** PostgreSQL funcionando  

---

## 🚀 Teste Rápido (5 minutos)

### 1. Acessar a Aplicação

**Abra no navegador:** http://localhost:5000

Você deve ver:
- ✅ Página inicial do ImobPaga
- ✅ Botões "Entrar" e "Criar Conta"

### 2. Criar Conta

1. Clique em **"Criar Conta"**
2. Preencha:
   - **Email:** `teste@exemplo.com`
   - **Senha:** `Senha123!`
   - **Nome (opcional):** `João`
3. Clique em **"Criar Conta"**

**Resultado esperado:** Redirecionado para `/onboarding`

### 3. Completar Onboarding

1. Escolha **"Locador"** (proprietário de imóveis)
2. Preencha:
   - **CPF:** `123.456.789-00`
   - **Telefone:** `(11) 99999-9999`
3. Clique em **"Continuar"**

**Resultado esperado:** Redirecionado para `/landlord` (dashboard)

### 4. Verificar no pgAdmin

1. Abra: http://localhost:5050
2. Faça login: `admin@imobpaga.com` / `admin123`
3. Expanda: **Servers** → **ImobPaga Local** → **Databases** → **imobpaga** → **Schemas** → **public** → **Tables**
4. Clique com botão direito em **`users`** → **View/Edit Data** → **First 100 Rows**

**Você deve ver:** Seu usuário recém-criado!

### 5. Explorar Dashboard

No dashboard, você pode:
- ✅ Ver estatísticas
- ✅ Navegar pelo menu lateral
- ✅ Ver seção "Meus Imóveis" (vazia por enquanto)

---

## ✅ Checklist de Teste Rápido

- [ ] Página inicial carrega
- [ ] Posso criar conta
- [ ] Posso completar onboarding
- [ ] Dashboard aparece após onboarding
- [ ] Usuário aparece no banco de dados (pgAdmin)
- [ ] Navegação entre páginas funciona

---

## 🧪 Testes Adicionais (Opcional)

### Criar Propriedade

1. No menu lateral, clique em **"Imóveis"**
2. Clique em **"Adicionar Imóvel"**
3. Preencha os dados
4. Clique em **"Salvar"**

**Verificar no pgAdmin:**
```sql
SELECT title, address, rent_value FROM properties;
```

### Fazer Upload de Arquivo

1. Acesse uma página com upload
2. Arraste ou selecione um arquivo (JPG, PNG ou PDF)
3. Clique em **"Enviar"**

**Verificar:**
```powershell
Get-ChildItem uploads\documents
```

---

## 🐛 Problemas?

### Página não carrega

```powershell
# Verificar se está rodando
docker compose -f docker-compose.dev.yml ps app

# Ver logs
docker compose -f docker-compose.dev.yml logs app --tail 20
```

### Erro ao criar conta

```powershell
# Ver logs de erro
docker compose -f docker-compose.dev.yml logs app | Select-String -Pattern "error"
```

### Erro 500

```powershell
# Reiniciar aplicação
docker compose -f docker-compose.dev.yml restart app

# Aguardar alguns segundos
Start-Sleep -Seconds 5

# Verificar logs
docker compose -f docker-compose.dev.yml logs app --tail 30
```

---

## 📊 Queries Úteis no pgAdmin

```sql
-- Ver usuários criados
SELECT email, role, cpf, phone, created_at FROM users ORDER BY created_at DESC;

-- Ver propriedades
SELECT title, address, city, rent_value, status FROM properties;

-- Ver documentos enviados
SELECT name, type, path, uploaded_at FROM documents ORDER BY uploaded_at DESC;

-- Contar registros
SELECT 
    'users' as tabela, COUNT(*) as total FROM users
UNION ALL
SELECT 'properties', COUNT(*) FROM properties
UNION ALL
SELECT 'contracts', COUNT(*) FROM contracts;
```

---

**Agora você pode testar a aplicação! 🚀**

**Comece acessando:** http://localhost:5000
