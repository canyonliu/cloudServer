# B方案：用于封装预构建产物的Dockerfile
# 假设所有需要的文件都已存在于上下文中
FROM node:18-slim AS runner
WORKDIR /app

ENV NODE_ENV=production

# 复制我们从CI服务器传输过来的预构建产物
COPY public ./public
COPY .next/standalone ./
COPY .next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]