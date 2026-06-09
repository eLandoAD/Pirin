package com.pirin.entity;

import jakarta.persistence.*;

@Entity
public class FileRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String filename;

    private String path;

    @Lob
    private String salt;

    @Lob
    private String iv;

    public FileRecord() {}

    public FileRecord(String filename, String path, String salt, String iv) {
        this.filename = filename;
        this.path = path;
        this.salt = salt;
        this.iv = iv;
    }

    public Long getId() { return id; }

    public String getFilename() { return filename; }
    public void setFilename(String filename) { this.filename = filename; }

    public String getPath() { return path; }
    public void setPath(String path) { this.path = path; }

    public String getSalt() { return salt; }
    public void setSalt(String salt) { this.salt = salt; }

    public String getIv() { return iv; }
    public void setIv(String iv) { this.iv = iv; }
}