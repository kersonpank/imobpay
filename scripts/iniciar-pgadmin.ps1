# Script para iniciar pgAdmin facilmente
# Uso: .\scripts\iniciar-pgadmin.ps1

Write-Host "=== Iniciando pgAdmin para ImobPaga ===" -ForegroundColor Cyan
Write-Host ""

# Verificar se Docker está rodando
try {
    docker info | Out-Null
} catch {
    Write-Host "❌ Docker não está rodando. Por favor, inicie o Docker Desktop." -ForegroundColor Red
    exit 1
}

Write-Host "1. Iniciando pgAdmin..." -ForegroundColor Yellow
docker compose -f docker-compose.dev.yml up -d pgadmin

Write-Host ""
Write-Host "2. Aguardando pgAdmin iniciar..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

Write-Host ""
Write-Host "3. Verificando status..." -ForegroundColor Yellow
docker compose -f docker-compose.dev.yml ps pgadmin

Write-Host ""
Write-Host "✅ pgAdmin iniciado!" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Acesse no navegador:" -ForegroundColor Cyan
Write-Host "   http://localhost:5050" -ForegroundColor White
Write-Host ""
Write-Host "📧 Credenciais de login:" -ForegroundColor Cyan
Write-Host "   Email: admin@imobpaga.com" -ForegroundColor White
Write-Host "   Senha: admin123" -ForegroundColor White
Write-Host ""
Write-Host "🔌 Para adicionar o servidor PostgreSQL no pgAdmin:" -ForegroundColor Cyan
Write-Host "   1. Clique em 'Servers' → 'Register' → 'Server...'" -ForegroundColor White
Write-Host "   2. Na aba 'Connection', configure:" -ForegroundColor White
Write-Host "      - Host: postgres" -ForegroundColor Yellow
Write-Host "      - Port: 5432" -ForegroundColor Yellow
Write-Host "      - Database: imobpaga" -ForegroundColor Yellow
Write-Host "      - Username: imobpaga" -ForegroundColor Yellow
Write-Host "      - Password: imobpaga_dev_password" -ForegroundColor Yellow
Write-Host ""
Write-Host "📚 Veja o guia completo em: GUI-ACESSO-BANCO.md" -ForegroundColor Gray
Write-Host ""






