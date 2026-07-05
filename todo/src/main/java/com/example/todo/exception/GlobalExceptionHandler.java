package com.example.todo.exception;

import com.example.todo.dto.ApiErrorResponse;
import com.example.todo.dto.FieldErrorResponse;
import com.example.todo.enums.ErrorCode;
import com.example.todo.enums.TodoStatus;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

	private static final String REQUEST_ID_HEADER = "X-Request-Id";

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<ApiErrorResponse> handleValidation(MethodArgumentNotValidException exception,
			HttpServletRequest request) {
		List<FieldErrorResponse> errors = exception.getBindingResult().getFieldErrors().stream()
				.map(this::toFieldError)
				.toList();
		return problem(ErrorCode.VALIDATION_FAILED, "Request body contains invalid fields", request, errors);
	}

	@ExceptionHandler(ConstraintViolationException.class)
	public ResponseEntity<ApiErrorResponse> handleConstraintViolation(ConstraintViolationException exception,
			HttpServletRequest request) {
		String detail = exception.getConstraintViolations().stream()
				.map(ConstraintViolation::getMessage)
				.findFirst()
				.orElse(ErrorCode.INVALID_REQUEST_PARAMETER.getDefaultDetail());
		return problem(ErrorCode.INVALID_REQUEST_PARAMETER, detail, request, List.of());
	}

	@ExceptionHandler(ApiException.class)
	public ResponseEntity<ApiErrorResponse> handleApiException(ApiException exception, HttpServletRequest request) {
		return problem(exception.getErrorCode(), exception.getMessage(), request, List.of());
	}

	@ExceptionHandler(HttpMessageNotReadableException.class)
	public ResponseEntity<ApiErrorResponse> handleMalformedJson(HttpMessageNotReadableException exception,
			HttpServletRequest request) {
		return problem(ErrorCode.MALFORMED_JSON, ErrorCode.MALFORMED_JSON.getDefaultDetail(), request, List.of());
	}

	@ExceptionHandler(MethodArgumentTypeMismatchException.class)
	public ResponseEntity<ApiErrorResponse> handleTypeMismatch(MethodArgumentTypeMismatchException exception,
			HttpServletRequest request) {
		if (exception.getRequiredType() == TodoStatus.class) {
			return problem(ErrorCode.INVALID_STATUS, ErrorCode.INVALID_STATUS.getDefaultDetail(), request, List.of());
		}
		return problem(ErrorCode.INVALID_REQUEST_PARAMETER, "Request parameter '" + exception.getName() + "' is invalid",
				request, List.of());
	}

	@ExceptionHandler(MissingServletRequestParameterException.class)
	public ResponseEntity<ApiErrorResponse> handleMissingParameter(MissingServletRequestParameterException exception,
			HttpServletRequest request) {
		return problem(ErrorCode.INVALID_REQUEST_PARAMETER,
				"Required request parameter '" + exception.getParameterName() + "' is missing", request, List.of());
	}

	@ExceptionHandler(HttpRequestMethodNotSupportedException.class)
	public ResponseEntity<ApiErrorResponse> handleMethodNotAllowed(HttpRequestMethodNotSupportedException exception,
			HttpServletRequest request) {
		return problem(ErrorCode.METHOD_NOT_ALLOWED, exception.getMessage(), request, List.of());
	}

	@ExceptionHandler(HttpMediaTypeNotSupportedException.class)
	public ResponseEntity<ApiErrorResponse> handleUnsupportedMediaType(HttpMediaTypeNotSupportedException exception,
			HttpServletRequest request) {
		return problem(ErrorCode.UNSUPPORTED_MEDIA_TYPE, exception.getMessage(), request, List.of());
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<ApiErrorResponse> handleUnexpected(Exception exception, HttpServletRequest request) {
		String requestId = requestId(request);
		log.error("Unhandled API error. requestId={}, path={}", requestId, request.getRequestURI(), exception);
		return problem(ErrorCode.INTERNAL_ERROR, ErrorCode.INTERNAL_ERROR.getDefaultDetail(), request, List.of(), requestId);
	}

	private FieldErrorResponse toFieldError(FieldError fieldError) {
		return new FieldErrorResponse(fieldError.getField(), fieldError.getDefaultMessage());
	}

	private ResponseEntity<ApiErrorResponse> problem(ErrorCode errorCode, String detail, HttpServletRequest request,
			List<FieldErrorResponse> errors) {
		return problem(errorCode, detail, request, errors, requestId(request));
	}

	private ResponseEntity<ApiErrorResponse> problem(ErrorCode errorCode, String detail, HttpServletRequest request,
			List<FieldErrorResponse> errors, String requestId) {
		HttpStatus status = errorCode.getStatus();
		ApiErrorResponse response = new ApiErrorResponse(
				errorCode.getTitle(),
				status.value(),
				errorCode.getCode(),
				detail,
				request.getRequestURI(),
				requestId,
				Instant.now(),
				errors);
		return ResponseEntity.status(status)
				.header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_PROBLEM_JSON_VALUE)
				.header(REQUEST_ID_HEADER, requestId)
				.body(response);
	}

	private String requestId(HttpServletRequest request) {
		String requestId = request.getHeader(REQUEST_ID_HEADER);
		if (requestId == null || requestId.isBlank()) {
			return UUID.randomUUID().toString();
		}
		return requestId;
	}
}



