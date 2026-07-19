package org.example.competencymanagementsystem.repository;

import org.example.competencymanagementsystem.model.UserSkill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface UserSkillRepository extends JpaRepository<UserSkill, Long> {
  @Modifying
  @Query("""
      DELETE FROM UserSkill us
      WHERE us.user.id = :userId AND us.skillLevel.skill.id = :skillId
      """)
  void deleteByUserIdAndSkillId(Long userId, Long skillId);
  }
