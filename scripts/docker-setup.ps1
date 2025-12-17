# Script de setup rápido para Docker (Windows PowerShell)
# Uso: .\scripts\docker-setup.ps1 [dev|prod]

param(
    [string]$Mode = "dev"
)

Write-Host "Configurando ImobPaga no Docker (modo: $Mode)..." -ForegroundColor Cyan

# Verificar se Docker esta rodando
try {
    docker info | Out-Null
} catch {
    Write-Host "Docker nao esta rodando. Por favor, inicie o Docker Desktop." -ForegroundColor Red
    exit 1
}

# Verificar se .env existe
if (-not (Test-Path .env)) {
    Write-Host "Criando arquivo .env..." -ForegroundColor Yellow
    Copy-Item env.example.txt .env
    
    # Gerar SESSION_SECRET
    $SESSION_SECRET = node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
    (Get-Content .env) -replace 'SESSION_SECRET=.*', "SESSION_SECRET=$SESSION_SECRET" | Set-Content .env
    
    Write-Host "Arquivo .env criado com SESSION_SECRET gerado automaticamente" -ForegroundColor Green
    Write-Host "IMPORTANTE: Edite o arquivo .env e configure as variaveis necessarias" -ForegroundColor Yellow
} else {
    Write-Host "Arquivo .env ja existe" -ForegroundColor Green
}

# Escolher arquivo docker-compose
if ($Mode -eq "prod") {
    $ComposeFile = "docker-compose.prod.yml"
    Write-Host "Iniciando em modo PRODUCAO..." -ForegroundColor Cyan
} else {
    $ComposeFile = "docker-compose.dev.yml"
    Write-Host "Iniciando em modo DESENVOLVIMENTO..." -ForegroundColor Cyan
}

# Parar containers existentes (se houver)
Write-Host "Parando containers existentes..." -ForegroundColor Yellow
docker compose -f $ComposeFile down 2>$null

# Criar diretorios necessarios
Write-Host "Criando diretorios..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path uploads\documents, uploads\properties, uploads\contracts, uploads\inspections, backups | Out-Null

# Iniciar serviços
Write-Host "Iniciando servicos Docker..." -ForegroundColor Cyan
docker compose -f $ComposeFile up -d --build

# Aguardar PostgreSQL estar pronto
Write-Host "Aguardando PostgreSQL ficar pronto..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

$maxAttempts = 30
$attempt = 0
while ($attempt -lt $maxAttempts) {
    try {
        docker compose -f $ComposeFile exec postgres pg_isready -U imobpaga 2>$null | Out-Null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "PostgreSQL esta pronto!" -ForegroundColor Green
            break
        }
    } catch {
        # Continua tentando
    }
    $attempt++
    Write-Host "   Aguardando... ($attempt/$maxAttempts)" -ForegroundColor Gray
    Start-Sleep -Seconds 2
}

if ($attempt -eq $maxAttempts) {
    Write-Host "Timeout aguardando PostgreSQL. Verifique os logs." -ForegroundColor Yellow
}

# Configurar banco de dados
Write-Host "Configurando banco de dados..." -ForegroundColor Cyan
docker compose -f $ComposeFile exec app npm run db:push
if ($LASTEXITCODE -ne 0) {
    Write-Host "Erro ao configurar banco. Tentando novamente..." -ForegroundColor Yellow
    Start-Sleep -Seconds 3
    docker compose -f $ComposeFile exec app npm run db:push
}

Write-Host ""
Write-Host "Setup concluido!" -ForegroundColor Green
Write-Host ""
Write-Host "Status dos containers:" -ForegroundColor Cyan
docker compose -f $ComposeFile ps

Write-Host ""
Write-Host "Acesse a aplicacao em: http://localhost:5000" -ForegroundColor Green
Write-Host ""
Write-Host "Comandos uteis:" -ForegroundColor Cyan
Write-Host "  Ver logs:        docker compose -f $ComposeFile logs -f"
Write-Host "  Parar:           docker compose -f $ComposeFile down"
Write-Host "  Reiniciar:       docker compose -f $ComposeFile restart"
Write-Host ""

