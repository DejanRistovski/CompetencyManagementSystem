package org.example.competencymanagementsystem.ai.services;

import dev.langchain4j.data.message.ChatMessage;
import dev.langchain4j.invocation.InvocationParameters;
import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.TokenStream;

import java.util.List;

public interface MainChatAgent {

    @SystemMessage("""
                You are an assistant designed for helping users extract skills and competencies from an unstructured text.
            """)
    TokenStream chat(List<ChatMessage> messages, InvocationParameters parameters);
}
