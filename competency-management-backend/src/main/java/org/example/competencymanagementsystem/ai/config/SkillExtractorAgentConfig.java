package org.example.competencymanagementsystem.ai.config;

import dev.langchain4j.model.chat.ChatModel;
import dev.langchain4j.service.AiServices;
import org.example.competencymanagementsystem.ai.services.SkillExtractorAgent;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SkillExtractorAgentConfig {

    private final ChatModel skillExtractorModel;

    public SkillExtractorAgentConfig(@Qualifier("skillExtractorModel") ChatModel skillExtractorModel) {
        this.skillExtractorModel = skillExtractorModel;
    }

    @Bean
    SkillExtractorAgent skillExtractorAgent() {
        return AiServices.builder(SkillExtractorAgent.class)
                .chatModel(skillExtractorModel)
                .build();
    }
}
