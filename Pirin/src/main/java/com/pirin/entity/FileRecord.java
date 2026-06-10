package com.pirin.entity;

import jakarta.persistence.*;

@Entity
public class FileRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String filename;
    private String storagePath;
    private String salt;
    private String iv;
    private Long ownerId;
    private Long folderId;

    public FileRecord() {}

    public FileRecord(String filename, String storagePath, String salt, String iv) {
        this.filename = filename;
        this.storagePath = storagePath;
        this.salt = salt;
        this.iv = iv;
    }

    public Long getId() { return id; }

    public String getFilename() { return filename; }
    public void setFilename(String filename) { this.filename = filename; }

    public String getStoragePath() { return storagePath; }
    public void setStoragePath(String storagePath) { this.storagePath = storagePath; }

    public String getSalt() { return salt; }
    public void setSalt(String salt) { this.salt = salt; }

    public String getIv() { return iv; }
    public void setIv(String iv) { this.iv = iv; }

    public Long getOwnerId() { return ownerId; }
    public void setOwnerId(Long ownerId) { this.ownerId = ownerId; }

    public Long getFolderId() { return folderId; }
    public void setFolderId(Long folderId) { this.folderId = folderId; }
}