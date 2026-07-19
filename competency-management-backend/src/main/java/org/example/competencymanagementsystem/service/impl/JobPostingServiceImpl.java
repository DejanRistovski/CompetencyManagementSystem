package org.example.competencymanagementsystem.service.impl;

import lombok.RequiredArgsConstructor;
import org.example.competencymanagementsystem.ai.services.JobPostingGeneratorAgent;
import org.example.competencymanagementsystem.model.*;
import org.example.competencymanagementsystem.model.dto.*;
import org.example.competencymanagementsystem.model.exceptions.AppException;
import org.example.competencymanagementsystem.model.mappers.JobPostingMapper;
import org.example.competencymanagementsystem.model.mappers.UserMapper;
import org.example.competencymanagementsystem.repository.*;
import org.example.competencymanagementsystem.service.JobPostingService;
import org.example.competencymanagementsystem.service.SkillExtractorService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class JobPostingServiceImpl implements JobPostingService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final SkillExtractorService skillExtractorService;
    private final SkillLevelRepository skillLevelRepository;
    private final JobPostingRepository jobPostingRepository;
    private final JobPostingSkillRepository jobPostingSkillRepository;
    private final JobPostingGeneratorAgent jobPostingGeneratorAgent;
    private final JobPostingMapper jobPostingMapper;
    private final JobPostingApplicantRepository jobPostingApplicantRepository;

    @Override
    public JobPostingDTO fetchById(Long jobPostingId) {
        JobPosting jobPosting = jobPostingRepository.findById(jobPostingId)
                .orElseThrow(() -> new AppException("Job posting not found", HttpStatus.NOT_FOUND));
        return jobPostingMapper.jobPostingToJobPostingDTO(jobPosting);
    }

    @Override
    public List<JobPostingDTO> fetchAll() {
        return jobPostingRepository.findAll().stream().map(jobPostingMapper::jobPostingToJobPostingDTO).toList();
    }

    @Override
    public JobPostingDTO createJobPosting(List<SkillLevelDTO> skillLevels) {
        JobPostingGenerateDTO jobPostingGenerateDTO = jobPostingGeneratorAgent.generateJobPosting(skillLevels);
        List<SkillLevel> skillLevelsFetched = skillLevelRepository.findAllById(skillLevels.stream().map(SkillLevelDTO::id).toList());
        JobPosting jobPosting = jobPostingRepository.save(new JobPosting(
                null,
                jobPostingGenerateDTO.postingTitle(),
                jobPostingGenerateDTO.postingDescription(),
                new ArrayList<>(),
                new ArrayList<>())
        );
        List<JobPostingSkill> jobPostingSkills = skillLevelsFetched.stream().map(s -> new JobPostingSkill(null, s, jobPosting)).toList();
        jobPostingSkills = jobPostingSkillRepository.saveAll(jobPostingSkills);
        jobPosting.setJobPostingSkills(jobPostingSkills);
        return jobPostingMapper.jobPostingToJobPostingDTO(jobPosting);
    }

    @Override
    public void applyToJobPosting(Long jobPostingId, MultipartFile file, SignUpDto userInfo) throws IOException {
        JobPosting jobPosting = jobPostingRepository.findById(jobPostingId)
                .orElseThrow(() -> new AppException("Job posting not found", HttpStatus.NOT_FOUND));
        List<GeneratedSkillDTO> generatedSkills = skillExtractorService.extractSkillsReactivePDF(file)
                .filter(s -> s.getId() != null)
                .collectList()
                .block();
        List<SkillLevel> skillLevels = jobPosting.getJobPostingSkills().stream().map(JobPostingSkill::getSkillLevel)
                .toList();
        int score = skillLevels.stream().map(sl -> getMatchScore(generatedSkills, sl)).reduce(Integer::sum).orElse(0);

        JobPostingApplicant jobPostingApplicant = new JobPostingApplicant();
        jobPostingApplicant.setJobPosting(jobPosting);
        jobPostingApplicant.setScore(score);
        Optional<User> oUser = userRepository.findByEmail(userInfo.email());
        if (oUser.isPresent())
            jobPostingApplicant.setUser(oUser.get());
        else
            jobPostingApplicant.setUser(userRepository.save(userMapper.signUpToUser(userInfo)));
        jobPostingApplicantRepository.save(jobPostingApplicant);
    }

    private int getMatchScore(List<GeneratedSkillDTO> generatedSkills, SkillLevel skillLevel) {
        GeneratedSkillDTO generatedSkill = generatedSkills.stream()
                .filter(s -> s.getLevels().stream().anyMatch(lvl -> lvl.getId().equals(skillLevel.getId())))
                .findFirst().orElse(null);
        if (generatedSkill == null)
            return 0;

        GeneratedSkillLevelDTO generatedSkillLevel = generatedSkill.getLevels().stream()
                .filter(lvl -> lvl.getId().equals(generatedSkill.getMatchedLevelId()))
                .findFirst().orElse(null);
        int diff = (int) (generatedSkillLevel.getLevelOrder() - skillLevel.getLevelOrder());
        return diff < 0 ? 0 : generatedSkillLevel.getLevelOrder().intValue();
    }

}
