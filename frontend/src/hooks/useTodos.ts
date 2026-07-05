import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';
import { todoApi, ApiError } from '@/services/todo';
import { type Todo } from '@/types/todo';

export const todoSchema = z.object({
  title: z.string()
    .trim()
    .min(1, { message: 'Tiêu đề không được để trống' })
    .max(255, { message: 'Tiêu đề không được vượt quá 255 ký tự' }),
  description: z.string()
    .trim()
    .max(1000, { message: 'Mô tả không được vượt quá 1000 ký tự' })
    .optional()
    .or(z.literal('')),
});

export function useTodos() {
  // App States
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'active' | 'completed' | undefined>(undefined);
  const [sortBy, setSortBy] = useState<string>('createdAt:desc');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [pageSize] = useState<number>(5);

  // Dialog States
  const [createOpen, setCreateOpen] = useState<boolean>(false);
  const [editOpen, setEditOpen] = useState<boolean>(false);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [activeTodo, setActiveTodo] = useState<Todo | null>(null);

  // Form States
  const [titleInput, setTitleInput] = useState<string>('');
  const [descInput, setDescInput] = useState<string>('');
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({});

  // Handle Search Debouncing
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset page on search change
    }, 450);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  // Fetch Todo List Data
  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await todoApi.listTodos({
        status: statusFilter,
        q: debouncedSearch || undefined,
        page,
        size: pageSize,
        sort: [sortBy]
      });
      setTodos(response.data);
      setTotalPages(response.meta.totalPages);
      setTotalElements(response.meta.totalElements);
    } catch (error) {
      const err = error as ApiError;
      toast.error(`Không thể tải danh sách công việc: ${err.message || 'Lỗi không xác định'}`);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all data
  const refreshData = () => {
    fetchTodos();
  };

  // Refresh whenever query dependencies change
  useEffect(() => {
    fetchTodos();
  }, [statusFilter, debouncedSearch, sortBy, page]);

  // Action: Toggle Completion
  const handleToggleCompletion = async (todo: Todo) => {
    const originalStatus = todo.status;
    const targetStatus = originalStatus === 'completed' ? 'active' : 'completed';

    // Optimistic UI Update
    setTodos(prev => prev.map(t => t.id === todo.id ? { ...t, status: targetStatus } : t));

    try {
      await todoApi.updateCompletion(todo.id, targetStatus === 'completed');
      toast.success(targetStatus === 'completed' ? 'Đã hoàn thành công việc 🎉' : 'Đã mở lại công việc ⚙️');
    } catch (error) {
      // Revert Optimistic UI Update
      setTodos(prev => prev.map(t => t.id === todo.id ? { ...t, status: originalStatus } : t));
      const err = error as ApiError;
      toast.error(`Lỗi: ${err.message || 'Không thể cập nhật trạng thái'}`);
    }
  };

  // Action: Open Create Dialog
  const openCreateDialog = () => {
    setTitleInput('');
    setDescInput('');
    setErrors({});
    setCreateOpen(true);
  };

  // Action: Create Todo
  const handleCreateTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = todoSchema.safeParse({
      title: titleInput,
      description: descInput,
    });

    if (!result.success) {
      const fieldErrors: { title?: string; description?: string } = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as 'title' | 'description';
        if (path) {
          fieldErrors[path] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      await todoApi.createTodo({
        title: result.data.title,
        description: result.data.description || undefined
      });

      toast.success('Thêm công việc thành công ✨');
      setCreateOpen(false);
      setTitleInput('');
      setDescInput('');
      setErrors({});

      // Reset filter to see the new item
      setStatusFilter(undefined);
      setPage(1);
      refreshData();
    } catch (error) {
      const err = error as ApiError;
      toast.error(`Thêm thất bại: ${err.message || 'Lỗi không xác định'}`);
    }
  };

  // Action: Open Edit Dialog
  const openEditDialog = (todo: Todo) => {
    setActiveTodo(todo);
    setTitleInput(todo.title);
    setDescInput(todo.description || '');
    setErrors({});
    setEditOpen(true);
  };

  // Action: Update Todo
  const handleUpdateTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTodo) return;
    setErrors({});

    const result = todoSchema.safeParse({
      title: titleInput,
      description: descInput,
    });

    if (!result.success) {
      const fieldErrors: { title?: string; description?: string } = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as 'title' | 'description';
        if (path) {
          fieldErrors[path] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      await todoApi.updateTodo(activeTodo.id, {
        title: result.data.title,
        description: result.data.description || undefined
      });

      toast.success('Cập nhật công việc thành công 📝');
      setEditOpen(false);
      setTitleInput('');
      setDescInput('');
      setActiveTodo(null);
      setErrors({});
      refreshData();
    } catch (error) {
      const err = error as ApiError;
      toast.error(`Cập nhật thất bại: ${err.message || 'Lỗi không xác định'}`);
    }
  };

  // Action: Open Delete Dialog
  const openDeleteDialog = (todo: Todo) => {
    setActiveTodo(todo);
    setDeleteOpen(true);
  };

  // Action: Delete Todo
  const handleDeleteTodo = async () => {
    if (!activeTodo) return;
    try {
      await todoApi.deleteTodo(activeTodo.id);
      toast.success('Đã xóa công việc 🗑️');
      setDeleteOpen(false);
      setActiveTodo(null);

      // If we deleted the last item on the page, go to previous page
      if (todos.length === 1 && page > 1) {
        setPage(prev => prev - 1);
      } else {
        refreshData();
      }
    } catch (error) {
      const err = error as ApiError;
      toast.error(`Xóa thất bại: ${err.message || 'Lỗi không xác định'}`);
    }
  };

  return {
    todos,
    loading,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    page,
    setPage,
    totalPages,
    totalElements,
    pageSize,
    createOpen,
    setCreateOpen,
    editOpen,
    setEditOpen,
    deleteOpen,
    setDeleteOpen,
    activeTodo,
    setActiveTodo,
    titleInput,
    setTitleInput,
    descInput,
    setDescInput,
    errors,
    setErrors,
    refreshData,
    handleToggleCompletion,
    openCreateDialog,
    handleCreateTodo,
    openEditDialog,
    handleUpdateTodo,
    openDeleteDialog,
    handleDeleteTodo,
  };
}
