package com.pirin.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Paths;

@Service
public class FileStorageService {

    @Value("${file.storage.location}")
    private String storageLocation;

    public String saveFile(byte[] data, String filename) throws IOException {

        File dir = new File(storageLocation);
        if (!dir.exists()) dir.mkdirs();

        File file = new File(dir, filename);

        try (FileOutputStream fos = new FileOutputStream(file)) {
            fos.write(data);
        }

        return file.getAbsolutePath();
    }

    public byte[] loadFile(String path) throws IOException {
        return Files.readAllBytes(Paths.get(path));
    }
}