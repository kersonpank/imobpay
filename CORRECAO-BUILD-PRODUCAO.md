# 🔧 Correção do Erro de Build em Produção

## 🐛 Problema Identificado

**Erro:**
```
Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'vite' imported from /app/dist/index.js
```

**Causa:**
- O arquivo `server/index.ts` importava `server/vite.ts` no topo do arquivo
- `server/vite.ts` importa `vite` diretamente (que está em `devDependencies`)
- Quando o `esbuild` fazia o bundle do servidor, ele incluía o código de `vite.ts` no bundle
- Em produção, `vite` não está disponível (está apenas em `devDependencies`)

---

## ✅ Solução Implementada

### 1. Separação de Código

**Criado `server/static.ts`:**
- Contém `serveStatic()` e `log()` que não dependem de `vite`
- Usado em produção para servir arquivos estáticos

**Mantido `server/vite.ts`:**
- Contém apenas `setupVite()` que depende de `vite`
- Usado apenas em desenvolvimento

### 2. Import Dinâmico Condicional

**Antes:**
```typescript
import { setupVite, serveStatic, log } from "./vite";
```

**Depois:**
```typescript
import { serveStatic, log } from "./static"; // Sempre disponível

// Em desenvolvimento apenas:
if (app.get("env") === "development") {
  const { setupVite } = await import("./vite"); // Import dinâmico
  await setupVite(app, server);
} else {
  serveStatic(app); // Usa função que não depende de vite
}
```

### 3. Configuração do esbuild

**Ajustado `package.json`:**
```json
"build": "vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist --external:vite --external:./server/vite.ts --external:../vite.config.ts"
```

**Flags adicionadas:**
- `--external:vite` - Marca o pacote vite como externo
- `--external:./server/vite.ts` - Exclui o arquivo vite.ts do bundle
- `--external:../vite.config.ts` - Exclui a config do vite do bundle

---

## 📁 Arquivos Modificados

1. ✅ `server/index.ts` - Import dinâmico condicional
2. ✅ `server/static.ts` - **NOVO** - Funções sem dependência de vite
3. ✅ `server/vite.ts` - Removidas funções que não dependem de vite
4. ✅ `package.json` - Ajustado script de build

---

## 🧪 Como Testar

### 1. Build Local

```bash
npm run build
```

**Verificar:**
- Não deve haver erros
- `dist/index.js` não deve importar `vite`
- `dist/` deve conter `index.js` e `public/` (frontend buildado)

### 2. Testar Produção Localmente

```bash
# Build
npm run build

# Rodar em produção
NODE_ENV=production node dist/index.js
```

**Verificar:**
- Servidor inicia sem erros
- Frontend é servido corretamente
- Não há tentativa de importar `vite`

### 3. Deploy no Easypanel

1. Faça commit das mudanças
2. Push para o GitHub
3. O Easypanel deve fazer build automaticamente
4. Verificar logs do deploy

---

## 🔍 Verificação

**Para confirmar que o build está correto:**

```bash
# Verificar se dist/index.js não importa vite
grep -i "vite" dist/index.js
# Não deve retornar nada (ou apenas comentários)

# Verificar estrutura do build
ls -la dist/
# Deve ter: index.js e public/
```

---

## ✅ Checklist

- [x] Separado código que depende de vite do que não depende
- [x] Import dinâmico condicional apenas em dev
- [x] esbuild configurado para excluir vite do bundle
- [x] Funções `serveStatic` e `log` movidas para arquivo separado
- [ ] Testado build localmente
- [ ] Testado produção localmente
- [ ] Deploy no Easypanel funcionando

---

## 🚀 Próximos Passos

1. **Testar build localmente:**
   ```bash
   npm run build
   ```

2. **Verificar se não há erros:**
   ```bash
   node dist/index.js
   ```

3. **Fazer commit e push:**
   ```bash
   git add .
   git commit -m "fix: corrige erro de build em produção - separa vite.ts"
   git push
   ```

4. **Aguardar deploy no Easypanel**

---

**Agora o build de produção não deve mais tentar importar `vite`! 🎉**

