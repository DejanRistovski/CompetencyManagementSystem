package org.example.competencymanagementsystem.ai.config;

import dev.langchain4j.model.chat.ChatModel;
import dev.langchain4j.service.AiServices;
import lombok.RequiredArgsConstructor;
import org.example.competencymanagementsystem.ai.services.JobPostingGeneratorAgent;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
public class JobPostingGeneratorAgentConfig {

    private final ChatModel model;

    @Bean
    JobPostingGeneratorAgent jobPostingGeneratorAgent() {
        return AiServices.builder(JobPostingGeneratorAgent.class)
                .chatModel(model)
                .build();
    }
}
