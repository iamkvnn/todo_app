import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { type Todo } from '@/types/todo';

interface TodoDialogsProps {
  createOpen: boolean;
  setCreateOpen: (val: boolean) => void;
  editOpen: boolean;
  setEditOpen: (val: boolean) => void;
  deleteOpen: boolean;
  setDeleteOpen: (val: boolean) => void;
  activeTodo: Todo | null;
  titleInput: string;
  setTitleInput: (val: string) => void;
  descInput: string;
  setDescInput: (val: string) => void;
  errors: { title?: string; description?: string };
  handleCreateTodo: (e: React.FormEvent) => void;
  handleUpdateTodo: (e: React.FormEvent) => void;
  handleDeleteTodo: () => void;
}

export function TodoDialogs({
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
  handleCreateTodo,
  handleUpdateTodo,
  handleDeleteTodo,
}: TodoDialogsProps) {
  return (
    <>
      {/* DIALOG: CREATE TODO */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-[425px] sm:max-w-[500px] rounded-2xl bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 p-6">
          <form onSubmit={handleCreateTodo} noValidate>
            <DialogHeader className="mb-4">
              <DialogTitle className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-50">
                Thêm Công Việc Mới
              </DialogTitle>
              <DialogDescription className="text-slate-500 dark:text-slate-400 text-xs">
                Điền thông tin chi tiết cho công việc cần lên kế hoạch của bạn.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <label htmlFor="title" className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Tiêu đề <span className="text-rose-500">*</span>
                </label>
                <Input
                  id="title"
                  placeholder="Ví dụ: Thiết kế giao diện Dashboard"
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  maxLength={255}
                  className={`rounded-xl border-slate-200 dark:border-slate-800 py-5 text-sm transition-all focus-visible:ring-offset-0 ${errors.title
                    ? 'border-rose-500 focus-visible:ring-rose-500 focus-visible:border-rose-500 focus-visible:ring-[3px] focus-visible:ring-rose-500/20'
                    : ''
                    }`}
                />
                <div className="flex justify-between items-start mt-0.5 px-1 min-h-[18px]">
                  {errors.title ? (
                    <span className="text-[11px] text-rose-500 font-semibold leading-tight">{errors.title}</span>
                  ) : (
                    <span />
                  )}
                  <span className="text-[10px] text-slate-400 shrink-0">
                    {titleInput.length}/255 ký tự
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <label htmlFor="description" className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Mô tả chi tiết
                </label>
                <Textarea
                  id="description"
                  placeholder="Ghi chú chi tiết hoặc các bước thực hiện công việc..."
                  value={descInput}
                  onChange={(e) => setDescInput(e.target.value)}
                  maxLength={1000}
                  rows={4}
                  className={`rounded-xl border-slate-200 dark:border-slate-800 text-sm resize-none transition-all focus-visible:ring-offset-0 ${errors.description
                    ? 'border-rose-500 focus-visible:ring-rose-500 focus-visible:border-rose-500 focus-visible:ring-[3px] focus-visible:ring-rose-500/20'
                    : ''
                    }`}
                />
                <div className="flex justify-between items-start mt-0.5 px-1 min-h-[18px]">
                  {errors.description ? (
                    <span className="text-[11px] text-rose-500 font-semibold leading-tight">{errors.description}</span>
                  ) : (
                    <span />
                  )}
                  <span className="text-[10px] text-slate-400 shrink-0">
                    {descInput.length}/1000 ký tự
                  </span>
                </div>
              </div>
            </div>

            <DialogFooter className="mt-8 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreateOpen(false)}
                className="rounded-xl text-xs font-semibold px-4 cursor-pointer"
              >
                Hủy bỏ
              </Button>
              <Button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold px-4 cursor-pointer"
              >
                Thêm mới
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DIALOG: EDIT TODO */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-[425px] sm:max-w-[500px] rounded-2xl bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 p-6">
          <form onSubmit={handleUpdateTodo} noValidate>
            <DialogHeader className="mb-4">
              <DialogTitle className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-50">
                Chỉnh Sửa Công Việc
              </DialogTitle>
              <DialogDescription className="text-slate-500 dark:text-slate-400 text-xs">
                Cập nhật tiêu đề hoặc mô tả công việc hiện tại.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <label htmlFor="edit-title" className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Tiêu đề <span className="text-rose-500">*</span>
                </label>
                <Input
                  id="edit-title"
                  placeholder="Ví dụ: Thiết kế giao diện Dashboard"
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  maxLength={255}
                  className={`rounded-xl border-slate-200 dark:border-slate-800 py-5 text-sm transition-all focus-visible:ring-offset-0 ${errors.title
                    ? 'border-rose-500 focus-visible:ring-rose-500 focus-visible:border-rose-500 focus-visible:ring-[3px] focus-visible:ring-rose-500/20'
                    : ''
                    }`}
                />
                <div className="flex justify-between items-start mt-0.5 px-1 min-h-[18px]">
                  {errors.title ? (
                    <span className="text-[11px] text-rose-500 font-semibold leading-tight">{errors.title}</span>
                  ) : (
                    <span />
                  )}
                  <span className="text-[10px] text-slate-400 shrink-0">
                    {titleInput.length}/255 ký tự
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <label htmlFor="edit-description" className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Mô tả chi tiết
                </label>
                <Textarea
                  id="edit-description"
                  placeholder="Ghi chú chi tiết hoặc các bước thực hiện công việc..."
                  value={descInput}
                  onChange={(e) => setDescInput(e.target.value)}
                  maxLength={1000}
                  rows={4}
                  className={`rounded-xl border-slate-200 dark:border-slate-800 text-sm resize-none transition-all focus-visible:ring-offset-0 ${errors.description
                    ? 'border-rose-500 focus-visible:ring-rose-500 focus-visible:border-rose-500 focus-visible:ring-[3px] focus-visible:ring-rose-500/20'
                    : ''
                    }`}
                />
                <div className="flex justify-between items-start mt-0.5 px-1 min-h-[18px]">
                  {errors.description ? (
                    <span className="text-[11px] text-rose-500 font-semibold leading-tight">{errors.description}</span>
                  ) : (
                    <span />
                  )}
                  <span className="text-[10px] text-slate-400 shrink-0">
                    {descInput.length}/1000 ký tự
                  </span>
                </div>
              </div>
            </div>

            <DialogFooter className="mt-8 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditOpen(false)}
                className="rounded-xl text-xs font-semibold px-4 cursor-pointer"
              >
                Hủy bỏ
              </Button>
              <Button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold px-4 cursor-pointer"
              >
                Lưu thay đổi
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DIALOG: CONFIRM DELETE */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="max-w-[380px] rounded-2xl bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 p-6">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-lg font-bold tracking-tight text-slate-800 dark:text-slate-50">
              Xác Nhận Xóa Công Việc?
            </DialogTitle>
            <DialogDescription className="text-slate-500 dark:text-slate-400 text-xs">
              Bạn có chắc chắn muốn xóa công việc này? Hành động này sẽ không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>

          {activeTodo && (
            <div className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-xl mb-4 text-sm">
              <p className="font-bold text-slate-800 dark:text-slate-200 truncate">
                {activeTodo.title}
              </p>
              {activeTodo.description && (
                <p className="text-xs text-slate-400 mt-1 truncate">
                  {activeTodo.description}
                </p>
              )}
            </div>
          )}

          <DialogFooter className="mt-6 flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteOpen(false)}
              className="rounded-xl text-xs font-semibold px-4 cursor-pointer"
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteTodo}
              className="bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold px-4 cursor-pointer"
            >
              Đồng ý xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
