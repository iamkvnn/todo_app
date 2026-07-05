package com.example.todo.dto;

import java.util.List;

public record PaginationMeta(
		int page,
		int size,
		long totalElements,
		int totalPages,
		List<String> sort) {
}
