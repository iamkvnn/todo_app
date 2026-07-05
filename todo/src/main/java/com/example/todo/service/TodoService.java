package com.example.todo.service;

import com.example.todo.dto.CompletionRequest;
import com.example.todo.dto.TodoRequest;
import com.example.todo.dto.TodoResponse;
import com.example.todo.entity.Todo;
import com.example.todo.enums.TodoStatus;
import com.example.todo.exception.ResourceNotFoundException;
import com.example.todo.mapper.TodoMapper;
import com.example.todo.repository.TodoRepository;
import com.example.todo.repository.TodoSpecifications;
import com.example.todo.util.TextUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TodoService {

	private final TodoRepository todoRepository;
	private final TodoMapper todoMapper;

	@Transactional(readOnly = true)
	public Page<TodoResponse> findTodos(TodoStatus status, String keyword, Pageable pageable) {
		Specification<Todo> specification = TodoSpecifications.matchesStatus(status)
				.and(TodoSpecifications.containsKeyword(keyword));

		return todoRepository.findAll(specification, pageable).map(todoMapper::toResponse);
	}

	@Transactional(readOnly = true)
	public TodoResponse getTodo(Long id) {
		return todoMapper.toResponse(findTodo(id));
	}

	@Transactional
	public TodoResponse createTodo(TodoRequest request) {
		Todo todo = Todo.builder()
				.title(TextUtils.trimRequired(request.title()))
				.description(TextUtils.trimToNull(request.description()))
				.build();
		return todoMapper.toResponse(todoRepository.save(todo));
	}

	@Transactional
	public TodoResponse updateTodo(Long id, TodoRequest request) {
		Todo todo = findTodo(id);
		todo.setTitle(TextUtils.trimRequired(request.title()));
		todo.setDescription(TextUtils.trimToNull(request.description()));
		return todoMapper.toResponse(todo);
	}

	@Transactional
	public TodoResponse updateCompletion(Long id, CompletionRequest request) {
		Todo todo = findTodo(id);
		todo.setStatus(request.completed() ? TodoStatus.completed : TodoStatus.active);
		return todoMapper.toResponse(todo);
	}

	@Transactional
	public void deleteTodo(Long id) {
		Todo todo = findTodo(id);
		todoRepository.delete(todo);
	}

	private Todo findTodo(Long id) {
		return todoRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Todo with id " + id + " was not found"));
	}
}



