# 🔧 Correção do Erro 500 no Registro

## 🐛 Problema Identificado

**Erro:**
```
POST /api/auth/register 500 (Internal Server Error)
{"message":"Erro ao criar conta"}
```

**Possíveis Causas:**
1. Tabela `sessions` não existe no banco de dados
2. Erro ao criar usuário no banco (problema de conexão ou schema)
3. Erro ao fazer hash da senha (bcrypt)
4. Erro ao salvar sessão

---

## ✅ Correções Implementadas

### 1. Melhor Tratamento de Erros

**Antes:**
```typescript
catch (error: any) {
  console.error("Error registering user:", error);
  res.status(500).json({ message: "Erro ao criar conta" });
}
```

**Depois:**
```typescript
catch (error: any) {
  console.error("Error registering user:", error);
  console.error("Error stack:", error.stack);
  console.error("Error details:", {
    name: error.name,
    code: error.code,
    message: error.message,
    constraint: error.constraint,
  });
  
  // Em desenvolvimento, retornar mais detalhes
  const errorMessage = process.env.NODE_ENV === 'development' 
    ? `Erro ao criar conta: ${error.message || 'Erro desconhecido'}`
    : "Erro ao criar conta";
  
  res.status(500).json({ 
    message: errorMessage,
    ...(process.env.NODE_ENV === 'development' && { 
      error: error.message,
      stack: error.stack 
    })
  });
}
```

**Benefícios:**
- ✅ Logs mais detalhados no servidor
- ✅ Em desenvolvimento, retorna detalhes do erro
- ✅ Em produção, mantém mensagem genérica por segurança

### 2. Criação Automática da Tabela de Sessões

**Antes:**
```typescript
createTableIfMissing: false, // Não cria tabela se não existir
```

**Depois:**
```typescript
createTableIfMissing: true, // Cria tabela automaticamente se não existir
```

**Benefícios:**
- ✅ Tabela `sessions` é criada automaticamente
- ✅ Não precisa executar migrations manualmente
- ✅ Funciona mesmo se o banco estiver vazio

---

## 🔍 Como Diagnosticar

### 1. Verificar Logs do Servidor

No Easypanel, verifique os logs do container para ver o erro completo:

```bash
# Os logs agora mostram:
Error registering user: [erro completo]
Error stack: [stack trace]
Error details: { name, code, message, constraint }
```

### 2. Verificar Tabela de Sessões

No banco de dados, verifique se a tabela `sessions` existe:

```sql
SELECT * FROM sessions LIMIT 1;
```

Se não existir, será criada automaticamente na próxima requisição.

### 3. Verificar Tabela de Usuários

```sql
SELECT * FROM users LIMIT 1;
```

Verifique se a tabela `users` existe e tem a estrutura correta.

### 4. Verificar Conexão com Banco

No `.env` do Easypanel, verifique se `DATABASE_URL` está correto:

```env
DATABASE_URL=postgresql://usuario:senha@host:5432/imobpaga
```

---

## 🧪 Testes

### 1. Testar Registro

1. Acesse a aplicação
2. Tente criar uma conta
3. Verifique os logs do servidor
4. Se ainda der erro, os logs mostrarão o problema específico

### 2. Verificar Sessão

Após o registro, verifique se a sessão foi criada:

```sql
SELECT * FROM sessions ORDER BY expire DESC LIMIT 5;
```

---

## 📋 Checklist de Verificação

- [x] Melhor tratamento de erros implementado
- [x] Criação automática de tabela de sessões
- [ ] Verificar logs do servidor no Easypanel
- [ ] Testar registro novamente
- [ ] Verificar se tabela `sessions` foi criada
- [ ] Verificar se tabela `users` existe e está correta

---

## 🚀 Próximos Passos

1. **Fazer commit e push:**
   ```bash
   git add .
   git commit -m "fix: melhora tratamento de erros no registro e cria tabela sessions automaticamente"
   git push
   ```

2. **Aguardar deploy no Easypanel**

3. **Testar registro novamente**

4. **Verificar logs se ainda houver erro**

---

## 🔧 Possíveis Problemas Adicionais

### Problema: bcrypt não compilado

**Sintoma:** Erro relacionado a `bcrypt` ou `node-gyp`

**Solução:**
- Verificar se `bcrypt` está em `dependencies` (não apenas `devDependencies`)
- No Dockerfile, garantir que ferramentas de build estão instaladas

### Problema: Conexão com banco

**Sintoma:** Erro de conexão ou timeout

**Solução:**
- Verificar `DATABASE_URL` no Easypanel
- Verificar se o banco está acessível
- Verificar firewall/security groups

### Problema: Schema do banco

**Sintoma:** Erro de coluna não encontrada ou constraint

**Solução:**
- Executar `npm run db:push` no banco de produção
- Verificar se todas as tabelas foram criadas

---

**Agora os logs mostrarão exatamente qual é o problema! 🔍**

