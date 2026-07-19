package org.example.competencymanagementsystem.service.impl;

import lombok.RequiredArgsConstructor;
import org.example.competencymanagementsystem.model.Skill;
import org.example.competencymanagementsystem.model.dto.SkillDTO;
import org.example.competencymanagementsystem.model.mappers.SkillMapper;
import org.example.competencymanagementsystem.repository.SkillLevelRepository;
import org.example.competencymanagementsystem.repository.SkillRepository;
import org.example.competencymanagementsystem.service.SkillQdrantService;
import org.example.competencymanagementsystem.service.SkillService;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@RequiredArgsConstructor
public class SkillServiceImpl implements SkillService {

    private final SkillQdrantService skillQdrantService;
    private final SkillRepository skillRepository;
    private final SkillLevelRepository skillLevelRepository;
    private final SkillMapper skillMapper;

    @Override
    public List<SkillDTO> fetchAll() {
        return skillRepository.findAll().stream().map(skillMapper::skillToSkillDto).toList();
    }

    @Override
    public SkillDTO create(SkillDTO skillDTO) {
        Skill skill = skillMapper.skillDtoToSkill(skillDTO);
        skill = skillRepository.save(skill);

        Skill finalSkill = skill;
        skill.getLevels().forEach(level -> level.setSkill(finalSkill));
        skill.setLevels(skillLevelRepository.saveAll(skill.getLevels()));
        skillQdrantService.upsertSkills(List.of(skill));

        return skillMapper.skillToSkillDto(skill);
    }

    @Override
    public Long delete(Long skillId) {
        Skill skill = skillRepository.findById(skillId).orElseThrow();
        skillRepository.delete(skill);
        skillQdrantService.deleteSkill(skillId);
        return skillId;
    }
}
