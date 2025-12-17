# 🧪 Guia Completo de Teste da Aplicação ImobPaga

## ✅ Pré-requisitos Verificados

- ✅ pgAdmin acessível (você já conseguiu!)
- ✅ PostgreSQL rodando
- ✅ Aplicação rodando na porta 5000

---

## 🌐 Passo 1: Acessar a Aplicação

### Abra no Navegador

**URL:** http://localhost:5000

**Ou clique aqui:** [http://localhost:5000](http://localhost:5000)

**O que você deve ver:**
- ✅ Página inicial do ImobPaga (AlugaFácil)
- ✅ Botões "Entrar" e "Criar Conta"
- ✅ Cards com funcionalidades (Gestão de Imóveis, Contratos Automáticos, etc.)

---

## 📝 Passo 2: Criar Primeira Conta

### 2.1 Acessar Registro

1. Na página inicial, clique em **"Criar Conta"**
2. Você será redirecionado para `/register`

### 2.2 Preencher Formulário

**Preencha os campos:**
- **Email:** `teste@exemplo.com` (ou qualquer email válido)
- **Senha:** `Senha123!` (mínimo 8 caracteres, 1 maiúscula, 1 número, 1 minúscula)
- **Nome (opcional):** `João`
- **Sobrenome (opcional):** `Silva`

### 2.3 Criar Conta

1. Clique em **"Criar Conta"**
2. Aguarde o processo de criação

**O que deve acontecer:**
- ✅ Conta criada com sucesso
- ✅ Você será redirecionado automaticamente para `/onboarding`
- ✅ Não precisa fazer login (já está logado automaticamente)

### 2.4 Verificar no Banco de Dados

**No pgAdmin:**
1. Abra o pgAdmin (http://localhost:5050)
2. Expanda: **Servers** → **ImobPaga Local** → **Databases** → **imobpaga** → **Schemas** → **public** → **Tables**
3. Clique com botão direito em **`users`** → **View/Edit Data** → **First 100 Rows**
4. Você deve ver seu usuário recém-criado

**Ou via Query Tool no pgAdmin:**
```sql
SELECT email, role, created_at FROM users ORDER BY created_at DESC;
```

---

## 🎯 Passo 3: Completar Onboarding

### 3.1 Escolher Perfil

Após criar conta, você verá a tela de onboarding perguntando seu perfil:

**Escolha uma opção:**

#### Opção A: Locador (Proprietário de Imóveis)
- Clique no card **"Locador"**
- Você vai gerenciar imóveis, contratos e receber pagamentos

#### Opção B: Locatário (Quem Aluga)
- Clique no card **"Locatário"**
- Você vai ver contratos, pagar aluguéis e fazer onboarding

**Para este teste, escolha "Locador"** (mais funcionalidades para testar)

### 3.2 Preencher Dados Adicionais

Após escolher o perfil, preencha:
- **CPF:** `123.456.789-00` (formato: XXX.XXX.XXX-XX)
- **Telefone:** `(11) 99999-9999` (formato: (XX) XXXXX-XXXX)

### 3.3 Finalizar

1. Clique em **"Continuar"**
2. Você será redirecionado para o dashboard do locador (`/landlord`)

### 3.4 Verificar no Banco

**No pgAdmin, execute:**
```sql
SELECT email, role, cpf, phone FROM users WHERE email = 'teste@exemplo.com';
```

Você deve ver:
- `role`: `landlord`
- `cpf`: `123.456.789-00`
- `phone`: `(11) 99999-9999`

---

## 📊 Passo 4: Testar Dashboard do Locador

### 4.1 Explorar Dashboard

Você deve ver:
- ✅ Título: "Dashboard"
- ✅ Cards com estatísticas (Total de Imóveis, Contratos Ativos, etc.)
- ✅ Seção "Meus Imóveis" (ainda vazia)
- ✅ Menu lateral (Sidebar)

### 4.2 Navegar pelo Menu

**No menu lateral, você pode acessar:**
- **Dashboard** - Visão geral
- **Imóveis** - Lista de propriedades
- **Contratos** - Contratos de aluguel
- **Pagamentos** - Controle de recebimentos
- **Configurações** - Configurações do sistema

**Teste:** Clique em cada item do menu para verificar se as páginas carregam.

---

## 🏠 Passo 5: Criar uma Propriedade

### 5.1 Acessar Página de Imóveis

1. No menu lateral, clique em **"Imóveis"**
2. Você será redirecionado para `/landlord/properties`

### 5.2 Criar Nova Propriedade

1. Clique no botão **"Adicionar Imóvel"** ou **"Novo Imóvel"**
2. Você será redirecionado para `/landlord/properties/new`

### 5.3 Preencher Formulário

**Preencha os campos:**
- **Título:** `Casa 3 Quartos com Quintal`
- **Descrição:** `Casa espaçosa com 3 quartos, sala, cozinha, 2 banheiros e quintal`
- **Endereço:** `Rua das Flores, 123`
- **Cidade:** `São Paulo`
- **Estado:** `SP`
- **CEP:** `01234-567`
- **Valor do Aluguel:** `2500.00`
- **Status:** `Disponível` (ou `available`)

### 5.4 Salvar

1. Clique em **"Salvar"** ou **"Criar Propriedade"**
2. A propriedade será criada

### 5.5 Verificar

**No pgAdmin:**
```sql
SELECT title, address, city, rent_value, status FROM properties ORDER BY created_at DESC;
```

**Na aplicação:**
- Volte para **"Imóveis"** no menu
- Você deve ver a propriedade criada na lista

---

## 📄 Passo 6: Testar Upload de Arquivos

### 6.1 Acessar Upload

1. Vá para a propriedade criada
2. Procure por seção de **"Fotos"** ou **"Upload"**

**Ou teste em qualquer página que tenha componente de upload**

### 6.2 Fazer Upload

1. Use o componente `FileUpload`
2. Arraste um arquivo ou clique para selecionar
3. Escolha uma imagem (JPG, PNG) ou PDF
4. Clique em **"Enviar"** ou **"Upload"**

### 6.3 Verificar Upload

**No pgAdmin:**
```sql
SELECT name, type, path, uploaded_at FROM documents ORDER BY uploaded_at DESC LIMIT 5;
```

**No sistema de arquivos:**
```powershell
Get-ChildItem uploads\documents
Get-ChildItem uploads\properties
```

**Na aplicação:**
- O arquivo deve aparecer na lista
- Você pode acessá-lo via URL: `http://localhost:5000/uploads/documents/nome-arquivo.ext`

---

## 🔐 Passo 7: Testar Autenticação

### 7.1 Fazer Logout

1. No menu lateral ou canto superior, encontre o botão de **"Sair"** ou **"Logout"**
2. Clique em **"Sair"**

**O que deve acontecer:**
- ✅ Você será redirecionado para a página inicial
- ✅ Não poderá mais acessar páginas protegidas

### 7.2 Fazer Login

1. Na página inicial, clique em **"Entrar"**
2. Você será redirecionado para `/login`

### 7.3 Preencher Credenciais

**Use a conta que você criou:**
- **Email:** `teste@exemplo.com`
- **Senha:** `Senha123!`

### 7.4 Entrar

1. Clique em **"Entrar"**
2. Você será redirecionado para o dashboard do locador

**O que deve acontecer:**
- ✅ Login bem-sucedido
- ✅ Redirecionado para `/landlord` (dashboard)
- ✅ Dados do usuário carregados

### 7.5 Verificar Sessão no Banco

**No pgAdmin:**
```sql
SELECT sid, sess::json, expire FROM sessions ORDER BY expire DESC LIMIT 5;
```

Você deve ver uma sessão ativa com seu `userId`.

---

## 📋 Passo 8: Testar Fluxo Completo (Criar Contrato)

### 8.1 Pré-requisitos

Para criar um contrato, você precisa:
- ✅ Um locador (você já tem)
- ✅ Um locatário (criar conta nova)
- ✅ Uma propriedade (você já criou)

### 8.2 Criar Conta de Locatário

**Em outra aba do navegador ou modo anônimo:**
1. Acesse: http://localhost:5000
2. Crie uma nova conta: `locatario@teste.com`
3. Escolha perfil: **"Locatário"**
4. Complete o onboarding

### 8.3 Criar Contrato (Como Locador)

**Volte para a conta do locador:**
1. Acesse **"Contratos"** no menu
2. Clique em **"Novo Contrato"** ou **"Criar Contrato"**
3. Preencha os dados:
   - Propriedade: Selecione a que você criou
   - Locatário: Selecione `locatario@teste.com`
   - Valor mensal: `2500.00`
   - Data de início: Data de hoje
   - Data de término: 12 meses depois
   - Dia de vencimento: `5`
   - Tipo de garantia: `Caução`

4. Clique em **"Salvar"** ou **"Criar"**

### 8.4 Gerar Contrato com IA (Se tiver OpenAI API Key)

1. Abra o contrato criado
2. Clique em **"Gerar Contrato"** ou **"Gerar com IA"**
3. Aguarde a geração (pode levar alguns segundos)
4. O contrato será gerado automaticamente

**⚠️ Nota:** Isso requer `OPENAI_API_KEY` configurada no `.env`. Se não tiver, pode pular esta etapa.

### 8.5 Verificar Contrato

**No pgAdmin:**
```sql
SELECT id, property_id, landlord_id, tenant_id, monthly_rent, status, created_at 
FROM contracts 
ORDER BY created_at DESC 
LIMIT 1;
```

---

## ✅ Checklist de Testes

### Testes Básicos
- [ ] Página inicial carrega
- [ ] Posso criar conta
- [ ] Posso fazer login
- [ ] Posso fazer logout
- [ ] Onboarding funciona (escolher perfil)

### Testes de Funcionalidades
- [ ] Dashboard carrega corretamente
- [ ] Posso criar propriedade
- [ ] Posso ver lista de propriedades
- [ ] Posso fazer upload de arquivos
- [ ] Arquivos aparecem no sistema
- [ ] Posso criar contrato
- [ ] Navegação entre páginas funciona

### Testes no Banco de Dados
- [ ] Usuário aparece na tabela `users`
- [ ] Propriedade aparece na tabela `properties`
- [ ] Arquivos aparecem na tabela `documents`
- [ ] Contratos aparecem na tabela `contracts`
- [ ] Sessões são criadas na tabela `sessions`

---

## 🐛 Problemas Comuns e Soluções

### Página não carrega (404 ou erro)

**Verificar:**
```powershell
# Ver logs da aplicação
docker compose -f docker-compose.dev.yml logs app --tail 50

# Verificar se está rodando
docker compose -f docker-compose.dev.yml ps app
```

**Solução:**
```powershell
# Reiniciar aplicação
docker compose -f docker-compose.dev.yml restart app
```

### Erro ao criar conta

**Verificar logs:**
```powershell
docker compose -f docker-compose.dev.yml logs app | Select-String -Pattern "error\|Error\|ERROR"
```

**Verificar banco:**
- No pgAdmin, verifique se a tabela `users` existe
- Execute: `SELECT * FROM users;`

### Erro 401 (Não autorizado)

**Solução:**
- Limpe os cookies do navegador
- Faça logout e login novamente
- Verifique se a sessão está sendo criada no banco

### Upload não funciona

**Verificar:**
```powershell
# Ver se a pasta uploads existe
Get-ChildItem uploads

# Ver logs
docker compose -f docker-compose.dev.yml logs app | Select-String -Pattern "upload\|multer"
```

**Solução:**
- Certifique-se que a pasta `uploads` tem permissões corretas
- Verifique se o arquivo não excede 10MB

---

## 📊 Monitorar Durante os Testes

### Ver Logs em Tempo Real

**Aplicação:**
```powershell
docker compose -f docker-compose.dev.yml logs -f app
```

**Banco de Dados:**
```powershell
docker compose -f docker-compose.dev.yml logs -f postgres
```

### Ver Dados no pgAdmin

**Queries úteis durante testes:**

```sql
-- Ver últimos usuários criados
SELECT email, role, created_at FROM users ORDER BY created_at DESC LIMIT 10;

-- Ver propriedades criadas
SELECT title, address, rent_value, status FROM properties ORDER BY created_at DESC;

-- Ver documentos enviados
SELECT name, type, path, uploaded_at FROM documents ORDER BY uploaded_at DESC LIMIT 10;

-- Ver sessões ativas
SELECT sid, sess::json->>'userId' as user_id, expire FROM sessions 
WHERE expire > NOW() 
ORDER BY expire DESC;
```

---

## 🎯 Testes Avançados (Opcional)

### Teste 1: Criação em Massa

1. Crie 5 propriedades diferentes
2. Verifique se todas aparecem na lista
3. Teste filtros e buscas (se houver)

### Teste 2: Upload Múltiplo

1. Faça upload de 3 fotos de uma vez
2. Verifique se todas foram salvas
3. Verifique se todas aparecem na lista

### Teste 3: Fluxo Completo de Contrato

1. Crie locador
2. Crie locatário
3. Crie propriedade
4. Crie contrato vinculando tudo
5. Gere contrato com IA (se tiver API key)
6. Verifique cronograma de pagamentos gerado

---

## 📈 Resultados Esperados

### Após todos os testes, você deve ter no banco:

**Tabela `users`:**
- Pelo menos 2 usuários (1 locador + 1 locatário)

**Tabela `properties`:**
- Pelo menos 1 propriedade criada

**Tabela `documents`:**
- Pelo menos 1 arquivo enviado (se testou upload)

**Tabela `contracts`:**
- Pelo menos 1 contrato criado (se testou criação)

**Tabela `sessions`:**
- Sessões ativas dos usuários logados

---

## ✅ Próximos Passos Após Testes

Após validar tudo funcionando:

1. ✅ Continuar desenvolvimento de novas features
2. ✅ Preparar para produção
3. ✅ Configurar integrações (Mercado Pago, OpenAI)
4. ✅ Adicionar mais testes automatizados

---

**Agora você pode testar a aplicação completamente! 🚀**

**Comece acessando:** http://localhost:5000






