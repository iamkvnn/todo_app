package com.example.todo.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {

	VALIDATION_FAILED("VALIDATION_FAILED", HttpStatus.BAD_REQUEST, "Validation failed", "Request contains invalid fields"),
	INVALID_REQUEST("INVALID_REQUEST", HttpStatus.BAD_REQUEST, "Bad request", "Request is invalid"),
	MALFORMED_JSON("MALFORMED_JSON", HttpStatus.BAD_REQUEST, "Malformed JSON", "Request body is malformed or unreadable"),
	INVALID_REQUEST_PARAMETER("INVALID_REQUEST_PARAMETER", HttpStatus.BAD_REQUEST, "Invalid request parameter", "Request parameter is invalid"),
	INVALID_STATUS("INVALID_STATUS", HttpStatus.BAD_REQUEST, "Invalid status", "Status must be one of: active, completed"),
	INVALID_SORT("INVALID_SORT", HttpStatus.BAD_REQUEST, "Invalid sort", "Sort parameter is invalid"),
	RESOURCE_NOT_FOUND("RESOURCE_NOT_FOUND", HttpStatus.NOT_FOUND, "Resource not found", "Resource was not found"),
	METHOD_NOT_ALLOWED("METHOD_NOT_ALLOWED", HttpStatus.METHOD_NOT_ALLOWED, "Method not allowed", "HTTP method is not supported"),
	UNSUPPORTED_MEDIA_TYPE("UNSUPPORTED_MEDIA_TYPE", HttpStatus.UNSUPPORTED_MEDIA_TYPE, "Unsupported media type", "Content type is not supported"),
	INTERNAL_ERROR("INTERNAL_ERROR", HttpStatus.INTERNAL_SERVER_ERROR, "Internal server error", "An unexpected error occurred");

	private final String code;
	private final HttpStatus status;
	private final String title;
	private final String defaultDetail;
}
