use serde::Serialize;
use serialize_to_javascript::{Options, Serialized};
use std::sync::{Mutex, OnceLock};
use tauri::{
    webview::{PageLoadEvent, PageLoadPayload},
    Manager, Runtime, Webview,
};

/// 存储注入脚本的结构。
#[derive(Debug)]
pub struct InjectScript(pub(crate) Mutex<String>);
impl InjectScript {
    /// 从 `script` 创建一个新的 [`InjectScript`]。
    pub(crate) fn new(script: String) -> Self {
        Self(Mutex::new(script))
    }
}

static DEV_BASE_URL: OnceLock<String> = OnceLock::new();
#[allow(unreachable_code)]
#[tauri::command]
pub fn get_base_url() -> String {
    //当windows/macos上运行npm run tauri dev时，返回形如 http://localhost:5024 的devUrl
    #[cfg(all(debug_assertions, any(target_os = "macos", target_os = "windows")))]
    return DEV_BASE_URL.get().unwrap().clone();
    //以下base_url来源：https://github.com/tauri-apps/tauri/discussions/11091
    #[cfg(any(
        target_os = "linux",
        target_os = "dragonfly",
        target_os = "freebsd",
        target_os = "netbsd",
        target_os = "openbsd",
        target_os = "macos",
        target_os = "ios",
    ))]
    return "tauri://localhost".to_string();
    #[cfg(any(target_os = "windows", target_os = "android"))]
    return "http://tauri.localhost".to_string();
}

/// 注入脚本的运行时元数据。
#[derive(Debug, Serialize)]
pub struct InjectMeta<'a> {
    /// 本次加载事件尝试载入的url
    pub url: String,
    /// 加载事件类型（ "PageLoadEvent::Started" 或" PageLoadEvent::Finished" ）
    pub event: &'a str,
    /// tauri应用的初始url（返回首页使用）。保证不以/结尾。
    pub base_url: String,
}
impl InjectMeta<'_> {
    /// 从 [`PageLoadPayload`] 创建一个新的 [`InjectMeta`]。
    pub fn new<R: Runtime>(webview: &Webview<R>, payload: &PageLoadPayload) -> Self {
        let _ = webview; //TODO 添加webview相关注入字段
        Self {
            base_url: get_base_url(),
            url: payload.url().to_string(),
            event: match payload.event() {
                PageLoadEvent::Started => "PageLoadEvent::Started",
                PageLoadEvent::Finished => "PageLoadEvent::Finished",
            },
        }
    }
}

#[tauri::command]
pub(crate) fn set_inject_script<R: Runtime>(new_script: String, app_handle: tauri::AppHandle<R>) {
    *(app_handle.state::<InjectScript>().0.lock().unwrap()) = new_script;
}

/// 在 [`tauri::Builder<R>`] 中添加注入脚本相关功能。包括：  
/// 1. 管理 [`InjectScript`] 状态，并用 `default_script` 初始化。
/// 2. 在页面加载时，将 [`InjectScript`] 中的脚本注入到页面中。
///
/// 注意：不会注册 [`fn@set_inject_script`] 命令（ [`fn@tauri::Builder<R>::invoke_handler<F>`] 只能生效一次）。
pub(crate) fn setup_inject<R: Runtime>(
    app_builder: tauri::Builder<R>,
    default_script: String,
) -> tauri::Builder<R> {
    app_builder
        .setup(|app| {
            let url = app
                .config()
                .build
                .dev_url
                .as_ref()
                .expect("build.devUrl must be set in tauri.conf.json")
                .as_str()
                .trim_end_matches("/")
                .to_string();
            DEV_BASE_URL.set(url).expect("fail to set OnceLock");
            Ok(())
        })
        .manage(InjectScript::new(default_script))
        .on_page_load(|webview, payload| {
            let meta = InjectMeta::new(webview, payload);
            let meta_raw_value =
                serde_json::value::to_raw_value(&meta).expect("failed to serialize InjectMeta");
            let meta_json_obj: String =
                Serialized::new(&meta_raw_value, &Options::default()).into_string();
            let script = webview.state::<InjectScript>().0.lock().unwrap().replacen(
                "__nxInject_meta_json__",
                &meta_json_obj, // JSON.parse("{...}}")
                1,
            );
            let _ = webview.eval(&script); // ignore errors
        })
}
