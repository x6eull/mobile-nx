// 请在lib.rs等文件(而非main.rs)添加实际代码

// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    mobile_nx_lib::run()
}
