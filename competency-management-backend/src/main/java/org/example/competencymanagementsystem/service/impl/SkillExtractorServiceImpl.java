package org.example.competencymanagementsystem.service.impl;

import dev.langchain4j.data.document.Document;
import dev.langchain4j.data.document.parser.apache.pdfbox.ApachePdfBoxDocumentParser;
import dev.langchain4j.data.document.splitter.DocumentByParagraphSplitter;
import dev.langchain4j.data.segment.TextSegment;
import lombok.RequiredArgsConstructor;
import org.example.competencymanagementsystem.ai.services.SkillExtractorAgent;
import org.example.competencymanagementsystem.model.Skill;
import org.example.competencymanagementsystem.model.SkillLevel;
import org.example.competencymanagementsystem.model.dto.DocumentDTO;
import org.example.competencymanagementsystem.model.dto.ExtendedSkillDTO;
import org.example.competencymanagementsystem.model.dto.GeneratedSkillDTO;
import org.example.competencymanagementsystem.model.dto.GeneratedSkillLevelDTO;
import org.example.competencymanagementsystem.model.enums.QdrantCollection;
import org.example.competencymanagementsystem.model.mappers.SkillMapper;
import org.example.competencymanagementsystem.repository.SkillRepository;
import org.example.competencymanagementsystem.service.SkillExtractorService;
import org.example.competencymanagementsystem.service.SkillQdrantService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;


@Service
@RequiredArgsConstructor
public class SkillExtractorServiceImpl implements SkillExtractorService {

    private final SkillQdrantService skillQdrantService;
    private final SkillExtractorAgent model;
    private final SkillRepository skillRepository;
    private final SkillMapper skillMapper;

    @Override
    public Flux<ExtendedSkillDTO> extendSkills(String input) {
        return Flux.fromIterable(Arrays.asList(input.split("[.!?\\n]+")))
                .filter(part -> !part.isBlank())
                .flatMap(part -> Flux.fromIterable(model.extractSkills(part)))
                .flatMap(skillName -> Mono.fromCallable(() -> new ExtendedSkillDTO(null, null, null, null, null))
                        .subscribeOn(Schedulers.boundedElastic()));
    }

    @Override
    public Stream<GeneratedSkillDTO> extractSkills(String input) {
        List<String> skillNames = model.extractSkills(input);
        return skillNames.stream().map(skillName -> model.generateSkill(skillName, input));
    }

    @Override
    public Flux<GeneratedSkillDTO> extractSkillsReactive(String input) {
        return Flux.fromArray(input.split("[.!?\\n]+"))
                .filter(part -> !part.isBlank())
                .map(String::trim)
                .flatMap(part -> Flux.fromIterable(model.extractSkills(part)))
                .distinct()
                .flatMap(skillName -> Mono.fromCallable(() -> extractSkill(skillName, input))
                    .subscribeOn(Schedulers.boundedElastic()))
                .distinct(GeneratedSkillDTO::getName);
    }

    @Override
    public Flux<GeneratedSkillDTO> extractSkillsReactivePDF(MultipartFile file) throws IOException {
        ApachePdfBoxDocumentParser parser = new ApachePdfBoxDocumentParser();
        DocumentByParagraphSplitter splitter = new DocumentByParagraphSplitter(1000, 50);

        Document document = parser.parse(file.getInputStream());
        List<TextSegment> segments = splitter.split(document);
        return Flux.fromStream(segments.stream().map(TextSegment::text))
                .filter(part -> !part.isBlank())
                .map(String::trim)
                .flatMap(part -> Flux.fromIterable(model.extractSkills(part)))
                .distinct()
                .flatMap(skillName -> Mono.fromCallable(() -> extractSkill(skillName, document.text()))
                        .subscribeOn(Schedulers.boundedElastic()))
                .distinct(GeneratedSkillDTO::getName);
    }

    private GeneratedSkillDTO extractSkill(String skillName, String input) {
        GeneratedSkillDTO generatedSkill = model.generateSkill(skillName, input);
        generatedSkill.setMatchedLevelId(null);
        generatedSkill.clearIds();

        if (generatedSkill.getLevels() != null) {
            List<DocumentDTO> similarToGenerated = fetchSimilarSkills(generatedSkill);
            Optional<DocumentDTO> matchedSkill = similarToGenerated.stream().filter(doc -> doc.score() > 0.9).findFirst();
            if (matchedSkill.isPresent()) {
                Long matchedLevelId = model.matchSkill(skillName, input, matchedSkill.get().text());
                Optional<Skill> skill = skillRepository.findById(matchedSkill.get().metadata().get("skill_id").getIntegerValue());
                if (skill.isPresent()) {
                    if (matchedLevelId != null && matchedLevelId != -1L && skill.get().getLevels().stream().anyMatch(lvl -> lvl.getId().equals(matchedLevelId)))
                        return skillMapper.skillToGeneratedSkill(skill.get(), generatedSkill.getBasedLevel(), matchedLevelId);
                    else {
                        ExtendedSkillDTO extendedSkillDTO = model.extendSkill(skillName, input, matchedSkill.get().text());
                        if (!extendedSkillDTO.isEmpty()) {
                            GeneratedSkillDTO generatedSkillDTO = skillMapper.skillToGeneratedSkill(skill.get(), extendedSkillDTO.getLevelName(), null);
                            System.out.println("Extended skill " + skillName + extendedSkillDTO);

                            generatedSkillDTO.getLevels().add(new GeneratedSkillLevelDTO(null, extendedSkillDTO.getLevelName(), extendedSkillDTO.getLevelExpectation(), getLevelOrder(extendedSkillDTO, skill.get())));
                            return generatedSkillDTO;
                        }
                    }
                }
            }
        }

        return generatedSkill;
    }

    private Double getLevelOrder(ExtendedSkillDTO extendedSkillDTO, Skill skill) {
        SkillLevel prevLevel = skill.getLevels().stream().filter(lvl -> lvl.getName().equals(extendedSkillDTO.getPrevLevel())).findFirst().orElse(null);
        SkillLevel nextLevel = skill.getLevels().stream().filter(lvl -> lvl.getName().equals(extendedSkillDTO.getNextLevel())).findFirst().orElse(null);


        if (nextLevel == null && prevLevel != null)
            return skill.getLevels().size() + 1.0;
        if (nextLevel != null && prevLevel == null)
            return 0.0;
        if (nextLevel != null && prevLevel != null) {
            return (nextLevel.getLevelOrder() + prevLevel.getLevelOrder()) / 2.0;
        }
        return 0.0;
    }

    private List<DocumentDTO> fetchSimilarSkills(GeneratedSkillDTO generatedSkillDTO) {
        String input = skillQdrantService.concatSkillCombinedEmbeddingText(skillMapper.generatedSkillToSkill(generatedSkillDTO));
        return skillQdrantService.searchDocuments(input, 5, 0.5, QdrantCollection.SKILLS_COMBINED_COLLECTION);
    }
}
