package com.example.todo.mapper;

import com.example.todo.dto.TodoResponse;
import com.example.todo.entity.Todo;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface TodoMapper {

	TodoResponse toResponse(Todo todo);
}