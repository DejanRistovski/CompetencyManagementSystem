package org.example.competencymanagementsystem.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.SortedSet;

@Data
@AllArgsConstructor
public class GeneratedSkillDTO {
    private Long id;
    private String name;
    private String description;
    private SortedSet<GeneratedSkillLevelDTO> levels;
    private String basedLevel;
    private Long matchedLevelId;

    public void clearIds() {
        this.id = null;
        if (levels != null)
            levels.forEach(lvl -> lvl.setId(null));
    }
}
