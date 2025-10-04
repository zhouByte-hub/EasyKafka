use jsonwebtoken::encode;
use jsonwebtoken::{decode, Algorithm, DecodingKey, EncodingKey, Header, Validation};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::time::SystemTime;
use std::time::UNIX_EPOCH;

use crate::EasyKafkaResult;

static JWT_SECRET: &str = "EASY_KAFKA_SECRET";

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    // 标准字段，必须是缩写，否则会报错：Error(InvalidToken)
    #[serde(rename = "iss")]
    issuer: String, // 签发人
    #[serde(rename = "sub")]
    subject: String, // 主题
    #[serde(rename = "exp")]
    expiration: usize, // 过期时间
    #[serde(rename = "iat")]
    issued_at: usize, // 签发时间

    pub url: String,
    pub settings: HashMap<String, String>,
}

impl Claims {
    pub fn new(url: &str, username: &str, password: &str) -> Self {
        let now = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_secs() as usize;

        let mut settings = HashMap::new();
        settings.insert("bootstrap.servers".to_string(), url.to_string());
        settings.insert("sasl.mechanism".to_string(), "PLAIN".to_string());
        settings.insert(
            "security.protocol".to_string(),
            "SASL_PLAINTEXT".to_string(),
        );
        settings.insert("sasl.username".to_string(), username.to_string());
        settings.insert("sasl.password".to_string(), password.to_string());

        Self {
            issuer: "EasyKafka".to_string(),
            subject: "EasyKafka Subject".to_string(),
            expiration: now + 60 * 60, // 一个小时后过期
            issued_at: now,
            url: url.to_string(),
            settings: settings,
        }
    }
}

pub fn create_token(url: &str, username: &str, password: &str) -> EasyKafkaResult<String> {
    let claims = Claims::new(url, username, password);
    let token = encode(
        &Header::new(Algorithm::HS256),
        &claims,
        &EncodingKey::from_secret(JWT_SECRET.as_bytes()),
    )?;
    Ok(token)
}

pub fn parse_token(token: &str) -> EasyKafkaResult<Claims> {
    let mut validate = Validation::new(Algorithm::HS256);
    validate.set_issuer(&["EasyKafka"]);

    let token_data = decode::<Claims>(
        token,
        &DecodingKey::from_secret(JWT_SECRET.as_bytes()),
        &validate,
    )?;
    Ok(token_data.claims)
}

#[cfg(test)]
mod test {

    #[test]
    fn create_token_test() {
        let token = super::create_token("localhost:9092", "admin", "admin").unwrap();
        println!("token: {}", token);
    }

    #[test]
    fn parse_token_test() {
        let token = super::create_token("localhost:9092", "admin", "admin").unwrap();
        let claims = super::parse_token(&token).unwrap();
        println!("claims: {:?}", claims);
    }
}
