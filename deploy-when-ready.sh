#!/bin/bash

echo "🚀 NEXUS DEPLOYMENT SCRIPT"
echo "=========================="

# Verificar se AWS está configurada
echo "1. Verificando credenciais AWS..."
aws sts get-caller-identity

if [ $? -eq 0 ]; then
    echo "✅ AWS configurada com sucesso!"
    
    echo "2. Configurando Amplify..."
    npx ampx configure profile
    
    echo "3. Iniciando sandbox..."
    npx ampx sandbox
    
    echo "4. Aguardando deploy completo..."
    echo "⏳ Isso pode levar alguns minutos..."
    
    echo "5. Deploy concluído!"
    echo "🎉 Gabinete pronto para uso!"
    echo "📧 Admins: geandersonleo@gmail.com, geanderson@nexustreinamento.com"
    
else
    echo "❌ AWS ainda não configurada"
    echo "Aguarde liberação da conta AWS"
fi