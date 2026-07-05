package com.example.todo.repository;

import com.example.todo.entity.Todo;
import com.example.todo.enums.TodoStatus;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import org.springframework.data.jpa.domain.Specification;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public final class TodoSpecifications {

	public static Specification<Todo> matchesStatus(TodoStatus status) {
		return (root, query, criteriaBuilder) -> {
			if (status == null) {
				return criteriaBuilder.conjunction();
			}
			return criteriaBuilder.equal(root.get("status"), status);
		};
	}

	public static Specification<Todo> containsKeyword(String keyword) {
		return (root, query, criteriaBuilder) -> {
			if (keyword == null || keyword.isBlank()) {
				return criteriaBuilder.conjunction();
			}

			String pattern = "%" + keyword.trim().toLowerCase() + "%";
			return criteriaBuilder.or(
					criteriaBuilder.like(criteriaBuilder.lower(root.get("title")), pattern),
					criteriaBuilder.like(criteriaBuilder.lower(root.get("description")), pattern));
		};
	}
}