# Script para iniciar o projeto ImobPaga
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  INICIANDO PROJETO IMOBPAGA" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se Docker está rodando
Write-Host "Verificando Docker..." -ForegroundColor Yellow
$dockerRunning = docker ps 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERRO: Docker Desktop nao esta rodando!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Por favor:" -ForegroundColor Yellow
    Write-Host "1. Abra o Docker Desktop" -ForegroundColor White
    Write-Host "2. Aguarde ate aparecer 'Docker Desktop is running'" -ForegroundColor White
    Write-Host "3. Execute este script novamente" -ForegroundColor White
    Write-Host ""
    exit 1
}

Write-Host "Docker esta rodando! OK" -ForegroundColor Green
Write-Host ""

# Verificar se arquivo docker-compose existe
if (-not (Test-Path "docker-compose.dev.yml")) {
    Write-Host "ERRO: Arquivo docker-compose.dev.yml nao encontrado!" -ForegroundColor Red
    Write-Host "Certifique-se de estar no diretorio correto do projeto." -ForegroundColor Yellow
    exit 1
}

# Iniciar serviços
Write-Host "Iniciando servicos Docker..." -ForegroundColor Yellow
Write-Host ""

docker compose -f docker-compose.dev.yml up -d

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  PROJETO INICIADO COM SUCESSO!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Aplicacao: http://localhost:5000" -ForegroundColor Cyan
    Write-Host "pgAdmin:   http://localhost:5050" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Para ver os logs:" -ForegroundColor Yellow
    Write-Host "  docker compose -f docker-compose.dev.yml logs -f app" -ForegroundColor White
    Write-Host ""
    Write-Host "Para parar os servicos:" -ForegroundColor Yellow
    Write-Host "  docker compose -f docker-compose.dev.yml down" -ForegroundColor White
    Write-Host ""
    
    # Aguardar um pouco e mostrar logs
    Write-Host "Aguardando inicializacao..." -ForegroundColor Yellow
    Start-Sleep -Seconds 3
    
    Write-Host ""
    Write-Host "Ultimas linhas dos logs:" -ForegroundColor Yellow
    Write-Host "----------------------------------------" -ForegroundColor Gray
    docker compose -f docker-compose.dev.yml logs --tail 10 app
} else {
    Write-Host ""
    Write-Host "ERRO ao iniciar os servicos!" -ForegroundColor Red
    Write-Host "Verifique os logs:" -ForegroundColor Yellow
    Write-Host "  docker compose -f docker-compose.dev.yml logs" -ForegroundColor White
    exit 1
}



