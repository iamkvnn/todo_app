package com.example.todo.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.example.todo.dto.CompletionRequest;
import com.example.todo.dto.TodoRequest;
import com.example.todo.dto.TodoResponse;
import com.example.todo.entity.Todo;
import com.example.todo.enums.TodoStatus;
import com.example.todo.exception.ResourceNotFoundException;
import com.example.todo.mapper.TodoMapper;
import com.example.todo.repository.TodoRepository;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

@ExtendWith(MockitoExtension.class)
class TodoServiceTest {

	@Mock
	private TodoRepository todoRepository;

	@Mock
	private TodoMapper todoMapper;

	private TodoService todoService;

	@BeforeEach
	void setUp() {
		todoService = new TodoService(todoRepository, todoMapper);
	}

	@Test
	void createTodoTrimsInputAndDefaultsToActive() {
		mockTodoMapper();
		when(todoRepository.save(any(Todo.class))).thenAnswer(invocation -> {
			Todo todo = invocation.getArgument(0);
			todo.setId(1L);
			todo.setCreatedAt(Instant.parse("2026-07-05T10:00:00Z"));
			todo.setUpdatedAt(Instant.parse("2026-07-05T10:00:00Z"));
			return todo;
		});

		TodoResponse response = todoService.createTodo(new TodoRequest("  Write tests  ", "  Cover API  "));

		assertThat(response.id()).isEqualTo(1L);
		assertThat(response.title()).isEqualTo("Write tests");
		assertThat(response.description()).isEqualTo("Cover API");
		assertThat(response.status()).isEqualTo(TodoStatus.active);
	}

	@Test
	void updateTodoChangesTitleAndDescription() {
		mockTodoMapper();
		Todo todo = todo(1L, "Old", "Old description", false);
		when(todoRepository.findById(1L)).thenReturn(Optional.of(todo));

		TodoResponse response = todoService.updateTodo(1L, new TodoRequest("New", "New description"));

		assertThat(response.title()).isEqualTo("New");
		assertThat(response.description()).isEqualTo("New description");
	}

	@Test
	void updateCompletionChangesStatus() {
		mockTodoMapper();
		Todo todo = todo(1L, "Task", null, false);
		when(todoRepository.findById(1L)).thenReturn(Optional.of(todo));

		TodoResponse response = todoService.updateCompletion(1L, new CompletionRequest(true));

		assertThat(response.status()).isEqualTo(TodoStatus.completed);
	}

	@Test
	void deleteTodoDeletesExistingTodo() {
		Todo todo = todo(1L, "Task", null, false);
		when(todoRepository.findById(1L)).thenReturn(Optional.of(todo));

		todoService.deleteTodo(1L);

		verify(todoRepository).delete(todo);
	}

	@Test
	void getTodoThrowsWhenMissing() {
		when(todoRepository.findById(99L)).thenReturn(Optional.empty());

		assertThatThrownBy(() -> todoService.getTodo(99L))
				.isInstanceOf(ResourceNotFoundException.class)
				.hasMessage("Todo with id 99 was not found");
	}

	@Test
	@SuppressWarnings("unchecked")
	void findTodosCallsRepositoryWithCorrectSpecificationAndPageable() {
		mockTodoMapper();
		Pageable pageable = PageRequest.of(0, 10);
		Todo todo = todo(1L, "Task", null, true);
		when(todoRepository.findAll(any(Specification.class), eq(pageable)))
				.thenReturn(new PageImpl<>(List.of(todo), pageable, 1));

		Page<TodoResponse> result = todoService.findTodos(TodoStatus.completed, "keyword", pageable);

		assertThat(result.getContent()).extracting(TodoResponse::status).containsExactly(TodoStatus.completed);
		verify(todoRepository).findAll(any(Specification.class), eq(pageable));
	}

	private void mockTodoMapper() {
		when(todoMapper.toResponse(any(Todo.class))).thenAnswer(invocation -> toResponse(invocation.getArgument(0)));
	}

	private Todo todo(Long id, String title, String description, boolean completed) {
		Todo todo = Todo.builder().title(title).description(description).build();
		todo.setId(id);
		todo.setStatus(completed ? TodoStatus.completed : TodoStatus.active);
		todo.setCreatedAt(Instant.parse("2026-07-05T10:00:00Z"));
		todo.setUpdatedAt(Instant.parse("2026-07-05T10:00:00Z"));
		return todo;
	}

	private TodoResponse toResponse(Todo todo) {
		return new TodoResponse(
				todo.getId(),
				todo.getTitle(),
				todo.getDescription(),
				todo.getStatus(),
				todo.getCreatedAt(),
				todo.getUpdatedAt());
	}
}