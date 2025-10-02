use crate::kafka_error::EasyKafkaError;

pub(crate) mod handles;
pub(crate) mod infra;
pub(crate) mod kafka_error;
pub(crate) mod mcp;
pub(crate) mod utils;

pub type EasyKafkaResult<T> = Result<T, EasyKafkaError>;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_http::init())
        .invoke_handler(tauri::generate_handler![
            handles::dashboard::dashboard_statistics
            ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

// #[derive(Debug)]
// #[allow(dead_code)]
// struct TauriCommand {
//     file_path: String,
//     function_name: String,
// }

// impl TauriCommand {
//     pub fn new(file_path: String, function_name: String) -> Self {
//         Self {
//             file_path,
//             function_name,
//         }
//     }
// }

// fn generate_hander() -> impl Fn(tauri::ipc::Invoke<tauri::Wry>) -> bool + Send + Sync + 'static {
//     let project_path = std::env::current_dir().unwrap_or_default().join("src");
//     let _tauri_commands = tokio::runtime::Runtime::new()
//         .unwrap()
//         .block_on(scan_tauri_commands(&project_path))
//         .unwrap_or_default();

//      tauri::generate_handler![handles::dashboard::dashboard_statistics]
// }

// async fn scan_tauri_commands(path: &PathBuf) -> EasyKafkaResult<Vec<TauriCommand>> {
//     let mut tauri_commands = Vec::new();
//     for entry in WalkDir::new(path)
//         .into_iter()
//         .filter_map(|f| Result::ok(f))
//         .filter(|f| {
//             f.file_type().is_file() && f.path().extension().map_or(false, |ext| ext == "rs")
//         })
//     {
//         let path = entry.path();
//         let content = tokio::fs::read_to_string(&path).await?;
//         // 在syn 2.0中，使用parse_str::<syn::File>来解析整个文件
//         if let Ok(file) = syn::parse_str::<syn::File>(&content) {
//             for ele in file.items {
//                 if let Item::Fn(fn_item) = ele {
//                     if !function_has_tauri_command_attribute(&fn_item.attrs) {
//                         continue;
//                     }
//                     let command = TauriCommand::new(
//                         path.display().to_string(),
//                         fn_item.sig.ident.to_string(),
//                     );
//                     tauri_commands.push(command);
//                 }
//             }
//         } else {
//             return Err(EasyKafkaError::SyntaxError(syn::Error::new_spanned(
//                 content.to_token_stream(),
//                 "Not a valid Rust file",
//             )));
//         }
//     }
//     Ok(tauri_commands)
// }

// fn function_has_tauri_command_attribute(attr: &[Attribute]) -> bool {
//     let exp1 = attr.iter().any(|item| {
//         // 处理 `#[tauri::command]` 或 `#[tauri::command(rename_to = "...")]` 等
//         if let Some(path) = item.path().get_ident() {
//             return path == "tauri";
//         }
//         // 检查是否是 `#[tauri::command]`
//         match item.path().segments.last() {
//             Some(segment) if segment.ident == "command" => {
//                 if let Some(parent) = item
//                     .path()
//                     .segments
//                     .iter()
//                     .nth(item.path().segments.len() - 2)
//                 {
//                     return parent.ident == "tauri";
//                 }
//             }
//             _ => {}
//         }
//         false
//     });
//     let exp2 = attr.iter().any(|item| {
//         let path_str = item.path().to_token_stream().to_string();
//         path_str == "tauri :: command" || path_str.starts_with("tauri :: command ")
//     });
//     exp1 || exp2
// }


// #[cfg(test)]
// mod test{
//     use crate::{scan_tauri_commands, EasyKafkaResult};

//     #[tokio::test]
//     async fn test_1() -> EasyKafkaResult<()>{
//         let project_path = std::env::current_dir().unwrap_or_default().join("src");
//         let list = scan_tauri_commands(&project_path).await?;
//         list.iter().for_each(|item| {
//             println!("{:?}", item);
//         });
//         Ok(())
//     }
// }