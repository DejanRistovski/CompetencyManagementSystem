package org.example.competencymanagementsystem.ai.services;

import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;
import dev.langchain4j.service.V;
import org.example.competencymanagementsystem.model.dto.JobPostingGenerateDTO;
import org.example.competencymanagementsystem.model.dto.SkillLevelDTO;

import java.util.List;

public interface JobPostingGeneratorAgent {

    @SystemMessage("""
            Generate a job posting based on the given skill level data.
            You are forbidden from adding any more skills or requirements other that those given to you.
            The job posting description is the actual job posting, use rich text to generate it.
            """)
    @UserMessage("""
            Skill level data:
            {{skillLevels}}
            """)
    JobPostingGenerateDTO generateJobPosting(@V("skillLevels") List<SkillLevelDTO> skillLevels);
}
