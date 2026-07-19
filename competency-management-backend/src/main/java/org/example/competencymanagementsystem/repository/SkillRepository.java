package org.example.competencymanagementsystem.repository;

import org.example.competencymanagementsystem.model.Skill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface SkillRepository extends JpaRepository<Skill, Long> {
    @Query("""
        SELECT s
        FROM Skill s
        JOIN SkillLevel sl on sl.skill.id = s.id
        WHERE sl.id = :levelId
        """)
    Optional<Skill> findByContainingLevelId(Long levelId);
}
