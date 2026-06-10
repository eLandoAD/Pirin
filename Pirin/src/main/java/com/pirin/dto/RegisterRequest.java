package com.pirin.dto;

public record RegisterRequest(
        String username,
        String email,
        String password,
        String encryptedDek,
        String dekSalt,
        String dekIv
) {}