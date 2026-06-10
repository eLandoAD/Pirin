package com.pirin.entity;

import jakarta.persistence.*;

@Entity
public class FolderRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private Long parentId;

    public FolderRecord() {}

    public FolderRecord(String name, Long parentId) {
        this.name = name;
        this.parentId = parentId;
    }

    public Long getId() {
        return id;      // era "retunr"
    }

    public String getName() {
        return name;
    }

    public Long getParentId() {
        return parentId;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setParentId(Long parentId) {
        this.parentId = parentId;
    }
}