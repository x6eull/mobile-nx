// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn get_capa_version() -> &'static str {
    env!("CARGO_PKG_VERSION")
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![get_capa_version])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
