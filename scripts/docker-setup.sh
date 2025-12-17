#!/bin/bash

# Script de setup rápido para Docker
# Uso: ./scripts/docker-setup.sh [dev|prod]

set -e

MODE=${1:-dev}

echo "🐳 Configurando ImobPaga no Docker (modo: $MODE)..."

# Verificar se Docker está rodando
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker não está rodando. Por favor, inicie o Docker Desktop."
    exit 1
fi

# Verificar se .env existe
if [ ! -f .env ]; then
    echo "📝 Criando arquivo .env..."
    cp env.example.txt .env
    
    # Gerar SESSION_SECRET
    SESSION_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('base64'))")
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s/SESSION_SECRET=.*/SESSION_SECRET=$SESSION_SECRET/" .env
    else
        # Linux
        sed -i "s/SESSION_SECRET=.*/SESSION_SECRET=$SESSION_SECRET/" .env
    fi
    
    echo "✅ Arquivo .env criado com SESSION_SECRET gerado automaticamente"
    echo "⚠️  IMPORTANTE: Edite o arquivo .env e configure as variáveis necessárias"
else
    echo "✅ Arquivo .env já existe"
fi

# Escolher arquivo docker-compose
if [ "$MODE" = "prod" ]; then
    COMPOSE_FILE="docker-compose.prod.yml"
    echo "🚀 Iniciando em modo PRODUÇÃO..."
else
    COMPOSE_FILE="docker-compose.dev.yml"
    echo "🔧 Iniciando em modo DESENVOLVIMENTO..."
fi

# Parar containers existentes (se houver)
echo "🛑 Parando containers existentes..."
docker-compose -f $COMPOSE_FILE down 2>/dev/null || true

# Criar diretórios necessários
echo "📁 Criando diretórios..."
mkdir -p uploads/documents uploads/properties uploads/contracts uploads/inspections
mkdir -p backups

# Iniciar serviços
echo "🚀 Iniciando serviços Docker..."
docker-compose -f $COMPOSE_FILE up -d --build

# Aguardar PostgreSQL estar pronto
echo "⏳ Aguardando PostgreSQL ficar pronto..."
sleep 5
until docker-compose -f $COMPOSE_FILE exec -T postgres pg_isready -U imobpaga > /dev/null 2>&1; do
    echo "   Aguardando..."
    sleep 2
done
echo "✅ PostgreSQL está pronto!"

# Configurar banco de dados
echo "🗄️  Configurando banco de dados..."
docker-compose -f $COMPOSE_FILE exec -T app npm run db:push || {
    echo "⚠️  Erro ao configurar banco. Tentando novamente..."
    sleep 3
    docker-compose -f $COMPOSE_FILE exec -T app npm run db:push
}

echo ""
echo "✅ Setup concluído!"
echo ""
echo "📊 Status dos containers:"
docker-compose -f $COMPOSE_FILE ps

echo ""
echo "🌐 Acesse a aplicação em: http://localhost:5000"
echo ""
echo "📋 Comandos úteis:"
echo "  Ver logs:        docker-compose -f $COMPOSE_FILE logs -f"
echo "  Parar:           docker-compose -f $COMPOSE_FILE down"
echo "  Reiniciar:       docker-compose -f $COMPOSE_FILE restart"
echo ""

