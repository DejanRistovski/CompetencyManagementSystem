package org.example.competencymanagementsystem.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class GeneratedSkillLevelDTO implements Comparable<GeneratedSkillLevelDTO> {
    private Long id;
    private String name;
    private String expectation;
    private Double levelOrder;

    @Override
    public int compareTo(GeneratedSkillLevelDTO o) {
        return levelOrder.compareTo(o.getLevelOrder());
    }
}
