# --- 阶段 1: 构建器 (Builder) ---
FROM node:18-alpine AS builder

# 设置工作目录
WORKDIR /app

# 声明一个构建参数，以便从 docker build 命令接收 DATABASE_URL
ARG DATABASE_URL

# 将构建参数设置为一个环境变量，以便后续的 RUN 命令可以使用
ENV DATABASE_URL=${DATABASE_URL}

# 复制 package.json 和 lock 文件
COPY package.json package-lock.json ./

# 安装所有依赖 (包括 devDependencies，因为需要 prisma CLI)
RUN npm ci

# 复制项目剩余的源代码
COPY . .

# 关键修正：确保 public 目录存在，以防源项目中没有此目录
RUN mkdir -p public

# 明确指定 Prisma 二进制文件目标
# 这一步确保在构建时，与最终运行环境匹配的引擎被生成
RUN npx prisma generate --schema=./prisma/schema.prisma

# 构建 Next.js 应用
RUN npm run build

# --- 阶段 2: 运行器 (Runner) ---
FROM node:18-alpine AS runner

WORKDIR /app

# 从 builder 阶段复制 package.json 和 .next 目录
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

# 从 builder 阶段复制生产环境所需的 node_modules
# 这是一个优化，避免将 devDependencies 打包到最终镜像
RUN npm install --omit=dev

EXPOSE 3000

# 最终的 CMD 使用 .next/server.js，这是 Next.js 14+ 的推荐做法
CMD ["node", ".next/server.js"]
