package com.pirin.controller;

import com.pirin.entity.FileRecord;
import com.pirin.repository.FileRepository;
import com.pirin.service.FileStorageService;
import com.pirin.dto.PasswordChangeRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
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
            @RequestParam String iv
    ) throws IOException {
        byte[] data = file.getBytes();
        String path = storageService.saveFile(data, file.getOriginalFilename() + ".enc");

        FileRecord record = new FileRecord(
                file.getOriginalFilename(),
                path,
                salt,
                iv
        );
        repository.save(record);
        return ResponseEntity.ok(Map.of("id", record.getId(), "filename", record.getFilename()));
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<byte[]> download(@PathVariable Long id) throws IOException {
        FileRecord file = repository.findById(id).orElseThrow();
        byte[] data = storageService.loadFile(file.getStoragePath());
        return ResponseEntity.ok(data);
    }

    @DeleteMapping("/files/{id}")
    public ResponseEntity<?> deleteFile(@PathVariable Long id) {
        FileRecord file = repository.findById(id).orElseThrow();
        repository.delete(file);
        storageService.delete(file.getStoragePath());
        return ResponseEntity.ok().build();
    }

    @PutMapping("/files/{id}/rename")
    public ResponseEntity<?> renameFile(
            @PathVariable Long id,
            @RequestBody Map<String, String> body
    ) {
        FileRecord file = repository.findById(id).orElseThrow();
        file.setFilename(body.get("filename"));
        repository.save(file);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/files/{id}/move")
    public ResponseEntity<?> moveFile(
            @PathVariable Long id,
            @RequestBody Map<String, String> body
    ) {
        FileRecord file = repository.findById(id).orElseThrow();
        file.setFolderId(Long.parseLong(body.get("folderId")));
        repository.save(file);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/files/{id}")
    public ResponseEntity<FileRecord> getFile(@PathVariable Long id) {
        return ResponseEntity.ok(repository.findById(id).orElseThrow());
    }

    @PostMapping("/files/{id}/change-password")
    public ResponseEntity<?> changePassword(
            @PathVariable Long id,
            @RequestBody PasswordChangeRequest body
    ) {
        FileRecord file = repository.findById(id).orElseThrow();
        file.setEncryptedDek(file.getEncryptedDek());
        repository.save(file);
        return ResponseEntity.ok("password updated");
    }

    @GetMapping("/files")
    public ResponseEntity<List<FileRecord>> listFiles() {
        return ResponseEntity.ok(repository.findAll());
    }
}