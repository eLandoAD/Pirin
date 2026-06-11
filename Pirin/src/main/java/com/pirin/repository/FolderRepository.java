package com.pirin.repository;

import com.pirin.entity.FolderRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FolderRepository extends JpaRepository<FolderRecord, Long> {

    List<FolderRecord> findAllByUserId(Long userId);

    Optional<FolderRecord> findByIdAndUserId(Long id, Long userId);
}