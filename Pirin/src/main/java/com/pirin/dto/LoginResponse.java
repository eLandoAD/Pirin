package com.pirin.dto;

public record LoginResponse(
        String token,
        String username,
        String email
) {}