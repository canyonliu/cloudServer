# 使用一个轻量级的 Node.js 官方镜像作为基础
FROM node:18-alpine

# 在容器内创建一个工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json 到工作目录
# 我们分开复制是为了利用Docker的层缓存机制
COPY package*.json ./

# 安装项目依赖
RUN npm install

# 将你项目中的所有文件复制到工作目录
COPY . .

# 暴露容器的3000端口，让外部可以访问
EXPOSE 3000

# 定义容器启动时执行的命令
CMD [ "node", "app.js" ]