# 🎯 Começar a Testar AGORA - ImobPaga

## ✅ Tudo Pronto!

- ✅ **Aplicação rodando:** http://localhost:5000
- ✅ **pgAdmin rodando:** http://localhost:5000
- ✅ **Banco conectado:** PostgreSQL funcionando
- ✅ **Problema corrigido:** Driver do banco ajustado

---

## 🚀 TESTE RÁPIDO (5 minutos)

### Passo 1: Abrir a Aplicação

**👉 Clique aqui ou acesse:** http://localhost:5000

**O que você deve ver:**
- Página inicial do ImobPaga
- Botões "Entrar" e "Criar Conta"

---

### Passo 2: Criar Sua Primeira Conta

1. **Clique em "Criar Conta"**
2. **Preencha:**
   - Email: `teste@exemplo.com`
   - Senha: `Senha123!` (mínimo 8 caracteres, 1 maiúscula, 1 número)
   - Nome (opcional): `João`
   - Sobrenome (opcional): `Silva`
3. **Clique em "Criar Conta"**

**✅ Sucesso:** Você será redirecionado para a tela de onboarding

---

### Passo 3: Escolher Perfil

Você verá duas opções:

**🎯 Escolha "Locador"** (recomendado para este teste)
- Você será o proprietário dos imóveis
- Poderá criar propriedades e contratos
- Mais funcionalidades para testar

**Ou escolha "Locatário"** se preferir testar o fluxo do inquilino

---

### Passo 4: Completar Dados

Após escolher "Locador":

1. **CPF:** `123.456.789-00` (formato: XXX.XXX.XXX-XX)
2. **Telefone:** `(11) 99999-9999` (formato: (XX) XXXXX-XXXX)
3. **Clique em "Continuar"**

**✅ Sucesso:** Você será redirecionado para o Dashboard do Locador

---

### Passo 5: Explorar o Dashboard

**No Dashboard você verá:**
- ✅ Cards com estatísticas (Total de Imóveis, Contratos Ativos, etc.)
- ✅ Seção "Meus Imóveis" (vazia por enquanto)
- ✅ Menu lateral com navegação

**Teste a navegação:**
- Clique em **"Imóveis"** no menu
- Clique em **"Contratos"** no menu
- Volte para **"Dashboard"**

---

### Passo 6: Verificar no pgAdmin

**Agora vamos confirmar que tudo foi salvo no banco:**

1. **Abra:** http://localhost:5050
2. **Faça login:**
   - Email: `admin@imobpaga.com`
   - Senha: `admin123`
3. **Expanda no menu esquerdo:**
   - **Servers** → **ImobPaga Local** → **Databases** → **imobpaga** → **Schemas** → **public** → **Tables**
4. **Clique com botão direito** em **`users`** → **View/Edit Data** → **First 100 Rows**

**✅ Você deve ver:** Seu usuário recém-criado com email `teste@exemplo.com`!

---

## ✅ Checklist de Teste

Marque o que você conseguiu fazer:

- [ ] ✅ Página inicial carregou
- [ ] ✅ Consegui criar conta
- [ ] ✅ Fui redirecionado para onboarding
- [ ] ✅ Escolhi perfil (Locador)
- [ ] ✅ Completei dados (CPF e telefone)
- [ ] ✅ Fui redirecionado para dashboard
- [ ] ✅ Dashboard carregou corretamente
- [ ] ✅ Consegui navegar entre páginas
- [ ] ✅ Vi meu usuário no pgAdmin

---

## 🧪 Próximos Testes (Opcional)

### Teste 1: Criar uma Propriedade

1. No menu, clique em **"Imóveis"**
2. Clique em **"Adicionar Imóvel"** ou **"Novo Imóvel"**
3. Preencha:
   - Título: `Casa 3 Quartos`
   - Descrição: `Casa espaçosa com quintal`
   - Endereço: `Rua das Flores, 123`
   - Cidade: `São Paulo`
   - Estado: `SP`
   - CEP: `01234-567`
   - Valor do Aluguel: `2500.00`
4. Clique em **"Salvar"**

**Verificar no pgAdmin:**
```sql
SELECT title, address, rent_value FROM properties;
```

---

### Teste 2: Fazer Upload de Arquivo

1. Procure por uma página com componente de upload
2. Arraste um arquivo (JPG, PNG ou PDF) ou clique para selecionar
3. Clique em **"Enviar"**

**Verificar:**
- No pgAdmin: `SELECT * FROM documents;`
- Na pasta: `Get-ChildItem uploads\documents`

---

### Teste 3: Testar Login/Logout

1. Clique em **"Sair"** ou **"Logout"**
2. Você será redirecionado para a página inicial
3. Clique em **"Entrar"**
4. Use: `teste@exemplo.com` / `Senha123!`
5. Você será redirecionado para o dashboard

---

## 🐛 Problemas?

### Página não carrega

```powershell
# Verificar status
docker compose -f docker-compose.dev.yml ps app

# Ver logs
docker compose -f docker-compose.dev.yml logs app --tail 20
```

### Erro ao criar conta

```powershell
# Ver logs de erro
docker compose -f docker-compose.dev.yml logs app | Select-String -Pattern "error\|Error"
```

### Reiniciar aplicação

```powershell
docker compose -f docker-compose.dev.yml restart app
```

---

## 📚 Documentação Completa

Para testes mais detalhados, veja:
- **`GUIA-TESTE-APLICACAO.md`** - Guia completo passo a passo
- **`TESTE-RAPIDO.md`** - Teste rápido de 5 minutos

---

## 🎉 Pronto para Começar!

**👉 Acesse agora:** http://localhost:5000

**E siga os passos acima para testar!**

**Boa sorte! 🚀**





