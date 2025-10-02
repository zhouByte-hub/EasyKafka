use crate::EasyKafkaResult;

#[tauri::command]
pub fn dashboard_statistics() -> EasyKafkaResult<()> {
    Ok(())
}

