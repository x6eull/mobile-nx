mod inject;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

// Currently unused in frontend
#[tauri::command]
fn exit_app(exit_code: i32, app_handle: tauri::AppHandle) {
    app_handle.exit(exit_code);
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    inject::setup_inject(
        tauri::Builder::default()
            .plugin(tauri_plugin_os::init())
            .plugin(tauri_plugin_fs::init())
            .plugin(tauri_plugin_http::init()),
        include_str!("../../src/inject.js").to_string(),
    )
    .invoke_handler(tauri::generate_handler![
        exit_app,
        inject::set_inject_script,
        inject::get_base_url
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
