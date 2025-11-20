# Plano de Correção: Erro de Autenticação no Onboarding

## Diagnóstico do Problema

### Sintomas Observados
1. ✅ Usuário consegue se registrar com sucesso (POST /api/auth/register retorna 200)
2. ❌ Ao tentar completar o onboarding (PATCH /api/user), recebe erro 401 (Unauthorized)
3. ✅ Sessão está sendo salva corretamente no PostgreSQL com userId
4. ✅ Frontend está configurado para enviar credentials: "include"
5. ❌ Cookie de sessão não está sendo reconhecido nas requisições subsequentes

### Causa Raiz
O problema está na **configuração de cookies de sessão**. Embora a sessão seja salva no banco de dados, o cookie não está sendo enviado de volta pelo navegador ou não está sendo aceito pelo servidor nas requisições subsequentes.

Possíveis causas técnicas:
- Cookie não está sendo definido com o caminho correto (`path`)
- Falta de configuração explícita de CORS para aceitar cookies
- Problema com o nome do cookie (pode haver conflitos)
- O servidor pode não estar configurado para aceitar cookies em todas as rotas

## Arquivos Afetados

### Backend
1. `server/auth.ts` - Configuração de sessão e cookies
2. `server/routes.ts` - Rotas de autenticação e onboarding
3. `server/index.ts` - Configuração do servidor Express

### Frontend
4. `client/src/lib/queryClient.ts` - Configuração de requisições API
5. `client/src/pages/OnboardingRole.tsx` - Página de onboarding
6. `client/src/pages/Register.tsx` - Página de registro

## Plano de Implementação

### Etapa 1: Melhorar Configuração de Cookies
**Arquivo:** `server/auth.ts`

**Problema:** Cookie pode não estar sendo aceito pelo navegador devido a configurações inadequadas.

**Solução:**
- Adicionar configuração explícita de `name` para o cookie da sessão
- Garantir que o cookie funcione em desenvolvimento e produção
- Adicionar logs para debug de sessão

**Código:**
```typescript
session({
  name: 'alugafacil.sid',  // Nome específico evita conflitos
  store: new PgSession({
    conString: process.env.DATABASE_URL,
    tableName: 'sessions',
    createTableIfMissing: false,
  }),
  secret: process.env.SESSION_SECRET || 'default-secret-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    path: '/',  // Explicitamente definir path
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    domain: undefined,  // Permite que funcione em qualquer domínio
  },
})
```

### Etapa 2: Adicionar Logs de Debug para Sessão
**Arquivo:** `server/auth.ts`

**Problema:** Não sabemos se o cookie está chegando ao servidor ou se a sessão está sendo encontrada.

**Solução:** Adicionar logs detalhados no middleware `isAuthenticated`

**Código:**
```typescript
export function isAuthenticated(req: Request, res: Response, next: NextFunction): void {
  console.log('[isAuthenticated] Session ID:', req.sessionID);
  console.log('[isAuthenticated] Session:', req.session);
  console.log('[isAuthenticated] Cookies:', req.headers.cookie);
  
  if (!req.session?.userId) {
    console.log('[isAuthenticated] No userId in session - returning 401');
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  
  console.log('[isAuthenticated] Authenticated userId:', req.session.userId);
  (req as AuthenticatedRequest).userId = req.session.userId;
  next();
}
```

### Etapa 3: Adicionar Middleware de CORS Explícito
**Arquivo:** `server/index.ts`

**Problema:** Pode não estar aceitando cookies de requisições cross-origin (mesmo que seja mesmo domínio).

**Solução:** Configurar headers CORS explicitamente antes de tudo

**Código:**
```typescript
// Adicionar logo após app.use(express.json())
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});
```

### Etapa 4: Melhorar Tratamento de Erros no Frontend
**Arquivo:** `client/src/pages/OnboardingRole.tsx`

**Problema:** Erro genérico não ajuda o usuário a entender o que aconteceu.

**Solução:** Capturar e exibir mensagem de erro específica do servidor

