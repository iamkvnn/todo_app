package com.example.todo.exception;

import com.example.todo.enums.ErrorCode;

public class ResourceNotFoundException extends ApiException {

	public ResourceNotFoundException(String message) {
		super(ErrorCode.RESOURCE_NOT_FOUND, message);
	}
}
