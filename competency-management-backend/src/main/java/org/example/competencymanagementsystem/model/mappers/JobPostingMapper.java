package org.example.competencymanagementsystem.model.mappers;

import org.example.competencymanagementsystem.model.JobPosting;
import org.example.competencymanagementsystem.model.JobPostingSkill;
import org.example.competencymanagementsystem.model.dto.*;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.ArrayList;
import java.util.List;

@Mapper(componentModel = "spring", uses = {SkillMapper.class})
public abstract class JobPostingMapper {

    @Autowired
    protected SkillMapper skillMapper;

    @Mapping(target = "skills", expression = "java(jobPostingSkillsToSkillLevels(jobPosting.getJobPostingSkills()))")
    public abstract JobPostingDTO jobPostingToJobPostingDTO(JobPosting jobPosting);

    protected List<SkillDTO> jobPostingSkillsToSkillLevels(List<JobPostingSkill> jobPostingSkills) {
        if (jobPostingSkills == null)
            return new ArrayList<>();

        return jobPostingSkills.stream().map(jobPostingSkill ->
                skillMapper.skillToSkillDto(jobPostingSkill.getSkillLevel().getSkill(), jobPostingSkill.getSkillLevel().getId())
        ).toList();
    }
}
