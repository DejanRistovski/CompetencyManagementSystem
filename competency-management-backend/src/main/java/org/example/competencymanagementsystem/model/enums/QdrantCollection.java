package org.example.competencymanagementsystem.model.enums;

import lombok.Getter;

@Getter
public enum QdrantCollection {
    SKILLS_COLLECTION("skills"),
    SKILLS_COMBINED_COLLECTION("skills_combined");

    private String value;

    QdrantCollection(String value) {
        this.value = value;
    }
}
