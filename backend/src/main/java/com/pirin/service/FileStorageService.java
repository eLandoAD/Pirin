package com.pirin.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileStorageService {

    @Value("${storage.path:uploads}")
    private String storagePath;

    public String saveFile(byte[] data, String filename) throws IOException {
        Path dir = Paths.get(storagePath);
        if (!Files.exists(dir)) {
            Files.createDirectories(dir);
        }
        String uniqueName = UUID.randomUUID() + "_" + filename;
        Path destination = dir.resolve(uniqueName);
        Files.write(destination, data);
        return destination.toString();
    }

    public byte[] loadFile(String path) throws IOException {
        return Files.readAllBytes(Paths.get(path));
    }

    public void delete(String path) {
        try {
            Files.deleteIfExists(Paths.get(path));
        } catch (IOException e) {
            System.err.println("Errore eliminazione file: " + e.getMessage());
        }
    }
}
