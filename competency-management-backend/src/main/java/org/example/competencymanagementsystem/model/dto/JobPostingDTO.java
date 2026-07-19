package org.example.competencymanagementsystem.model.dto;

import java.util.List;

public record JobPostingDTO(Long id, String postingTitle, String postingDescription, List<JobPostingApplicantDTO> jobPostingApplicants, List<SkillDTO> skills) {
}
