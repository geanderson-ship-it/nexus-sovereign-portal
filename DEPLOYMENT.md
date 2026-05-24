# 🚀 NEXUS DEPLOYMENT GUIDE

## Status Atual
- ❌ **AWS Account**: Suspended (CNPJ verification pending)
- ✅ **Frontend**: 100% Ready
- ✅ **Backend Config**: 100% Ready
- ✅ **Admin Protection**: Configured
- ✅ **Gabinete**: Ready to deploy

## Quando AWS for Liberada

### 1. Configurar AWS CLI
```bash
aws configure
# Inserir Access Key ID
# Inserir Secret Access Key
# Region: us-east-1
```

### 2. Deploy Amplify Backend
```bash
cd nexus-sovereign-portal
npx ampx configure profile
npx ampx sandbox
```

### 3. Verificar Deploy
- Aguardar criação dos recursos (5-10 min)
- Verificar se `amplify_outputs.json` foi atualizado
- Testar login no frontend

### 4. Criar Usuários Admin
No AWS Cognito Console:
1. Acessar User Pool
2. Criar usuários:
   - `geandersonleo@gmail.com`
   - `geanderson@nexustreinamento.com`
3. Definir senhas temporárias

### 5. Testar Gabinete
1. Login com email admin
2. Acessar `/gabinete`
3. Verificar acesso liberado

## Recursos AWS que serão criados:
- **Cognito User Pool** (Autenticação)
- **AppSync GraphQL API** (Dados)
- **S3 Bucket** (Storage)
- **DynamoDB Tables** (Database)
- **IAM Roles** (Permissões)

## Estimativa de Custo:
- **Desenvolvimento**: ~$5-10/mês
- **Produção**: ~$20-50/mês (dependendo do uso)

## Contatos de Emergência:
- **AWS Support**: Caso aberto (CNPJ verification)
- **Backup Plan**: AWS Multi-Region (se necessário)