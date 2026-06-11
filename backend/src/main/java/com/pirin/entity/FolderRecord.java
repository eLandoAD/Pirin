package com.pirin.entity;

import jakarta.persistence.*;

@Entity
public class FolderRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private Long parentId;

    @Column(name = "user_id", nullable = false)
    private Long userId; 
    public FolderRecord() {}

    public FolderRecord(String name, Long parentId, Long userId) {
        this.name     = name;
        this.parentId = parentId;
        this.userId   = userId;
    }

    public Long getId()                    { return id; }
    public String getName()                { return name; }
    public void setName(String name)       { this.name = name; }
    public Long getParentId()              { return parentId; }
    public void setParentId(Long parentId) { this.parentId = parentId; }
    public Long getUserId()                { return userId; }
    public void setUserId(Long userId)     { this.userId = userId; }
}