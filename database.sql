CREATE DATABASE IF NOT EXISTS secure_files;
USE secure_files;

CREATE TABLE IF NOT EXISTS users (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    username      VARCHAR(100)  NOT NULL UNIQUE,
    email         VARCHAR(255)  NOT NULL UNIQUE,
    password_hash VARCHAR(255)  NOT NULL,
    enabled       BOOLEAN       NOT NULL DEFAULT FALSE,
    encrypted_dek TEXT,
    dek_salt      VARCHAR(255),
    dek_iv        VARCHAR(255),
    created_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS email_verification_token (
    id         BIGINT        AUTO_INCREMENT PRIMARY KEY,
    token      VARCHAR(255)  NOT NULL UNIQUE,
    user_id    BIGINT        NOT NULL,
    expires_at TIMESTAMP     NOT NULL,
    used_at    TIMESTAMP,
    created_at TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS password_reset_token (
    id         BIGINT        AUTO_INCREMENT PRIMARY KEY,
    token      VARCHAR(255)  NOT NULL UNIQUE,
    user_id    BIGINT        NOT NULL,
    expires_at TIMESTAMP     NOT NULL,
    used_at    TIMESTAMP,
    created_at TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS folder_record (
    id        BIGINT        AUTO_INCREMENT PRIMARY KEY,
    name      VARCHAR(255)  NOT NULL,
    parent_id BIGINT,
    user_id   BIGINT        NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS file_record (
    id           BIGINT        AUTO_INCREMENT PRIMARY KEY,
    filename     VARCHAR(255)  NOT NULL,
    storage_path VARCHAR(500)  NOT NULL,
    salt         TEXT,
    iv           TEXT          NOT NULL,
    folder_id    BIGINT,
    user_id      BIGINT        NOT NULL,
    FOREIGN KEY (user_id)   REFERENCES users(id)         ON DELETE CASCADE,
    FOREIGN KEY (folder_id) REFERENCES folder_record(id) ON DELETE SET NULL
);