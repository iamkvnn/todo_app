package com.example.todo.dto;

import java.util.List;
import org.springframework.data.domain.Page;

public record PaginatedApiResponse<T>(
		List<T> data,
		PaginationMeta meta) {

	public static <T> PaginatedApiResponse<T> from(Page<T> page) {
		List<String> sort = page.getSort().stream()
				.map(order -> order.getProperty() + ":" + order.getDirection().name().toLowerCase())
				.toList();
		PaginationMeta meta = new PaginationMeta(
				page.getNumber() + 1,
				page.getSize(),
				page.getTotalElements(),
				page.getTotalPages(),
				sort);
		return new PaginatedApiResponse<>(page.getContent(), meta);
	}
}
