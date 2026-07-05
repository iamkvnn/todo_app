package com.example.todo.exception;

import com.example.todo.enums.ErrorCode;

public class BadRequestException extends ApiException {

	public BadRequestException(ErrorCode errorCode, String message) {
		super(errorCode, message);
	}

	public BadRequestException(String message) {
		this(ErrorCode.INVALID_REQUEST, message);
	}
}
