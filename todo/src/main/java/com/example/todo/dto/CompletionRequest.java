package com.example.todo.dto;

import jakarta.validation.constraints.NotNull;

public record CompletionRequest(
		@NotNull(message = "Completed is required")
		Boolean completed) {
}
