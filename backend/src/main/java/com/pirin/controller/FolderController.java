package com.pirin.controller;

import com.pirin.entity.FolderRecord;
import com.pirin.entity.User;
import com.pirin.repository.FileRepository;
import com.pirin.repository.FolderRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/folders")
public class FolderController {

    private final FolderRepository repository;
    private final FileRepository fileRepository;

    public FolderController(FolderRepository repository, FileRepository fileRepository) {
        this.repository = repository;
        this.fileRepository = fileRepository;
    }

    @GetMapping
    public ResponseEntity<List<FolderRecord>> list(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(repository.findAllByUserId(user.getId()));
    }

    @PostMapping
    public ResponseEntity<FolderRecord> create(
            @RequestBody Map<String, Object> body,
            Authentication authentication) {

        User user   = (User) authentication.getPrincipal();
        String name = (String) body.get("name");
        Long parentId = body.get("parentId") != null
                ? Long.valueOf(body.get("parentId").toString())
                : null;

        FolderRecord folder = new FolderRecord(name, parentId, user.getId());
        return ResponseEntity.ok(repository.save(folder));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FolderRecord> rename(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            Authentication authentication) {

        User user = (User) authentication.getPrincipal();
        FolderRecord folder = repository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new RuntimeException("Cartella non trovata."));
        folder.setName(body.get("name"));
        return ResponseEntity.ok(repository.save(folder));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id,
            Authentication authentication) {

        User user = (User) authentication.getPrincipal();
        repository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new RuntimeException("Cartella non trovata."));

        deleteCascade(id, user.getId());
        return ResponseEntity.noContent().build();
    }

    /**
     * Cancella ricorsivamente la cartella, tutte le sottocartelle
     * e tutti i file contenuti in ciascuna.
     */
    private void deleteCascade(Long folderId, Long userId) {
        fileRepository.deleteAllByFolderIdAndUserId(folderId, userId);

        List<FolderRecord> children = repository.findAllByParentIdAndUserId(folderId, userId);
        for (FolderRecord child : children) {
            deleteCascade(child.getId(), userId);
        }

        repository.deleteById(folderId);
    }
}
