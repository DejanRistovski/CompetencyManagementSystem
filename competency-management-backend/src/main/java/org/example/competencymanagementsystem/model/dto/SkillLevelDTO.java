package org.example.competencymanagementsystem.model.dto;

public record SkillLevelDTO(Long id, String name, String expectation, Integer levelOrder) implements Comparable<SkillLevelDTO> {
    @Override
    public int compareTo(SkillLevelDTO o) {
        return levelOrder.compareTo(o.levelOrder);
    }
}
