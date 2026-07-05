package com.example.todo.controller;

import com.example.todo.dto.ApiResponse;
import com.example.todo.dto.CompletionRequest;
import com.example.todo.dto.PaginatedApiResponse;
import com.example.todo.dto.TodoRequest;
import com.example.todo.dto.TodoResponse;
import com.example.todo.enums.TodoStatus;
import com.example.todo.service.TodoService;
import com.example.todo.util.PageableUtils;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/todos")
@RequiredArgsConstructor
@Validated
public class TodoController {

	private static final List<String> TODO_SORT_FIELDS = List.of("id", "title", "status", "createdAt", "updatedAt");

	private final TodoService todoService;

	@GetMapping
	public ResponseEntity<PaginatedApiResponse<TodoResponse>> listTodos(
			@RequestParam(required = false) TodoStatus status,
			@RequestParam(required = false, name = "q") String keyword,
			@RequestParam(required = false, defaultValue = "1")
			@Min(value = 1, message = "Page must be greater than or equal to 1") Integer page,
			@RequestParam(required = false, defaultValue = "10")
			@Min(value = 1, message = "Size must be between 1 and 100")
			@Max(value = 100, message = "Size must be between 1 and 100") Integer size,
			@RequestParam(required = false) String[] sort) {
		Pageable pageable = PageableUtils.fromOneBased(page, size, sort, TODO_SORT_FIELDS);

		return ResponseEntity.ok(PaginatedApiResponse.from(todoService.findTodos(status, keyword, pageable)));
	}

	@GetMapping("/{id}")
	public ResponseEntity<ApiResponse<TodoResponse>> getTodo(@PathVariable Long id) {
		return ResponseEntity.ok(ApiResponse.of(todoService.getTodo(id)));
	}

	@PostMapping
	public ResponseEntity<ApiResponse<TodoResponse>> createTodo(@Valid @RequestBody TodoRequest request) {
		return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.of(todoService.createTodo(request)));
	}

	@PutMapping("/{id}")
	public ResponseEntity<ApiResponse<TodoResponse>> updateTodo(@PathVariable Long id,
			@Valid @RequestBody TodoRequest request) {
		return ResponseEntity.ok(ApiResponse.of(todoService.updateTodo(id, request)));
	}

	@PatchMapping("/{id}/completion")
	public ResponseEntity<ApiResponse<TodoResponse>> updateCompletion(@PathVariable Long id,
			@Valid @RequestBody CompletionRequest request) {
		return ResponseEntity.ok(ApiResponse.of(todoService.updateCompletion(id, request)));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteTodo(@PathVariable Long id) {
		todoService.deleteTodo(id);
		return ResponseEntity.noContent().build();
	}
}
