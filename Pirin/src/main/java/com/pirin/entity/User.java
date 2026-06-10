package com.pirin.entity;

import jakarta.persistence.*;

@Entity
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;

    private String passwordHash;

    @Column(columnDefinition = "TEXT")
    private String encryptedDek;

    private String dekSalt;

    private String dekIv;

}