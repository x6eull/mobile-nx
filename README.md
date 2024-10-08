# mobile-nx

## 开发配置
### 环境需求
1. Node.js v22.x LTS
2. Rust v1.77.2+

开发前端、后端、构建均需要安装`package.json`中的所有依赖：
```sh
npm i --include=dev
```


开发/构建时需要正确设置以下环境变量（可写在本地.env文件中，vite将自动读取；若新建构建脚本请使用 `import 'dotenv/config'` 读取）：  
1. VITE_BUNDLE_UPDATE_URL 热更新时，指向bundle.json的url。如https://www.example.com/nx/bundle.json


### 本机开发
在桌面环境上本机调试/运行：
```sh
npm run tauri dev
```

### 安卓开发
需要 **Android Studio 2024.1+**、**Android SDK Platform 24+**、**NDK**，并配置**ANDROID_HOME**、**NDK_HOME**环境变量。Tauri文档：[https://tauri.app/start/prerequisites/#android](https://tauri.app/start/prerequisites/#android)

开启安卓调试：`npm run tauri android dev`  
构建安卓通用APK：`npm run tauri android build`  
构建armv7架构APK：`npm run tauri android build -- --target armv7`（可选架构: aarch64, armv7, i686, x86_64）

你需要签名apk，其才能正常安装。请联系维护者获取（或生成自己的）jks密钥库文件，放置在项目根目录下（与 `README.md` 同级），然后在`src-tauri/gen/android`目录下，新建`keystore.properties`，内容如下：（注：密钥库和密钥的密码需一致）
```properties
password=your_keystore_password
keyAlias=your_key_alias
storeFile=../../../../name-of-your-keystore.jks
```