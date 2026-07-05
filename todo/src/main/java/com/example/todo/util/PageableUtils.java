package com.example.todo.util;

import com.example.todo.exception.BadRequestException;
import com.example.todo.enums.ErrorCode;
import java.util.Locale;
import java.util.Collection;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public final class PageableUtils {

	public static Pageable fromOneBased(
			int page,
			int size,
			String[] sortParams,
			Collection<String> allowedSortFields) {
		return PageRequest.of(page - 1, size, normalizeSort(sortParams, allowedSortFields));
	}

	private static Sort normalizeSort(
			String[] sortParams,
			Collection<String> allowedSortFields) {
		if (sortParams == null || sortParams.length == 0) {
			return Sort.unsorted();
		}

		Sort sort = Sort.unsorted();
		for (String sortParam : sortParams) {
			if (sortParam == null || sortParam.isBlank()) {
				throw new BadRequestException(ErrorCode.INVALID_SORT, "Sort must use format field:direction");
			}

			String[] parts = sortParam.split(":");
			if (parts.length != 2) {
				throw new BadRequestException(ErrorCode.INVALID_SORT, "Sort must use format field:direction");
			}

			String field = parts[0].trim();
			String direction = parts[1].trim().toLowerCase(Locale.ROOT);
			if (!allowedSortFields.contains(field)) {
				throw new BadRequestException(ErrorCode.INVALID_SORT,
					"Sort field must be one of: " + String.join(", ", allowedSortFields));
			}
			if (!direction.equals("asc") && !direction.equals("desc")) {
				throw new BadRequestException(ErrorCode.INVALID_SORT, "Sort direction must be asc or desc");
			}

			sort = sort.and(Sort.by(Sort.Direction.fromString(direction), field));
		}
		return sort;
	}
}




