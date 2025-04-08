# mobile-nx

## 开发指南

### 环境配置
需要Node.js v22+。

安装npm依赖（仅需正确运行一次）：
```sh
npm i
```
请在vscode中安装`Prettier - Code formatter`、`ESLint`扩展。

### 调试
使用`npm run dev`启动vite热重载服务器。

## 编译和部署
### 环境变量
编译前，需要在根目录下`.env.local`文件中正确设置以下环境变量：
1. `VITE_VERSION_CHECK_URL` 指向版本检查`latest.json`地址，如`https://example.com/latest.json`。
2. `DEPLOY_BASE` 版本信息部署根路径。如`https://example.com/`。
