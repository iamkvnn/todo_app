export interface Todo {
  id: number;
  title: string;
  description: string;
  status: 'active' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  data: T;
}

export interface PaginationMeta {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  sort: string[];
}

export interface PaginatedApiResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface ListTodosParams {
  status?: 'active' | 'completed';
  q?: string;
  page?: number; // 1-based
  size?: number;
  sort?: string[]; // e.g. ["createdAt:desc", "title:asc"]
}

export interface CreateTodoRequest {
  title: string;
  description?: string;
}

export interface UpdateTodoRequest {
  title: string;
  description?: string;
}