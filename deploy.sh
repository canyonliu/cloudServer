#!/bin/bash

# 确保脚本在任何命令失败时都会退出
set -e

# 1. 拉取最新的代码
echo "拉取最新代码-Pulling latest code..."
git pull origin main

# 2. 重新构建Docker镜像
# 我们使用 GitHub 的提交哈希作为版本号，保证唯一性
IMAGE_TAG=$(git rev-parse --short HEAD)
echo "Building new image with tag- 打标签: cloud-node:$IMAGE_TAG"
sudo docker build -t cloud-node:$IMAGE_TAG .

# 3. 停止并删除旧的容器（如果存在）
if [ $(sudo docker ps -q -f name=my-running-cloud) ]; then
    echo "Stopping and removing old container..."
    sudo docker stop my-running-cloud
    sudo docker rm my-running-d
fi

# 4. 运行新的容器
echo "Running new container..."
sudo docker run -d -p 80:3000 --name my-running-cloud cloud-node:$IMAGE_TAG

# 5. 清理旧的、未使用的Docker镜像（可选，但推荐）
echo "Cleaning up old images..."
sudo docker image prune -f

echo "完成部署-Deployment finished successfully!"
