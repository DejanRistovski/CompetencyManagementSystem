package org.example.competencymanagementsystem.model.dto;

import dev.langchain4j.model.output.structured.Description;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ExtendedSkillDTO {
    private Long skillId;
    private String levelName;
    private String levelExpectation;
    @Description("The level name that is below the generated level")
    private String prevLevel;
    @Description("The level name that is above the generated level")
    private String nextLevel;

    public boolean isEmpty() {
        return skillId == null || levelName == null || levelExpectation == null || prevLevel == null || nextLevel == null;
    }
}
