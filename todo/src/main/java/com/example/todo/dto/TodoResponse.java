package com.example.todo.dto;

import com.example.todo.enums.TodoStatus;
import java.time.Instant;

public record TodoResponse(
		Long id,
		String title,
		String description,
		TodoStatus status,
		Instant createdAt,
		Instant updatedAt) {
}