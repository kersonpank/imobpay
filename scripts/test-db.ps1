# Script de Teste Rápido do Banco de Dados
# Uso: .\scripts\test-db.ps1

param(
    [string]$Mode = "dev"
)

Write-Host "=== Teste do Banco de Dados ImobPaga ===" -ForegroundColor Cyan
Write-Host ""

$ComposeFile = if ($Mode -eq "prod") { "docker-compose.prod.yml" } else { "docker-compose.dev.yml" }

Write-Host "1. Verificando status dos containers..." -ForegroundColor Yellow
docker compose -f $ComposeFile ps postgres app
Write-Host ""

Write-Host "2. Testando conexão com PostgreSQL..." -ForegroundColor Yellow
$pgReady = docker compose -f $ComposeFile exec postgres pg_isready -U imobpaga 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ PostgreSQL está pronto!" -ForegroundColor Green
    Write-Host $pgReady
} else {
    Write-Host "❌ PostgreSQL não está respondendo" -ForegroundColor Red
    exit 1
}
Write-Host ""

Write-Host "3. Listando tabelas..." -ForegroundColor Yellow
docker compose -f $ComposeFile exec postgres psql -U imobpaga -d imobpaga -c "\dt"
Write-Host ""

Write-Host "4. Verificando registros nas tabelas..." -ForegroundColor Yellow
docker compose -f $ComposeFile exec postgres psql -U imobpaga -d imobpaga -c "
SELECT 
    'users' as tabela, COUNT(*) as registros FROM users
UNION ALL
SELECT 'properties', COUNT(*) FROM properties
UNION ALL
SELECT 'contracts', COUNT(*) FROM contracts
UNION ALL
SELECT 'payments', COUNT(*) FROM payments
UNION ALL
SELECT 'documents', COUNT(*) FROM documents
UNION ALL
SELECT 'sessions', COUNT(*) FROM sessions;
"
Write-Host ""

Write-Host "5. Últimos usuários cadastrados..." -ForegroundColor Yellow
docker compose -f $ComposeFile exec postgres psql -U imobpaga -d imobpaga -c "SELECT email, role, created_at FROM users ORDER BY created_at DESC LIMIT 5;"
Write-Host ""

Write-Host "✅ Teste concluído!" -ForegroundColor Green
Write-Host ""
Write-Host "Para acessar o banco diretamente, use:" -ForegroundColor Cyan
Write-Host "  docker compose -f $ComposeFile exec postgres psql -U imobpaga -d imobpaga" -ForegroundColor White






