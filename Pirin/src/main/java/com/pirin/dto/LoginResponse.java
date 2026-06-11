package com.pirin.dto;

public record LoginResponse(
        String token,
        String username,
        String email,
        String encryptedDek,  
        String dekSalt,        
        String dekIv          
) {}