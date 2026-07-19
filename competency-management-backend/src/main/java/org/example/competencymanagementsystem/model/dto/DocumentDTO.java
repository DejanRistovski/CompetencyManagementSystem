package org.example.competencymanagementsystem.model.dto;

import io.qdrant.client.grpc.JsonWithInt;

import java.util.Map;

public record DocumentDTO (String text, Map<String, JsonWithInt.Value> metadata, Float score) {}
