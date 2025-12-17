# 🧪 Guia de Testes - ImobPaga

## ✅ Funcionalidades Implementadas

### 1. Sistema de Upload de Arquivos ✅
- ✅ Backend: multer configurado com storage local
- ✅ Rotas: `/api/documents` (upload único) e `/api/upload/multiple` (múltiplos)
- ✅ Frontend: Componente `FileUpload` com drag & drop
- ✅ Validações: Tamanho máximo (10MB), tipos de arquivo permitidos
- ✅ Organização: Arquivos organizados em `uploads/` por categoria

### 2. Template de Contrato ✅
- ✅ Template completo em `shared/contract-template.md`
- ✅ Placeholders dinâmicos `{{VARIAVEL}}`
- ✅ Suporte a condicionais (fiador, garantia, etc.)
- ✅ Estrutura completa do contrato de locação

### 3. Geração de Contratos com IA ✅
- ✅ Integração OpenAI configurada
- ✅ Serviço de geração em `server/services/contract-generator.ts`
- ✅ Rota: `POST /api/contracts/:id/generate`
- ✅ Gera metadados e cronograma de pagamentos automaticamente

## 📋 Pré-requisitos para Testar

### 1. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```bash
cp env.example.txt .env
```

Configure pelo menos:
- `DATABASE_URL` - Connection string do PostgreSQL
- `SESSION_SECRET` - Secret aleatório seguro
- `OPENAI_API_KEY` (opcional) - Para geração de contratos com IA

### 2. Configurar Banco de Dados

```bash
# Usando npx diretamente (se npm run não funcionar)
npx drizzle-kit push
```

Ou configure o script no package.json (já adicionado):
```bash
npm run db:push
```

## 🚀 Como Testar

### 1. Iniciar o Servidor

```bash
npm run dev
```

O servidor estará disponível em `http://localhost:5000`

### 2. Testar Upload de Arquivos

#### Via Frontend:
1. Acesse a aplicação no navegador
2. Use o componente `<FileUpload />` em qualquer página
3. Selecione arquivos (imagens, PDFs, documentos)
4. Faça upload e verifique os arquivos em `uploads/`

#### Via API:
```bash
# Upload único
curl -X POST http://localhost:5000/api/documents \
  -F "file=@/caminho/para/arquivo.pdf" \
  -F "type=document" \
  -b cookies.txt \
  -c cookies.txt

# Upload múltiplo
curl -X POST http://localhost:5000/api/upload/multiple \
  -F "photos=@/caminho/para/foto1.jpg" \
  -F "photos=@/caminho/para/foto2.jpg" \
  -F "type=property_photo" \
  -b cookies.txt \
  -c cookies.txt
```

### 3. Testar Geração de Contratos

**Importante**: Para gerar contratos com IA, você precisa:
1. Ter uma conta OpenAI
2. Obter API key em https://platform.openai.com/api-keys
3. Adicionar ao `.env`: `OPENAI_API_KEY=sk-...`

#### Fluxo Completo:

1. **Criar usuário (Locador)**:
   ```bash
   POST /api/auth/register
   {
     "email": "locador@test.com",
     "password": "Senha123!",
     "firstName": "João",
     "lastName": "Silva"
   }
   ```

2. **Fazer login**:
   ```bash
   POST /api/auth/login
   {
     "email": "locador@test.com",
     "password": "Senha123!"
   }
   ```

3. **Completar onboarding (definir role e CPF)**:
   ```bash
   PATCH /api/user
   {
     "role": "landlord",
     "cpf": "123.456.789-00",
     "phone": "(11) 99999-9999"
   }
   ```

4. **Cadastrar imóvel**:
   ```bash
   POST /api/properties
   {
     "title": "Casa 3 Quartos",
     "description": "Casa com 3 quartos, sala, cozinha, 2 banheiros",
     "address": "Rua das Flores, 123",
     "city": "São Paulo",
     "state": "SP",
     "zipcode": "01234-567",
     "rentValue": "2500.00",
     "status": "available"
   }
   ```

5. **Criar locatário e contrato**:
   - Criar conta para locatário
   - Criar contrato vinculando propriedade, locador e locatário

6. **Gerar contrato com IA**:
   ```bash
   POST /api/contracts/{contractId}/generate
   ```
   
   Isso irá:
   - Buscar dados do locador, locatário e imóvel
   - Gerar contrato usando OpenAI
   - Criar cronograma de pagamentos automaticamente
   - Atualizar status do contrato para "generated"

### 4. Verificar Arquivos Enviados

Os arquivos são salvos em:
- `uploads/documents/` - Documentos gerais
- `uploads/properties/` - Fotos de imóveis
- `uploads/contracts/` - Contratos assinados
- `uploads/inspections/` - Fotos de vistoria

Acesse via: `http://localhost:5000/uploads/{categoria}/{nome-arquivo}`

## 🐛 Troubleshooting

### Erro: "OPENAI_API_KEY não configurada"
- **Solução**: Adicione `OPENAI_API_KEY` ao arquivo `.env`
- **Alternativa**: A funcionalidade de geração com IA não funcionará, mas o resto do sistema continua operacional

### Erro: "DATABASE_URL must be set"
- **Solução**: Configure a connection string do PostgreSQL no `.env`
- **Teste**: Verifique se consegue conectar ao banco usando `psql` ou cliente similar

### Erro: "Could not find the build directory"
- **Solução**: Execute `npm run build` antes de `npm start` (em produção)
- **Desenvolvimento**: Use `npm run dev` que não precisa de build

### Upload não funciona
- **Verifique**: Se a pasta `uploads/` foi criada automaticamente
- **Verifique**: Permissões de escrita na pasta
- **Logs**: Veja o console do servidor para erros detalhados

### Contrato não gera
- **Verifique**: Se todos os dados necessários estão preenchidos (CPF, nome completo, etc.)
- **Verifique**: Se a API key do OpenAI está válida
- **Logs**: Veja o console do servidor para erros da API OpenAI

## 📝 Próximos Passos

Após testar essas funcionalidades, você pode:

1. ✅ **Integração Mercado Pago** - Adicionar pagamentos reais
2. ✅ **Sistema de Vistoria** - Checklist com fotos
3. ✅ **Notificações** - Email/WhatsApp para lembretes
4. ✅ **Dashboard Completo** - Visualizar estatísticas e gráficos
5. ✅ **Relatórios** - Exportar dados em PDF/Excel

## 🎯 Checklist de Testes

- [ ] Upload de documento único funciona
- [ ] Upload múltiplo de fotos funciona
- [ ] Arquivos são salvos corretamente
- [ ] Arquivos são acessíveis via URL
- [ ] Template de contrato carrega corretamente
- [ ] Geração de contrato com IA funciona (com OPENAI_API_KEY)
- [ ] Metadados do contrato são gerados corretamente
- [ ] Cronograma de pagamentos é criado automaticamente
- [ ] Frontend mostra componente FileUpload corretamente
- [ ] Validações de tamanho e tipo de arquivo funcionam

---

**Desenvolvido com ❤️ para facilitar o gerenciamento de aluguéis**

