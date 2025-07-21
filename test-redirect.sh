#!/bin/bash

# Script para testar redirecionamentos de servidor
# Execute: chmod +x test-redirect.sh && ./test-redirect.sh

echo "🔍 TESTANDO REDIRECIONAMENTOS DE SERVIDOR"
echo "=========================================="
echo ""

# Substitua pela sua URL de produção
PROD_URL="https://SEU-DOMINIO.com"

echo "📋 TESTANDO URLs:"
echo "1. Raiz do site"
echo "2. Admin login"
echo "3. Login normal" 
echo "4. Admin dashboard"
echo ""

echo "🌐 TESTE 1: Raiz do site"
echo "curl -I $PROD_URL/"
curl -I "$PROD_URL/" 2>/dev/null | head -10
echo ""

echo "🌐 TESTE 2: Admin Login (O PROBLEMA)"
echo "curl -I $PROD_URL/admin/login/"
curl -I "$PROD_URL/admin/login/" 2>/dev/null | head -10
echo ""

echo "🌐 TESTE 3: Login Normal"
echo "curl -I $PROD_URL/login/"
curl -I "$PROD_URL/login/" 2>/dev/null | head -10
echo ""

echo "🌐 TESTE 4: Admin Dashboard"
echo "curl -I $PROD_URL/admin/dashboard/"
curl -I "$PROD_URL/admin/dashboard/" 2>/dev/null | head -10
echo ""

echo "📝 O QUE PROCURAR:"
echo "- Status Code 200: OK"
echo "- Status Code 301/302: Redirecionamento"
echo "- Status Code 403/404: Arquivo não encontrado"
echo "- Header 'Location': Para onde está redirecionando"
echo ""
echo "🚨 SE VOCÊ VIR:"
echo "- 301/302 com Location: /login -> Problema de servidor"
echo "- 403/404 -> Problema de CloudFront/S3"
echo "- 200 -> Problema é no código React"
