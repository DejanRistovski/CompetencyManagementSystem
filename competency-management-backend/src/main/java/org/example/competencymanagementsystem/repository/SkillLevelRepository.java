package org.example.competencymanagementsystem.repository;

import org.example.competencymanagementsystem.model.SkillLevel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SkillLevelRepository extends JpaRepository<SkillLevel, Long> {
    Optional<SkillLevel> findByNameAndSkillId(String name, Long skillId);
}
