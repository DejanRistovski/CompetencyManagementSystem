package org.example.competencymanagementsystem.model.mappers;

import org.example.competencymanagementsystem.model.Skill;
import org.example.competencymanagementsystem.model.dto.GeneratedSkillDTO;
import org.example.competencymanagementsystem.model.dto.SkillDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface SkillMapper {

    SkillDTO skillToSkillDto(Skill skill);
    SkillDTO skillToSkillDto(Skill skill, Long matchedLevelId);
    Skill skillDtoToSkill(SkillDTO skillDTO);

    @Mapping(target = "matchedLevelId", expression  = "java(matchedLevelId)")
    @Mapping(target = "basedLevel", expression = "java(basedLevel)")
    GeneratedSkillDTO skillToGeneratedSkill(Skill skill, String basedLevel, Long matchedLevelId);
    Skill generatedSkillToSkill(GeneratedSkillDTO generatedSkill);
    SkillDTO generatedSkillToSkillDTO(GeneratedSkillDTO generatedSkillDTO);

    List<SkillDTO> skillsToSkillDTOS(List<Skill> skills);
    List<Skill> skillDTOSToSkills(List<SkillDTO> skills);
}
