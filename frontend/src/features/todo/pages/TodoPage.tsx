import {
  CheckCircle,
  RefreshCw,
  Inbox,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { useTodos } from '@/hooks/useTodos';
import { ControlPanel } from '../components/ControlPanel';
import { TodoCard } from '../components/TodoCard';
import { TodoDialogs } from '../components/TodoDialogs';

export function TodoPage() {
  const {
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
    createOpen,
    setCreateOpen,
    editOpen,
    setEditOpen,
    deleteOpen,
    setDeleteOpen,
    activeTodo,
    titleInput,
    setTitleInput,
    descInput,
    setDescInput,
    errors,
    refreshData,
    handleToggleCompletion,
    openCreateDialog,
    handleCreateTodo,
    openEditDialog,
    handleUpdateTodo,
    openDeleteDialog,
    handleDeleteTodo,
  } = useTodos();



  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8 max-w-5xl">

        {/* HEADER BAR */}
        <header className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 dark:bg-indigo-500 text-white p-2.5 rounded-xl shadow-lg shadow-indigo-500/25">
              <CheckCircle className="size-6 animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 to-violet-500 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">
                Todo Management
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Hệ thống quản lý công việc
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={refreshData}
              disabled={loading}
              title="Tải lại dữ liệu"
              className="rounded-xl"
            >
              <RefreshCw className={`size-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </header>

        {/* CONTROLS COMPONENT */}
        <ControlPanel
          search={search}
          setSearch={setSearch}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
          setPage={setPage}
          openCreateDialog={openCreateDialog}
        />

        {/* TODO LIST SECTION */}
        <section className="space-y-3">
          {loading ? (
            // Skeleton Loading State
            <div className="space-y-3">
              {[...Array(3)].map((_, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 animate-pulse flex items-center justify-between">
                  <div className="flex items-center gap-4 w-3/4">
                    <div className="size-6 bg-slate-200 dark:bg-slate-800 rounded-full shrink-0"></div>
                    <div className="space-y-2 w-full">
                      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
                      <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-2/3"></div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="size-9 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
                    <div className="size-9 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : todos.length === 0 ? (
            // Empty State
            <Card className="border border-dashed border-slate-300 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 py-12">
              <CardContent className="flex flex-col items-center justify-center text-center">
                <div className="bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 p-4 rounded-full mb-4">
                  <Inbox className="size-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Không có công việc nào</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mt-1">
                  {search
                    ? `Không tìm thấy kết quả phù hợp với từ khóa "${search}". Thử từ khóa khác xem sao!`
                    : statusFilter !== undefined
                      ? `Không tìm thấy công việc nào trong danh mục này.`
                      : 'Bắt đầu ngày mới bằng việc tạo công việc cần làm ngay thôi nào!'
                  }
                </p>
                {!search && statusFilter === undefined && (
                  <Button
                    onClick={openCreateDialog}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-md mt-4 font-medium"
                  >
                    Tạo công việc đầu tiên
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            // Map items to TodoCard
            todos.map((todo) => (
              <TodoCard
                key={todo.id}
                todo={todo}
                handleToggleCompletion={handleToggleCompletion}
                openEditDialog={openEditDialog}
                openDeleteDialog={openDeleteDialog}
              />
            ))
          )}
        </section>

        {/* PAGINATION */}
        {!loading && totalPages > 1 && (
          <footer className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 py-4 border-t border-slate-200 dark:border-slate-800">
            <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
              Hiển thị trang {page} trên {totalPages} (Tổng số {totalElements} công việc)
            </div>

            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-lg text-xs font-semibold px-3 h-8"
              >
                <ChevronLeft className="size-3.5 mr-1" /> Trước
              </Button>

              <div className="flex items-center gap-1 mx-2">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`size-8 rounded-lg text-xs font-bold transition-all ${page === i + 1
                      ? 'bg-indigo-600 text-white shadow shadow-indigo-600/25'
                      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                      }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="rounded-lg text-xs font-semibold px-3 h-8"
              >
                Sau <ChevronRight className="size-3.5 ml-1" />
              </Button>
            </div>
          </footer>
        )}

      </div>

      {/* DIALOG MODALS COMPONENT */}
      <TodoDialogs
        createOpen={createOpen}
        setCreateOpen={setCreateOpen}
        editOpen={editOpen}
        setEditOpen={setEditOpen}
        deleteOpen={deleteOpen}
        setDeleteOpen={setDeleteOpen}
        activeTodo={activeTodo}
        titleInput={titleInput}
        setTitleInput={setTitleInput}
        descInput={descInput}
        setDescInput={setDescInput}
        errors={errors}
        handleCreateTodo={handleCreateTodo}
        handleUpdateTodo={handleUpdateTodo}
        handleDeleteTodo={handleDeleteTodo}
      />
    </div>
  );
}
