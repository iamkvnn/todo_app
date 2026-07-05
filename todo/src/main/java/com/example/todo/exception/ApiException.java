package com.example.todo.exception;

import com.example.todo.enums.ErrorCode;
import lombok.Getter;

@Getter
public class ApiException extends RuntimeException {

	private final ErrorCode errorCode;

	public ApiException(ErrorCode errorCode) {
		this(errorCode, errorCode.getDefaultDetail());
	}

	public ApiException(ErrorCode errorCode, String detail) {
		super(detail);
		this.errorCode = errorCode;
	}
}
