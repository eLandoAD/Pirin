package com.pirin.service;

import org.springframework.stereotype.Service;

@Service
public class CryptoService {

    // qui sotto sono PLACEHOLDER:
    // nella realtà li colleghi a WebCrypto lato frontend
    // oppure implementi AES in Java

    public byte[] unwrapDEK(String encryptedDek, String oldPassword, String salt) {
        // TODO: decrypt DEK using old password-derived key
        return new byte[32];
    }

    public String wrapDEK(byte[] dek, String newPassword, String salt) {
        // TODO: encrypt DEK using new password-derived key
        return "encrypted_dek_base64";
    }
}