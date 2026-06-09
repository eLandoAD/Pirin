package com.pirin.controller;

import com.pirin.entity.FileRecord;
import com.pirin.repository.FileRepository;
import com.pirin.service.FileStorageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;

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

        return ResponseEntity.ok("uploaded");
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<byte[]> download(@PathVariable Long id) throws IOException {

        FileRecord file = repository.findById(id).orElseThrow();

        byte[] data = storageService.loadFile(file.getPath());

        return ResponseEntity.ok(data);
    }
}