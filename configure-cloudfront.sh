#!/bin/bash

# Script para configurar CloudFront para SPA
# Execute: chmod +x configure-cloudfront.sh && ./configure-cloudfront.sh

DISTRIBUTION_ID="YOUR_CLOUDFRONT_DISTRIBUTION_ID"

echo "Configurando CloudFront Distribution: $DISTRIBUTION_ID"

# Obter configuração atual
aws cloudfront get-distribution-config --id $DISTRIBUTION_ID > current-config.json

# Atualizar configuração (você precisa editar o JSON manualmente)
echo "Adicione estas configurações de error pages:"
echo ""
echo "Error Pages:"
echo "403 -> /index.html (200)"
echo "404 -> /index.html (200)"
echo ""
echo "Default Root Object: index.html"
echo ""
echo "Behavior Settings:"
echo "- Viewer Protocol Policy: Redirect HTTP to HTTPS"
echo "- Allowed HTTP Methods: GET, HEAD, OPTIONS, PUT, POST, PATCH, DELETE"
echo "- Cache Policy: CachingDisabled (for dynamic content)"
