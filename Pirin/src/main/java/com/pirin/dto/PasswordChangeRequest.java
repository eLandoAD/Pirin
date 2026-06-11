package com.pirin.dto;

public class PasswordChangeRequest {

    private String oldPassword;
    private String newPassword;
    private String newEncryptedDek; 
    private String newDekIv;        

    public String getOldPassword() { return oldPassword; }
    public void setOldPassword(String oldPassword) { this.oldPassword = oldPassword; }

    public String getNewPassword() { return newPassword; }
    public void setNewPassword(String newPassword) { this.newPassword = newPassword; }

    public String getNewEncryptedDek() { return newEncryptedDek; }
    public void setNewEncryptedDek(String newEncryptedDek) { this.newEncryptedDek = newEncryptedDek; }

    public String getNewDekIv() { return newDekIv; }
    public void setNewDekIv(String newDekIv) { this.newDekIv = newDekIv; }
}