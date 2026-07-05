package com.example.todo.controller;

import static org.hamcrest.Matchers.contains;
import static org.hamcrest.Matchers.empty;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.not;
import static org.hamcrest.Matchers.emptyString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.example.todo.entity.Todo;
import com.example.todo.enums.TodoStatus;
import com.example.todo.repository.TodoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class TodoControllerTest {

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private TodoRepository todoRepository;

	@BeforeEach
	void setUp() {
		todoRepository.deleteAll();
	}

	@Test
	void createsGetsUpdatesCompletesAndDeletesTodo() throws Exception {
		String createdLocation = mockMvc.perform(post("/api/todos")
						.contentType(MediaType.APPLICATION_JSON)
						.content("""
								{"title":" Write tests ","description":" Cover API "}
								"""))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.data.title").value("Write tests"))
				.andExpect(jsonPath("$.data.description").value("Cover API"))
				.andExpect(jsonPath("$.data.status").value("active"))
				.andReturn()
				.getResponse()
				.getContentAsString();

		Long id = extractId(createdLocation);

		mockMvc.perform(get("/api/todos/{id}", id))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.data.title").value("Write tests"));

		mockMvc.perform(put("/api/todos/{id}", id)
						.contentType(MediaType.APPLICATION_JSON)
						.content("""
								{"title":"Updated","description":"Updated description"}
								"""))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.data.title").value("Updated"));

		mockMvc.perform(patch("/api/todos/{id}/completion", id)
						.contentType(MediaType.APPLICATION_JSON)
						.content("""
								{"completed":true}
								"""))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.data.status").value("completed"));

		mockMvc.perform(delete("/api/todos/{id}", id))
				.andExpect(status().isNoContent());

		mockMvc.perform(get("/api/todos/{id}", id))
				.andExpect(status().isNotFound())
				.andExpect(content().contentType(MediaType.APPLICATION_PROBLEM_JSON))
				.andExpect(jsonPath("$.status").value(404))
				.andExpect(jsonPath("$.errorCode").value("RESOURCE_NOT_FOUND"))
				.andExpect(jsonPath("$.requestId", not(emptyString())));
	}

	@Test
	void listsTodosWithSearchFilterPaginationAndDynamicSort() throws Exception {
		save("Write tests", "Backend quality", false);
		save("Deploy API", "Release checklist", true);
		save("Review tests", "Search behavior", false);

		mockMvc.perform(get("/api/todos")
						.param("status", "active")
						.param("q", "tests")
						.param("page", "1")
						.param("size", "1")
						.param("sort", "title:desc"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.data", hasSize(1)))
				.andExpect(jsonPath("$.data[0].title").value("Write tests"))
				.andExpect(jsonPath("$.meta.page").value(1))
				.andExpect(jsonPath("$.meta.size").value(1))
				.andExpect(jsonPath("$.meta.totalElements").value(2))
				.andExpect(jsonPath("$.meta.totalPages").value(2))
				.andExpect(jsonPath("$.meta.sort", contains("title:desc")));
	}

	@Test
	void doesNotApplyDefaultSortWhenSortIsMissing() throws Exception {
		save("Beta", "Task", false);
		save("Alpha", "Task", true);

		mockMvc.perform(get("/api/todos"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.meta.sort", empty()));
	}
	@Test
	void supportsMultipleSortFields() throws Exception {
		save("Beta", "Task", false);
		save("Alpha", "Task", true);
		save("Gamma", "Task", false);

		mockMvc.perform(get("/api/todos")
						.param("sort", "status:asc")
						.param("sort", "title:asc"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.data[0].title").value("Beta"))
				.andExpect(jsonPath("$.data[1].title").value("Gamma"))
				.andExpect(jsonPath("$.data[2].title").value("Alpha"))
				.andExpect(jsonPath("$.meta.sort", contains("status:asc", "title:asc")));
	}

	@Test
	void returnsProblemDetailsForValidationErrors() throws Exception {
		mockMvc.perform(post("/api/todos")
						.contentType(MediaType.APPLICATION_JSON)
						.content("""
								{"title":"   ","description":"Invalid"}
								"""))
				.andExpect(status().isBadRequest())
				.andExpect(content().contentType(MediaType.APPLICATION_PROBLEM_JSON))
				.andExpect(jsonPath("$.title").value("Validation failed"))
				.andExpect(jsonPath("$.errorCode").value("VALIDATION_FAILED"))
				.andExpect(jsonPath("$.errors[*].field", hasItem("title")));
	}

	@Test
	void returnsProblemDetailsForInvalidQueryParamsAndMalformedJson() throws Exception {
		mockMvc.perform(get("/api/todos").param("sort", "priority:asc"))
				.andExpect(status().isBadRequest())
				.andExpect(content().contentType(MediaType.APPLICATION_PROBLEM_JSON))
				.andExpect(jsonPath("$.errorCode").value("INVALID_SORT"))
				.andExpect(jsonPath("$.detail").value("Sort field must be one of: id, title, status, createdAt, updatedAt"));

		mockMvc.perform(get("/api/todos").param("page", "0"))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.errorCode").value("INVALID_REQUEST_PARAMETER"))
				.andExpect(jsonPath("$.detail").value("Page must be greater than or equal to 1"));

		mockMvc.perform(get("/api/todos").param("status", "invalid"))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.errorCode").value("INVALID_STATUS"))
				.andExpect(jsonPath("$.detail").value("Status must be one of: active, completed"));

		mockMvc.perform(post("/api/todos")
						.contentType(MediaType.APPLICATION_JSON)
						.content("{bad json"))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.errorCode").value("MALFORMED_JSON"))
				.andExpect(jsonPath("$.detail").value("Request body is malformed or unreadable"));
	}

	@Test
	void returnsProblemDetailsForMethodAndMediaTypeErrors() throws Exception {
		mockMvc.perform(patch("/api/todos"))
				.andExpect(status().isMethodNotAllowed())
				.andExpect(content().contentType(MediaType.APPLICATION_PROBLEM_JSON))
				.andExpect(jsonPath("$.errorCode").value("METHOD_NOT_ALLOWED"));

		mockMvc.perform(post("/api/todos")
						.contentType(MediaType.TEXT_PLAIN)
						.content("title=Task"))
				.andExpect(status().isUnsupportedMediaType())
				.andExpect(content().contentType(MediaType.APPLICATION_PROBLEM_JSON))
				.andExpect(jsonPath("$.errorCode").value("UNSUPPORTED_MEDIA_TYPE"));
	}

	private void save(String title, String description, boolean completed) {
		Todo todo = Todo.builder().title(title).description(description).build();
		todo.setStatus(completed ? TodoStatus.completed : TodoStatus.active);
		todoRepository.save(todo);
	}

	private Long extractId(String json) {
		String marker = "\"id\":";
		int start = json.indexOf(marker) + marker.length();
		int end = json.indexOf(",", start);
		return Long.parseLong(json.substring(start, end));
	}
}







