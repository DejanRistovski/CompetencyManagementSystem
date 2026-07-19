package org.example.competencymanagementsystem.ai.config;

import dev.langchain4j.model.chat.ChatModel;
import dev.langchain4j.model.chat.StreamingChatModel;
import dev.langchain4j.service.AiServices;
import lombok.RequiredArgsConstructor;
import org.example.competencymanagementsystem.ai.services.MainChatAgent;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
public class MainChatAgentConfig {

    private final ChatModel model;
    private final StreamingChatModel streamModel;

    @Bean
    MainChatAgent mainAgent() {
        return AiServices.builder(MainChatAgent.class)
                .chatModel(model)
                .streamingChatModel(streamModel)
                .build();
    }
}
