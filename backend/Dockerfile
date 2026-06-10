FROM node:20-alpine AS builder

WORKDIR /app

# Встановлюємо pnpm
RUN npm install -g pnpm

# Копіюємо файли залежностей та встановлюємо їх
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

# Копіюємо вихідний код
COPY . .

# Генеруємо Prisma клієнт та білдимо проєкт
RUN pnpm prisma generate
RUN pnpm build

# Фінальний етап для запуску
FROM node:20-alpine

WORKDIR /app

# Копіюємо необхідні файли з builder
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Порт, який слухає бекенд
EXPOSE 3001

CMD ["node", "dist/main"]
