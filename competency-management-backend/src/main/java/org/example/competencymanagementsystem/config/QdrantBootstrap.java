package org.example.competencymanagementsystem.config;

import io.qdrant.client.QdrantClient;
import io.qdrant.client.grpc.Collections;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.example.competencymanagementsystem.model.enums.QdrantCollection;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.concurrent.ExecutionException;

@Component
@RequiredArgsConstructor
public class QdrantBootstrap {

    private final QdrantClient qdrantClient;

    @PostConstruct
    void initQdrant() {
        Arrays.stream(QdrantCollection.values()).forEach(collection -> {
            try {
                boolean collectionExists = qdrantClient.collectionExistsAsync(collection.getValue()).get();
                if (!collectionExists) {
                    qdrantClient.createCollectionAsync(
                            collection.getValue(),
                            Collections.VectorParams.newBuilder()
                                    .setSize(1536)
                                    .setDistance(Collections.Distance.Cosine)
                                    .build()
                    ).get();
                }
            } catch (InterruptedException | ExecutionException e) {
                throw new RuntimeException(e);
            }
        });
    }
}
