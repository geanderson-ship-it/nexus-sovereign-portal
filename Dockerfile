FROM node:20-alpine AS base

# 1. Instala dependências (apenas as necessárias)
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# 2. Recompila o código fonte
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Desabilita telemetria do Next.js
ENV NEXT_TELEMETRY_DISABLED 1

# Gera o build
RUN npm run build

# 3. Imagem de Produção (Runner)
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copia arquivos públicos
COPY --from=builder /app/public ./public

# --- A CORREÇÃO ESTÁ AQUI EMBAIXO ---
# Configura permissões (Adicionado o RUN antes do mkdir)
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copia apenas o necessário do build standalone
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
