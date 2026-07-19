package org.example.competencymanagementsystem.model.dto;

import java.util.SortedSet;

public record SkillDTO(Long id, String name, String description, SortedSet<SkillLevelDTO> levels, String basedLevel, Long matchedLevelId) {
}