**Código:**
```typescript
const mutation = useMutation({
  mutationFn: async (data: { role: "landlord" | "tenant"; cpf: string; phone: string }) => {
    const response = await apiRequest("PATCH", "/api/user", data);
    return response.json();
  },
  onSuccess: (data) => {
    queryClient.setQueryData(["/api/auth/user"], data);
    toast({
      title: "Perfil atualizado!",
      description: "Seu perfil foi configurado com sucesso.",
    });
    setLocation(selectedRole === "landlord" ? "/landlord" : "/tenant");
  },
  onError: (error: any) => {
    console.error('[Onboarding] Error:', error);
    const errorMessage = error.message || "Não foi possível atualizar seu perfil. Tente novamente.";
    toast({
      title: "Erro ao atualizar perfil",
      description: errorMessage,
      variant: "destructive",
    });
  },
});
```

### Etapa 5: Garantir que Registro Atualiza Cache Corretamente
**Arquivo:** `client/src/pages/Register.tsx`

**Problema:** Após registro, o cache pode não estar atualizado com o novo usuário.

**Solução:** Fazer fetch do usuário após registro para garantir que o cache está atualizado

**Código:**
```typescript
onSuccess: async (user) => {
  // Salvar dados do usuário no cache
  queryClient.setQueryData(["/api/auth/user"], user);
  
  // Garantir que o cache está atualizado fazendo um refetch
  await queryClient.refetchQueries({ queryKey: ["/api/auth/user"] });
  
  setLocation("/onboarding");
},
```

### Etapa 6: Adicionar Validação de Sessão Antes do Onboarding
**Arquivo:** `client/src/App.tsx`

**Problema:** Usuário pode chegar na tela de onboarding sem sessão válida.

**Solução:** Verificar autenticação antes de mostrar onboarding

**Código:** (Já está implementado corretamente, apenas garantir que funciona)

## Ordem de Implementação

1. ✅ **Primeiro:** Adicionar logs de debug (Etapa 2)
2. ✅ **Segundo:** Melhorar configuração de cookies (Etapa 1)
3. ✅ **Terceiro:** Adicionar CORS explícito (Etapa 3)
4. ✅ **Quarto:** Melhorar tratamento de erros frontend (Etapa 4)
5. ✅ **Quinto:** Atualizar cache no registro (Etapa 5)
6. ✅ **Sexto:** Testar fluxo completo

## Testes Necessários

### Teste 1: Registro e Onboarding como Locador
1. Criar nova conta com email único
2. Verificar logs do servidor para ver se sessão foi criada
3. Selecionar "Locador" no onboarding
4. Preencher CPF e telefone
5. Clicar em "Continuar"
6. Verificar logs para ver se cookie foi enviado
7. ✅ Deve redirecionar para dashboard do locador

### Teste 2: Registro e Onboarding como Locatário
1. Criar nova conta com email único
2. Selecionar "Locatário" no onboarding
3. Preencher CPF e telefone
4. Clicar em "Continuar"
5. ✅ Deve redirecionar para dashboard do locatário

### Teste 3: Verificar Persistência de Sessão
1. Fazer login
2. Completar onboarding
3. Recarregar página
4. ✅ Deve manter usuário logado no dashboard correto

## Checklist de Implementação

- [ ] Adicionar logs de debug no middleware isAuthenticated
- [ ] Atualizar configuração de cookies com nome e path explícitos
- [ ] Adicionar middleware CORS antes das rotas
- [ ] Melhorar tratamento de erros no OnboardingRole
- [ ] Atualizar lógica de cache após registro
- [ ] Reiniciar workflow
- [ ] Testar registro como Locador
- [ ] Testar registro como Locatário
- [ ] Verificar logs do servidor durante os testes
- [ ] Confirmar que não há mais erros 401 no onboarding

## Notas Técnicas

### Por que isso está acontecendo?
O Express Session precisa que o cookie seja enviado de volta pelo navegador em cada requisição. Se o cookie não for configurado corretamente (path, domain, sameSite), o navegador pode não enviá-lo de volta, resultando em sessão não encontrada.

### Por que adicionar logs?
Os logs nos ajudarão a entender exatamente onde o fluxo está quebrando:
- Cookie chegando ao servidor?
- Sessão sendo encontrada no banco?
- userId presente na sessão?

### Por que CORS explícito?
Mesmo que seja mesmo domínio, em desenvolvimento com Vite proxy pode haver questões de cross-origin. Configurar CORS explicitamente garante que cookies sejam aceitos.
