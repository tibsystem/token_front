## 🧪 TESTE DE DEBUG - FLUXO COMPLETO

Execute estes testes na ordem para identificar o problema:

### 1. 🏠 Teste a página raiz
```
http://localhost:3000/
```
**Esperado:** Deve redirecionar para `/login` 
**Log esperado:** Nenhum log dos ProtectedRoutes

### 2. 🔓 Teste a página de login normal
```
http://localhost:3000/login
```
**Esperado:** Página de login normal carrega
**Log esperado:** Nenhum log dos ProtectedRoutes

### 3. 🔐 Teste a página de login admin
```
http://localhost:3000/admin/login
```
**Esperado:** Página de login admin carrega
**Log esperado:** 
```
🚪 [AdminLogin] Componente AdminLogin carregado
🚪 [AdminLogin] Pathname atual: /admin/login
```

### 4. 🚫 Teste dashboard admin SEM token
```
http://localhost:3000/admin/dashboard
```
**Esperado:** Deve redirecionar para `/admin/login`
**Log esperado:**
```
🔐 [AdminProtectedRoute] Iniciando verificação...
🔐 [AdminProtectedRoute] Tokens encontrados:
  - admin_token: NULL
  - token: NULL
❌ [AdminProtectedRoute] Admin token não encontrado - redirecionando para /admin/login
```

### 5. ✅ Teste dashboard admin COM token
1. Faça login em `/admin/login` primeiro
2. Depois acesse `/admin/dashboard`
**Log esperado:**
```
🔐 [AdminProtectedRoute] Iniciando verificação...
🔐 [AdminProtectedRoute] Tokens encontrados:
  - admin_token: EXISTS
✅ [AdminProtectedRoute] Token válido - usuário autenticado
```

## 🎯 TESTE CRÍTICO PARA PRODUÇÃO

Se você está sendo redirecionado de `/admin/login` para `/login` em **produção**, pode ser:

### A. Problema de infraestrutura (CloudFront)
- `/admin/login` retorna 404/403
- CloudFront redireciona para `/login` via configuração
- **Solução:** Configure error pages no CloudFront

### B. Problema de código (improvável com os logs)
- Algum componente está forçando redirecionamento
- **Como identificar:** Os logs vão mostrar qual componente está fazendo o redirect

## 🔍 COMANDO DE DEBUG RÁPIDO

Execute no console do navegador em produção:
```javascript
// Verificar se a página carregou corretamente
console.log('Página atual:', window.location.href);
console.log('admin_token:', localStorage.getItem('admin_token'));
console.log('token:', localStorage.getItem('token'));
```
