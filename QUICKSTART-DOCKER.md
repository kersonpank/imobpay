# 🚀 Início Rápido - Docker

## ⚡ Setup em 3 Passos

### 1️⃣ Configure o .env

```powershell
# Copie o arquivo de exemplo
cp env.example.txt .env

# Edite o .env e configure pelo menos:
# - SESSION_SECRET (opcional - será gerado automaticamente)
# - OPENAI_API_KEY (opcional - apenas se quiser gerar contratos com IA)
```

### 2️⃣ Inicie os Serviços

**Windows PowerShell:**
```powershell
.\scripts\docker-setup.ps1
```

**Linux/Mac:**
```bash
chmod +x scripts/docker-setup.sh
./scripts/docker-setup.sh
```

**Ou manualmente:**
```powershell
# Desenvolvimento
docker-compose -f docker-compose.dev.yml up -d

# Produção
docker-compose -f docker-compose.prod.yml up -d --build
```

### 3️⃣ Configure o Banco de Dados (Primeira Vez)

```powershell
# Desenvolvimento
docker-compose -f docker-compose.dev.yml exec app npm run db:push

# Produção
docker-compose -f docker-compose.prod.yml exec app npm run db:push
```

## ✅ Pronto!

Acesse: **http://localhost:5000**

## 📋 Comandos Úteis

```powershell
# Ver logs
docker-compose -f docker-compose.dev.yml logs -f

# Parar serviços
docker-compose -f docker-compose.dev.yml down

# Reiniciar
docker-compose -f docker-compose.dev.yml restart

# Ver status
docker-compose -f docker-compose.dev.yml ps
```

## 🐛 Problemas?

- **Docker não inicia?** Verifique se o Docker Desktop está rodando
- **Erro de porta?** Certifique-se que a porta 5000 e 5432 estão livres
- **Banco não conecta?** Aguarde alguns segundos após iniciar os containers

Veja mais detalhes em: [DOCKER.md](./DOCKER.md)

