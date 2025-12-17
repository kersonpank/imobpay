# ✅ PRONTO PARA TESTAR!

## 🎉 Status

✅ **Servidor rodando** na porta 5000  
✅ **PostgreSQL** configurado e healthy  
✅ **Banco de dados** sincronizado  
✅ **Dependências** instaladas  

---

## 🌐 Acesse a Aplicação

**URL:** http://localhost:5000

---

## 📋 Verificar Status

```powershell
# Ver status dos containers
docker compose -f docker-compose.dev.yml ps

# Ver logs em tempo real
docker compose -f docker-compose.dev.yml logs -f app
```

---

## 🧪 Testes Básicos

### 1. Acessar o site
Abra no navegador: **http://localhost:5000**

Você deve ver a página inicial do ImobPaga.

### 2. Criar uma conta

1. Clique em **"Criar Conta"**
2. Preencha:
   - Email: `teste@exemplo.com`
   - Senha: `Senha123!`
   - Nome (opcional)
3. Clique em **"Criar Conta"**

### 3. Completar onboarding

Após criar conta, você será redirecionado para escolher o perfil:
- **Locador** - Possuo imóveis para alugar
- **Locatário** - Busco um imóvel para alugar

Preencha CPF e telefone, depois clique em **"Continuar"**.

### 4. Testar dashboard

Após completar o onboarding, você será redirecionado para o dashboard:
- **Locador** → `/landlord`
- **Locatário** → `/tenant`

---

## 📝 Próximos Testes

### Upload de Arquivos

1. Acesse uma página que tenha upload
2. Use o componente `FileUpload` para enviar arquivos
3. Verifique se os arquivos aparecem em `uploads/`

### Geração de Contratos (requer OpenAI API Key)

1. Configure `OPENAI_API_KEY` no `.env`
2. Crie um contrato
3. Use a rota `/api/contracts/:id/generate`

---

## 🔧 Comandos Úteis

### Ver logs em tempo real
```powershell
docker compose -f docker-compose.dev.yml logs -f app
```

### Ver logs do PostgreSQL
```powershell
docker compose -f docker-compose.dev.yml logs postgres
```

### Reiniciar aplicação
```powershell
docker compose -f docker-compose.dev.yml restart app
```

### Parar tudo
```powershell
docker compose -f docker-compose.dev.yml down
```

### Iniciar novamente
```powershell
docker compose -f docker-compose.dev.yml up -d
```

### Acessar o container
```powershell
docker compose -f docker-compose.dev.yml exec app sh
```

---

## ✅ Checklist de Teste

- [x] Containers rodando
- [x] Servidor respondendo na porta 5000
- [ ] Site carrega no navegador
- [ ] Pode criar conta
- [ ] Pode fazer login
- [ ] Pode completar onboarding
- [ ] Dashboard carrega corretamente
- [ ] Pode criar propriedade (locador)
- [ ] Pode fazer upload de arquivos
- [ ] Pode gerar contratos (se tiver OpenAI API Key)

---

## 🐛 Problemas Comuns

### Site não carrega

1. **Verifique se o servidor está rodando:**
   ```powershell
   docker compose -f docker-compose.dev.yml ps
   ```

2. **Verifique os logs:**
   ```powershell
   docker compose -f docker-compose.dev.yml logs app
   ```

3. **Reinicie o container:**
   ```powershell
   docker compose -f docker-compose.dev.yml restart app
   ```

### Erro 401 (Não autorizado)

- Verifique se fez login corretamente
- Limpe os cookies do navegador
- Tente fazer logout e login novamente

### Erro ao criar conta

- Verifique os logs do servidor
- Verifique se o banco de dados está rodando
- Verifique se as tabelas foram criadas (`db:push` executou)

---

## 📚 Documentação

- **Guia Docker Completo:** [DOCKER.md](./DOCKER.md)
- **Guia de Testes:** [TESTING.md](./TESTING.md)
- **Setup Manual:** [SETUP.md](./SETUP.md)
- **Início Rápido Docker:** [QUICKSTART-DOCKER.md](./QUICKSTART-DOCKER.md)

---

## 🎯 Próximos Passos

Após testar o básico:

1. ✅ **Integração Mercado Pago** - Adicionar pagamentos reais
2. ✅ **Sistema de Vistoria** - Checklist com fotos
3. ✅ **Notificações** - Email/WhatsApp
4. ✅ **Dashboard Completo** - Estatísticas e gráficos
5. ✅ **Relatórios** - Exportar dados

---

**Aproveite testando! 🚀**

Se encontrar algum problema, verifique os logs e consulte a documentação.







