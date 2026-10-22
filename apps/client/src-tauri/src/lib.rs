#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // No collector or privileged commands are exposed by the foundation host.
    tauri::Builder::default()
        .run(tauri::generate_context!())
        .expect("failed to run NetScope native host");
}
