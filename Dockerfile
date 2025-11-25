# ------------------------------
# Etapa 1 — Build da aplicação
# ------------------------------
FROM node:18 AS builder
WORKDIR /app

# Copia apenas o que é necessário para instalar dependências
COPY package*.json ./

# Instala dependências
RUN npm install

# Copia o restante do código
COPY . .

# Faz o build: TypeScript + Vite
RUN npm run build

# ------------------------------
# Etapa 2 — Servindo arquivos estáticos com Nginx
# ------------------------------
FROM nginx:stable-alpine

# Remove configuração default
RUN rm -rf /usr/share/nginx/html/*

# Copia o build do Vite para a pasta pública do Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copia uma configuração personalizada do Nginx (SPA)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
