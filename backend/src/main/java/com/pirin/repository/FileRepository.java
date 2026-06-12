package com.pirin.repository;

import com.pirin.entity.FileRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface FileRepository extends JpaRepository<FileRecord, Long> {

    @Query("SELECT f FROM FileRecord f WHERE f.id = :id AND f.user.id = :userId")
    Optional<FileRecord> findByIdAndUserId(Long id, Long userId);

    @Query("SELECT f FROM FileRecord f WHERE f.user.id = :userId")
    List<FileRecord> findAllByUserId(Long userId);

    @Modifying
    @Transactional
    @Query("DELETE FROM FileRecord f WHERE f.folderId = :folderId AND f.user.id = :userId")
    void deleteAllByFolderIdAndUserId(Long folderId, Long userId);
}
