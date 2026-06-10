CREATE DATABASE secure_files;

USE secure_files;

CREATE TABLE file_record (

    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    storage_path VARCHAR(500) NOT NULL,
    salt TEXT NOT NULL,
    iv TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users(

 id BIGINT AUTO_INCREMENT PRIMARY KEY,
 email VARCHAR(255) UNIQUE,
 password_hash VARCHAR(255),
 encrypted_dek TEXT,
 dek_salt TEXT,
 dek_iv TEXT
);