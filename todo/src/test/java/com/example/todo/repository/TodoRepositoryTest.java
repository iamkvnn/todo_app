package com.example.todo.repository;

import static org.assertj.core.api.Assertions.assertThat;

import com.example.todo.entity.Todo;
import com.example.todo.enums.TodoStatus;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.test.context.ActiveProfiles;

@DataJpaTest
@ActiveProfiles("test")
class TodoRepositoryTest {

	@Autowired
	private TodoRepository todoRepository;

	@Test
	void findsTodosBySearchStatusPaginationAndSort() {
		Todo writeTests = Todo.builder().title("Write tests").description("Cover repository behavior").build();
		Todo reviewDocs = Todo.builder().title("Review docs").description("Documentation task").build();
		Todo deployApi = Todo.builder().title("Deploy API").description("Production checklist").build();
		deployApi.setStatus(TodoStatus.completed);
		todoRepository.save(writeTests);
		todoRepository.save(reviewDocs);
		todoRepository.save(deployApi);

		Specification<Todo> specification = TodoSpecifications.matchesStatus(TodoStatus.active)
				.and(TodoSpecifications.containsKeyword("task"));
		Page<Todo> page = todoRepository.findAll(specification,
				PageRequest.of(0, 10, Sort.by(Sort.Direction.ASC, "title")));

		assertThat(page.getTotalElements()).isEqualTo(1);
		assertThat(page.getContent()).extracting(Todo::getTitle).containsExactly("Review docs");
	}
}
