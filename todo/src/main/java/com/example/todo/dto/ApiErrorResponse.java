package com.example.todo.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.Instant;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_EMPTY)
public record ApiErrorResponse(
		String title,
		int status,
		String errorCode,
		String detail,
		String instance,
		String requestId,
		Instant timestamp,
		List<FieldErrorResponse> errors) {
}
