# 生产环境运行器 Dockerfile
# 假设所有构建产物都已存在于 Docker 构建上下文中

FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# 复制 Next.js standalone 应用产物
COPY .next/standalone ./
COPY .next/static ./.next/static

# 复制 public 目录
COPY public ./public

# 复制 Prisma schema，这对于在生产环境中运行迁移是必需的
COPY prisma ./prisma

EXPOSE 3000

# 启动应用
CMD ["node", "server.js"]