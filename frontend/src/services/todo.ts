import { client, ApiError } from '@/lib/api';
import {
  type ApiResponse,
  type Todo,
  type PaginatedApiResponse,
  type ListTodosParams,
  type CreateTodoRequest,
  type UpdateTodoRequest
} from '@/types/todo';

export { ApiError };

export const todoApi = {
  async listTodos(params: ListTodosParams = {}): Promise<PaginatedApiResponse<Todo>> {
    const queryParams: Record<string, any> = {};
    if (params.status) {
      queryParams.status = params.status;
    }
    if (params.q) {
      queryParams.q = params.q;
    }
    if (params.page !== undefined) {
      queryParams.page = params.page;
    }
    if (params.size !== undefined) {
      queryParams.size = params.size;
    }

    // Spring Boot supports sort=createdAt,desc&sort=title,asc
    const searchParams = new URLSearchParams();
    Object.entries(queryParams).forEach(([key, val]) => {
      searchParams.set(key, val.toString());
    });
    if (params.sort && params.sort.length > 0) {
      params.sort.forEach((sortVal) => {
        searchParams.append('sort', sortVal);
      });
    }

    const response = await client.get<PaginatedApiResponse<Todo>>('/api/todos', {
      params: searchParams
    });
    return response.data;
  },

  async getTodo(id: number): Promise<Todo> {
    const response = await client.get<ApiResponse<Todo>>(`/api/todos/${id}`);
    return response.data.data;
  },

  async createTodo(request: CreateTodoRequest): Promise<Todo> {
    const response = await client.post<ApiResponse<Todo>>('/api/todos', request);
    return response.data.data;
  },

  async updateTodo(id: number, request: UpdateTodoRequest): Promise<Todo> {
    const response = await client.put<ApiResponse<Todo>>(`/api/todos/${id}`, request);
    return response.data.data;
  },

  async updateCompletion(id: number, completed: boolean): Promise<Todo> {
    const response = await client.patch<ApiResponse<Todo>>(`/api/todos/${id}/completion`, { completed });
    return response.data.data;
  },

  async deleteTodo(id: number): Promise<void> {
    await client.delete(`/api/todos/${id}`);
  },
};