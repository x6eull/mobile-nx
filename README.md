# mobile-nx

## 开发配置
### 环境需求
1. Node.js v22.x LTS
2. Rust v1.77.2+

开发前端、后端、构建均需要安装`package.json`中的所有依赖：
```sh
npm i --include=dev
```

### 本机开发
在桌面环境上本机调试/运行：
```sh
npm run tauri dev
```

### 安卓开发
需要 **Android Studio 2024.1+**、**Android SDK Platform 24+**、**NDK**，并配置**ANDROID_HOME**、**NDK_HOME**环境变量。Tauri文档：[https://tauri.app/start/prerequisites/#android](https://tauri.app/start/prerequisites/#android)

开启安卓调试：`npm run tauri android dev`  
安卓构建：`npm run tauri android build`  
只构建armv7架构APK：`npm run tauri android build -- --target armv7`