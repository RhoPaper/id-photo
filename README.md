# 证件照制作工具

## 本地开发调试指南

### 前置要求
- Node.js 18+
- pnpm 8+

### 安装依赖
```bash
pnpm install
```

### 启动开发服务器
```bash
pnpm dev
```
开发服务器将在 [http://localhost:3000](http://localhost:3000) 启动

### 环境变量配置
创建 `.env.local` 文件并添加以下内容：
```
VITE_API_KEY=5epg3RbL5BPu9EAfSqMwzL9Q
VITE_API_TOKEN=48691dff-7123-4eec-acf8-80e11648dec7
```

### 调试技巧
1. 组件调试：
   - 使用React DevTools检查组件状态
   - 在关键组件中添加console.log调试

2. API调试：
   - 检查网络请求是否正确发送
   - 验证API响应数据

3. 错误处理：
   - 查看浏览器控制台错误
   - 检查网络请求状态码

### 常见问题解决
1. 依赖安装失败：
   - 删除node_modules和pnpm-lock.yaml后重新安装

2. API调用失败：
   - 检查API密钥是否正确
   - 验证网络连接

3. 跨域问题：
   - 确保API支持CORS
   - 开发服务器已配置代理

### 生产构建
```bash
pnpm build
```
构建结果将输出到dist目录
