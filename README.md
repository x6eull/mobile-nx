# mobile-nx

## 开发指南

### 环境配置
需要Node.js v22+。

安装npm依赖（仅需正确运行一次）：
```sh
npm i
```
请在vscode中安装`Prettier - Code formatter`扩展。

### 调试前端
使用`npm run dev`启动vite热重载服务器。

### 调试后端

1. 配置账号密码env in `./env-test.local`

    ```shell
    NODE_DEBUG_ZJUID=xx
    NODE_DEBUG_PASSWORD=xx
    ```

2. 运行node测试 in `test/node/*`

### 参考资料


- 状态管理 Redux https://redux.js.org/tutorials/quick-start

- 单元测试 node test https://nodejs.org/api/test.html