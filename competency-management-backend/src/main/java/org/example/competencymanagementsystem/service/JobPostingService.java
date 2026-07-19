package org.example.competencymanagementsystem.service;

import org.example.competencymanagementsystem.model.dto.JobPostingDTO;
import org.example.competencymanagementsystem.model.dto.SignUpDto;
import org.example.competencymanagementsystem.model.dto.SkillLevelDTO;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface JobPostingService {
    JobPostingDTO fetchById(Long jobPostingId);
    List<JobPostingDTO> fetchAll();
    JobPostingDTO createJobPosting(List<SkillLevelDTO> skillLevels);
    void applyToJobPosting(Long jobPostingId, MultipartFile file, SignUpDto userInfo) throws IOException;
}
