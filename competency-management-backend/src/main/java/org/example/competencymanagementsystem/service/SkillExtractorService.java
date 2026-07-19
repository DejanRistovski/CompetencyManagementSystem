package org.example.competencymanagementsystem.service;

import org.example.competencymanagementsystem.model.dto.ExtendedSkillDTO;
import org.example.competencymanagementsystem.model.dto.GeneratedSkillDTO;
import org.springframework.web.multipart.MultipartFile;
import reactor.core.publisher.Flux;

import java.io.IOException;
import java.util.stream.Stream;

public interface SkillExtractorService {
    Flux<ExtendedSkillDTO> extendSkills(String input);

    Stream<GeneratedSkillDTO> extractSkills(String input);

    Flux<GeneratedSkillDTO> extractSkillsReactive(String input);

    Flux<GeneratedSkillDTO> extractSkillsReactivePDF(MultipartFile file) throws IOException;
}
