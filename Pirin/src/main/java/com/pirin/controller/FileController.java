package com.pirin.controller;

import com.pirin.service.FileStorageService;
import com.pirin.entity.FileRecord;
import com.pirin.entity.User;
import com.pirin.repository.FileRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class FileController {

    private final FileStorageService storageService;
    private final FileRepository repository;

    public FileController(FileStorageService storageService, FileRepository repository) {
        this.storageService = storageService;
        this.repository = repository;
    }

    @PostMapping("/upload")
    public ResponseEntity<?> upload(
            @RequestParam MultipartFile file,
            @RequestParam String salt,
            @RequestParam String iv,
            Authentication authentication
    ) throws IOException {

        User user = (User) authentication.getPrincipal();

        byte[] data = file.getBytes();

        String path = storageService.saveFile(data, file.getOriginalFilename() + ".enc");

        FileRecord record = new FileRecord(
                file.getOriginalFilename(),
                path,
                salt,
                iv,
                user
        );

        repository.save(record);

        return ResponseEntity.ok(Map.of(
                "id", record.getId(),
                "filename", record.getFilename()
        ));
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<byte[]> download(
            @PathVariable Long id,
            Authentication authentication
    ) throws IOException {

        User user = (User) authentication.getPrincipal();

        FileRecord file = repository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new RuntimeException("File non trovato."));

        byte[] data = storageService.loadFile(file.getStoragePath());

        return ResponseEntity.ok(data);
    }

    @GetMapping("/files")
    public ResponseEntity<List<FileRecord>> listFiles(Authentication authentication) {
        User user = (User) authentication.getPrincipal();

        return ResponseEntity.ok(repository.findAllByUserId(user.getId()));
    }
}