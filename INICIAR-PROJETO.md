# 🚀 Como Iniciar o Projeto

## Pré-requisitos

1. ✅ Docker Desktop instalado e rodando
2. ✅ Arquivo `.env` configurado

---

## Passo a Passo

### 1. Iniciar Docker Desktop

**Windows:**
- Abra o Docker Desktop do menu iniciar
- Aguarde até aparecer "Docker Desktop is running" na barra de tarefas

**Verificar se está rodando:**
```powershell
docker ps
```

Se aparecer uma lista (mesmo que vazia), está OK! ✅

---

### 2. Iniciar os Serviços

**No PowerShell, no diretório do projeto:**
```powershell
docker compose -f docker-compose.dev.yml up -d
```

**O que isso faz:**
- ✅ Inicia o PostgreSQL (banco de dados)
- ✅ Inicia a aplicação Node.js
- ✅ Instala dependências automaticamente
- ✅ Executa migrations do banco
- ✅ Inicia o servidor em modo desenvolvimento

---

### 3. Verificar se Está Rodando

**Ver logs da aplicação:**
```powershell
docker compose -f docker-compose.dev.yml logs -f app
```

**Ver status dos containers:**
```powershell
docker compose -f docker-compose.dev.yml ps
```

**Você deve ver algo como:**
```
NAME                     STATUS          PORTS
imobpaga-app-dev         Up              0.0.0.0:5000->5000/tcp
imobpaga-postgres-dev    Up (healthy)    0.0.0.0:5432->5432/tcp
```

---

### 4. Acessar a Aplicação

🌐 **Frontend + Backend:** http://localhost:5000

📊 **pgAdmin (gerenciador de banco):** http://localhost:5050
- Email: `admin@imobpaga.com`
- Senha: `admin123`

---

## 📋 Comandos Úteis

### Parar os serviços
```powershell
docker compose -f docker-compose.dev.yml down
```

### Reiniciar os serviços
```powershell
docker compose -f docker-compose.dev.yml restart
```

### Ver logs em tempo real
```powershell
docker compose -f docker-compose.dev.yml logs -f app
```

### Reinstalar dependências
```powershell
docker compose -f docker-compose.dev.yml down
docker compose -f docker-compose.dev.yml up -d
```

### Limpar tudo e começar do zero
```powershell
docker compose -f docker-compose.dev.yml down -v
docker compose -f docker-compose.dev.yml up -d
```

---

## 🐛 Problemas Comuns

### Erro: "Docker Desktop is not running"

**Solução:**
1. Abra o Docker Desktop
2. Aguarde até aparecer "Docker Desktop is running"
3. Tente novamente

### Erro: "port is already allocated"

**Solução:**
Algum serviço já está usando a porta 5000 ou 5432.

**Para port 5000:**
```powershell
# Ver o que está usando a porta
netstat -ano | findstr :5000

# Matar o processo (substitua PID pelo número encontrado)
taskkill /PID <PID> /F
```

**Para port 5432:**
Se você tem PostgreSQL instalado localmente, desabilite-o ou use outra porta.

### Aplicação não inicia / Erro no banco

**Solução:**
```powershell
# Parar tudo
docker compose -f docker-compose.dev.yml down -v

# Limpar volumes
docker volume prune

# Iniciar novamente
docker compose -f docker-compose.dev.yml up -d
```

### Logs mostram erro de conexão com banco

**Verificar:**
1. O arquivo `.env` tem `DATABASE_URL` correto?
2. O PostgreSQL está rodando? (`docker compose ps`)
3. Esperar alguns segundos para o banco inicializar

---

## ✅ Checklist de Inicialização

- [ ] Docker Desktop está rodando
- [ ] Arquivo `.env` está configurado
- [ ] Executei `docker compose -f docker-compose.dev.yml up -d`
- [ ] Containers estão rodando (`docker compose ps`)
- [ ] Consigo acessar http://localhost:5000
- [ ] Não há erros nos logs (`docker compose logs app`)

---

**Pronto para testar! 🎉**



