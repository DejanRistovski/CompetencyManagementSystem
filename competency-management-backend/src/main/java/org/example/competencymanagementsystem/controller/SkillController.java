package org.example.competencymanagementsystem.controller;

import lombok.RequiredArgsConstructor;
import org.example.competencymanagementsystem.model.dto.ExtendedSkillDTO;
import org.example.competencymanagementsystem.model.dto.GeneratedSkillDTO;
import org.example.competencymanagementsystem.model.dto.SkillDTO;
import org.example.competencymanagementsystem.service.SkillExtractorService;
import org.example.competencymanagementsystem.service.SkillService;
import org.springframework.http.MediaType;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import reactor.core.publisher.Flux;
import reactor.core.scheduler.Schedulers;

import java.io.IOException;
import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/skills")
@RequiredArgsConstructor
public class SkillController {

    private final SkillExtractorService skillExtractorService;
    private final SkillService skillService;

    @GetMapping
    public List<SkillDTO> fetchAll(){
        return skillService.fetchAll();
    }

    @PostMapping(value = "/extend-skills", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<ServerSentEvent<ExtendedSkillDTO>> extendSkills(@RequestBody String input) {
        return skillExtractorService.extendSkills(input)
                .map(skill -> ServerSentEvent.<ExtendedSkillDTO>builder()
                        .data(skill)
                        .build())
                .subscribeOn(Schedulers.boundedElastic());
    }

    @PostMapping(value = "/extract-skills", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<ServerSentEvent<GeneratedSkillDTO>> extractSkills(@RequestBody String input) {
        return skillExtractorService.extractSkillsReactive(input)
                .map(skill -> ServerSentEvent.<GeneratedSkillDTO>builder()
                        .data(skill)
                        .build())
                .subscribeOn(Schedulers.boundedElastic());
    }

    @PostMapping(value = "/extract-skills-pdf", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<ServerSentEvent<GeneratedSkillDTO>> extractSkillsPDF(@RequestParam("file") MultipartFile file) throws IOException {
        return skillExtractorService.extractSkillsReactivePDF(file)
                .map(skill -> ServerSentEvent.<GeneratedSkillDTO>builder()
                        .data(skill)
                        .build())
                .subscribeOn(Schedulers.boundedElastic());
    }

    @PostMapping
    public SkillDTO createSkill(@RequestBody SkillDTO skillDTO) {
        return skillService.create(skillDTO);
    }

    @DeleteMapping("/{id}")
    public Long deleteSkill(@PathVariable Long id) {
        return skillService.delete(id);
    }
}
