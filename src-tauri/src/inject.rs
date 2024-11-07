use serde::Serialize;
use serialize_to_javascript::{Options, Serialized};
use std::sync::Mutex;
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

/// 注入脚本的运行时元数据。
#[derive(Debug, Serialize)]
pub struct InjectMeta {
    pub url: String,
    pub event: String,
    pub base_url: String,
}
impl InjectMeta {
    /// 从 [`PageLoadPayload`] 创建一个新的 [`InjectMeta`]。
    pub fn new<R: Runtime>(webview: &Webview<R>, payload: &PageLoadPayload) -> Self {
        Self {
            base_url: "http://localhost:5024".to_string(),
            url: payload.url().to_string(),
            event: match payload.event() {
                PageLoadEvent::Started { .. } => "PageLoadEvent::Started",
                PageLoadEvent::Finished { .. } => "PageLoadEvent::Finished",
            }
            .to_string(),
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
        .manage(InjectScript::new(default_script))
        .on_page_load(|webview, payload| {
            let meta = InjectMeta::new(webview, payload);
            let meta_raw_value =
                serde_json::value::to_raw_value(&meta).expect("failed to serialize InjectMeta");
            let meta_json_obj = Serialized::new(&meta_raw_value, &Options::default()).into_string();
            let script = webview.state::<InjectScript>().0.lock().unwrap().replacen(
                "__nxInject_meta_json__",
                &meta_json_obj,
                1,
            );
            let _ = webview.eval(&script); // ignore errors
        })
}
