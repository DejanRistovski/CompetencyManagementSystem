package org.example.competencymanagementsystem.controller;

import lombok.RequiredArgsConstructor;
import org.example.competencymanagementsystem.model.dto.JobPostingDTO;
import org.example.competencymanagementsystem.model.dto.SignUpDto;
import org.example.competencymanagementsystem.model.dto.SkillLevelDTO;
import org.example.competencymanagementsystem.service.JobPostingService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/job-postings")
@RequiredArgsConstructor
public class JobPostingController {

    private final JobPostingService jobPostingService;

    @GetMapping("/{jobPostingId}")
    public JobPostingDTO fetchById(@PathVariable Long jobPostingId) {
        return jobPostingService.fetchById(jobPostingId);
    }

    @GetMapping
    public List<JobPostingDTO> fetchAll() {
        return jobPostingService.fetchAll();
    }

    @PostMapping
    public JobPostingDTO createJobPosting(@RequestBody List<SkillLevelDTO> skillLevels) {
        return jobPostingService.createJobPosting(skillLevels);
    }

    @PostMapping("/{jobPostingId}/apply")
    public void applyToJobPosting(@PathVariable Long jobPostingId,
                                  @RequestPart("file") MultipartFile file,
                                  @RequestPart("userInfo") SignUpDto userInfo) throws IOException {
        jobPostingService.applyToJobPosting(jobPostingId, file, userInfo);
    }
}
