# mobile-nx

## 开发配置
### 环境需求
1. Node.js v22.x LTS
2. Rust v1.77.2+

开发前端/Rust层、构建均需要上述环境，同时需要`package.json`中的所有依赖：
```sh
npm i --include=dev
```
Rust启动时会自动下载Cargo生态的依赖项。


开发/构建时需要正确设置以下环境变量（可写在本地`.env`文件中，vite将自动读取；若新建构建脚本请使用 `import 'dotenv/config'` 读取）：  
1. VITE_BUNDLE_UPDATE_URL 热更新时，指向bundle.json的url。如https://www.example.com/nx/bundle.json


### 本机开发
在桌面环境上本机(Windows/MacOS)调试/运行：
```sh
npm run tauri dev
```

### 安卓开发
需要 **Android Studio 2024.1+**、**Android SDK Platform 24+**、**NDK**、**Java (JDK 21)**，并配置**ANDROID_HOME**、**NDK_HOME**、**JAVA_HOME**环境变量。Tauri文档：[https://tauri.app/start/prerequisites/#android](https://tauri.app/start/prerequisites/#android)  
注：已知JDK 23不兼容，无法编译。

首次进行安卓相关开发时，需安装安卓相关rustc target：`npm run tauri android init`  
开启安卓调试：`npm run tauri android dev`  
构建安卓通用APK：`npm run tauri android build`  
构建armv7架构APK：`npm run tauri android build -- --target armv7`（可选架构: aarch64, armv7, i686, x86_64）

你需要签名apk，其才能正常安装。请联系维护者获取（或生成自己的）jks密钥库文件，放置在项目根目录下（与 `README.md` 同级），然后在`src-tauri/gen/android`目录下，新建`keystore.properties`，内容如下：（注：密钥库和密钥的密码需一致）
```properties
password=your_keystore_password
keyAlias=your_key_alias
storeFile=../../../../name-of-your-keystore.jks
```

### iOS开发
需要XCode 15+。

首次进行iOS相关开发时，需要配置以下依赖：
1. 安装Homebrew
2. 使用Homebrew安装Cocoapods：`brew install cocoapods`
3. 安装相关rustc target：`npm run tauri ios init`

你需要加入 Apple Developer Team 才能构建打包产物。具体操作如下：  
1. 在`Xcode - Settings - Accounts`添加Apple ID。
2. 在Xcode项目管理（即`*.xcodeproj`文件）中的`Signing & Capabilities`选项卡，选择正确的签名证书。

构建前，请确保`src-tauri/tauri.conf.json`中的`version`字段正确。  
构建命令为：`npm run tauri ios build -- --export-method app-store-connect`

你需要拥有`App Store Connect API key`才能自动化发布。具体操作如下：
1. 前往 [Apple Store Connect](https://appstoreconnect.apple.com/) ，登录后打开**用户与访问**页面。
2. 打开**集成**选项卡。在**团队密钥**项目下新建你的API key，**访问**（即权限）设为**开发者**。
3. 保存以下信息（环境变量应添加至 `./.env` 文件中）：
   - Issuer ID，对应环境变量 `APPLE_API_ISSUER`
   - 密钥 ID，对应环境变量 `APPLE_API_KEY_ID`
   - 密钥文件（每个密钥生成后只能下载一次）
4. 将密钥文件移动到以下文件夹之一（保持其文件名为`AuthKey_${APPLE_API_KEY_ID}.p8`）：
   - ~/private_keys
   - ~/.private_keys
   - ~/.applestoreconnect/private_keys

执行`./build_ios.sh`，进行打包+上传构建版本。
