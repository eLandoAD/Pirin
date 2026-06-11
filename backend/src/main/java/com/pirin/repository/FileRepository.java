package com.pirin.repository;

import com.pirin.entity.FileRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FileRepository extends JpaRepository<FileRecord, Long> {

    Optional<FileRecord> findByIdAndUserId(Long id, Long userId);

    List<FileRecord> findAllByUserId(Long userId);
}
