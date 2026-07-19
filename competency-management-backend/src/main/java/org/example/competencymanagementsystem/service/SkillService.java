package org.example.competencymanagementsystem.service;

import org.example.competencymanagementsystem.model.dto.SkillDTO;

import java.util.List;

public interface SkillService {

    List<SkillDTO> fetchAll();

    SkillDTO create(SkillDTO skillDTO);

    Long delete(Long skillId);
}
