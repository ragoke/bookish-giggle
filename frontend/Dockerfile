FROM node:20-alpine AS builder

WORKDIR /app

# Встановлюємо pnpm
RUN npm install -g pnpm

# Копіюємо файли залежностей та встановлюємо їх
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

# Копіюємо вихідний код
COPY . .

# Білдимо проєкт
RUN pnpm build

# Фінальний етап з Nginx для роздачі статики
FROM nginx:alpine

# Копіюємо конфігурацію Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Копіюємо зібрані файли React у папку Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Порт 80 для Nginx
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
