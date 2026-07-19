package org.example.competencymanagementsystem.service;

import org.example.competencymanagementsystem.model.Skill;
import org.example.competencymanagementsystem.model.dto.DocumentDTO;
import org.example.competencymanagementsystem.model.enums.QdrantCollection;

import java.util.List;

public interface SkillQdrantService {

    List<DocumentDTO> searchDocuments(String text, int limit, double score, QdrantCollection collection);

    void upsertDocuments(List<DocumentDTO> documents, QdrantCollection collection);

    void upsertSkills(List<Skill> skills);

    Long deleteSkill(Long skillId);

    String concatSkillCombinedEmbeddingText(Skill skill);

    String concatSkillEmbeddingText(Skill skill);
}
