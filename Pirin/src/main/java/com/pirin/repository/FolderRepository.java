package com.pirin.repository;

import com.pirin.entity.FolderRecord;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FolderRepository extends JpaRepository<FolderRecord, Long> {
}