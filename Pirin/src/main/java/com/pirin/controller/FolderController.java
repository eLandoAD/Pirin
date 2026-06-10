package com.pirin.controller;

import com.pirin.entity.FolderRecord;
import com.pirin.repository.FolderRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/folders")
public class FolderController {
    private final FolderRepository repository;

    public FolderController(FolderRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public ResponseEntity<List<FolderRecord>> list() {
        return ResponseEntity.ok(repository.findAll());
    }

    @PostMapping
    public ResponseEntity<FolderRecord> create(@RequestBody Map<String, Object> body) {
        String name = (String) body.get("name");
        Long parentId = body.get("parentId") != null
                ? Long.valueOf(body.get("parentId").toString())
                : null;

        FolderRecord folder = new FolderRecord(name, parentId);
        return ResponseEntity.ok(repository.save(folder));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FolderRecord> rename(
        @PathVariable Long id,
        @RequestBody Map<String, String> body) {
            FolderRecord folder = repository.findById(id).orElseThrow();
            folder.setName(body.get("name"));
            return ResponseEntity.ok(repository.save(folder));
        }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}