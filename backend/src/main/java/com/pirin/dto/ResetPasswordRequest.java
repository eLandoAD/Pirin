package com.pirin.dto;

public record ResetPasswordRequest(String token, String newPassword) {}
