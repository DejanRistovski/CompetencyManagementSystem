package org.example.competencymanagementsystem.service.impl;

import dev.langchain4j.data.embedding.Embedding;
import dev.langchain4j.model.embedding.EmbeddingModel;
import io.qdrant.client.QdrantClient;
import io.qdrant.client.grpc.Common;
import io.qdrant.client.grpc.JsonWithInt;
import io.qdrant.client.grpc.Points;
import lombok.RequiredArgsConstructor;
import org.example.competencymanagementsystem.model.Skill;
import org.example.competencymanagementsystem.model.dto.DocumentDTO;
import org.example.competencymanagementsystem.model.enums.QdrantCollection;
import org.example.competencymanagementsystem.service.SkillQdrantService;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ExecutionException;

import static io.qdrant.client.ValueFactory.value;
import static io.qdrant.client.VectorsFactory.vectors;

@Service
@RequiredArgsConstructor
public class SkillQdrantServiceImpl implements SkillQdrantService {

    private final QdrantClient qdrantClient;
    private final EmbeddingModel embeddingModel;

    @Override
    public List<DocumentDTO> searchDocuments(String query, int limit, double score, QdrantCollection collection) {
        try {
            Embedding queryEmbedding = embeddingModel.embed(query).content();

            List<Points.ScoredPoint> searchResults = qdrantClient.searchAsync(
                    Points.SearchPoints.newBuilder()
                            .setCollectionName(collection.getValue())
                            .addAllVector(queryEmbedding.vectorAsList())
                            .setLimit(limit)
                            .setWithPayload(Points.WithPayloadSelector.newBuilder()
                                    .setEnable(true)
                                    .build())
                            .build()
            ).get();

            return searchResults.stream()
                    .map(scoredPoint -> {
                        Map<String, JsonWithInt.Value> payload = scoredPoint.getPayloadMap();

                        String text = payload.get("text").getStringValue();

                        Map<String, JsonWithInt.Value> metadata = new HashMap<>(payload);
                        metadata.remove("text");

                        return new DocumentDTO(text, metadata, scoredPoint.getScore());
                    })
                    .toList();
        } catch (InterruptedException | ExecutionException e) {
            throw new RuntimeException("Failed to search documents", e);
        }
    }

    @Override
    public void upsertDocuments(List<DocumentDTO> documents, QdrantCollection collection) {
        List<Points.PointStruct> points = documents.stream().map(doc -> {
            Embedding embedding = embeddingModel.embed(doc.text()).content();

            return Points.PointStruct.newBuilder()
                    .setId(Common.PointId.newBuilder().setUuid(UUID.randomUUID().toString()).build())
                    .setVectors(vectors(embedding.vector()))
                    .putPayload("text", JsonWithInt.Value.newBuilder().setStringValue(doc.text()).build())
                    .putAllPayload(doc.metadata())
                    .build();
        }).toList();

        qdrantClient.upsertAsync(collection.getValue(), points);
    }

    @Override
    public void upsertSkills(List<Skill> skills) {
        skills.forEach(skill -> {
            Map<String, JsonWithInt.Value> metadata = Map.of("skill_id", value(skill.getId()));
            DocumentDTO combinedSkillsDto = new DocumentDTO(concatSkillCombinedEmbeddingText(skill), metadata, null);
            DocumentDTO skillsDto = new DocumentDTO(concatSkillEmbeddingText(skill), metadata, null);

            this.upsertDocuments(List.of(combinedSkillsDto), QdrantCollection.SKILLS_COMBINED_COLLECTION);
            this.upsertDocuments(List.of(skillsDto), QdrantCollection.SKILLS_COLLECTION);
        });
    }

    @Override
    public Long deleteSkill(Long skillId) {
        Common.Filter filter = Common.Filter.newBuilder()
                .addMust(Common.Condition.newBuilder()
                        .setField(Common.FieldCondition.newBuilder()
                                .setKey("skill_id")
                                .setMatch(Common.Match.newBuilder()
                                        .setInteger(skillId)
                                        .build())
                                .build())
                        .build())
                .build();

        this.delete(filter, QdrantCollection.SKILLS_COMBINED_COLLECTION);
        return this.delete(filter, QdrantCollection.SKILLS_COLLECTION);
    }

    private Long delete(Common.Filter filter, QdrantCollection collection) {
        try {
            List<Points.RetrievedPoint> searchResults = qdrantClient.scrollAsync(
                    Points.ScrollPoints.newBuilder()
                            .setCollectionName(collection.getValue())
                            .setFilter(filter)
                            .setLimit(1000)
                            .build()
            ).get().getResultList();

            if (searchResults.isEmpty()) {
                return null;
            }

            List<Common.PointId> pointIds = searchResults.stream()
                    .map(Points.RetrievedPoint::getId)
                    .toList();

            qdrantClient.deleteAsync(collection.getValue(), pointIds, null).get();

            return (long) pointIds.size();
        } catch (InterruptedException | ExecutionException e) {
            throw new RuntimeException("Failed to delete entity for collection: " + collection.getValue(), e);
        }
    }

    @Override
    public String concatSkillCombinedEmbeddingText(Skill skill) {
        StringBuilder sb = new StringBuilder();

        sb.append(this.concatSkillEmbeddingText(skill)).append("\n\n");

        skill.getLevels().forEach(lvl -> {
            sb.append(lvl.getName())
                    .append("\nOrder: ")
                    .append(lvl.getLevelOrder())
                    .append("\nLevel id: ")
                    .append(lvl.getId())
                    .append("\nExpectation:\n")
                    .append(lvl.getExpectation())
                    .append("\n\n");
        });

        return sb.toString();
    }

    @Override
    public String concatSkillEmbeddingText(Skill skill) {
        return skill.getName() +
                "\nSkill id: " +
                skill.getId() +
                "\nSkill description:\n" +
                skill.getDescription();
    }
}
