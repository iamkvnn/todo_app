import { Trash2, Edit3, Calendar, Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { type Todo } from '@/types/todo';

interface TodoCardProps {
  todo: Todo;
  handleToggleCompletion: (todo: Todo) => void;
  openEditDialog: (todo: Todo) => void;
  openDeleteDialog: (todo: Todo) => void;
}

export function TodoCard({
  todo,
  handleToggleCompletion,
  openEditDialog,
  openDeleteDialog,
}: TodoCardProps) {
  const isCompleted = todo.status === 'completed';

  // Format Date Helper
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div
      className={`group flex items-start justify-between border rounded-2xl p-4 transition-all duration-300 hover:shadow-md ${isCompleted
          ? 'border-emerald-200 bg-emerald-50/15 border-l-4 border-l-emerald-500'
          : 'border-slate-100 hover:border-slate-200 border-l-4 border-l-transparent bg-white'
        }`}
    >
      <div className="flex items-start gap-4 flex-1 min-w-0 pr-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">

            {/* Title */}
            <h4 className={`text-base font-semibold tracking-tight transition-all truncate text-slate-800 dark:text-slate-100 ${isCompleted ? 'line-through text-slate-400 dark:text-slate-600' : ''
              }`}>
              {todo.title}
            </h4>

            {/* Status Badges */}
            {isCompleted ? (
              <Badge className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50 hover:bg-emerald-50 rounded-lg text-xs font-semibold py-0.5 px-2">
                Hoàn thành
              </Badge>
            ) : (
              <Badge className="bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50 hover:bg-amber-50 rounded-lg text-xs font-semibold py-0.5 px-2">
                Đang chờ
              </Badge>
            )}
          </div>

          {/* Description */}
          {todo.description && (
            <p className={`text-sm text-slate-600 dark:text-slate-400 whitespace-pre-line leading-relaxed mb-2 break-words ${isCompleted ? 'line-through text-slate-400/80 dark:text-slate-600/80' : ''
              }`}>
              {todo.description}
            </p>
          )}

          {/* Meta Dates */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 font-medium">
            <Calendar className="size-3.5" />
            <span>
              Tạo lúc: {formatDate(todo.createdAt)}
            </span>
            {todo.updatedAt !== todo.createdAt && (
              <>
                <span className="mx-1">•</span>
                <span>Cập nhật: {formatDate(todo.updatedAt)}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Actions (Always visible toggle + always visible actions to keep layout stable) */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Toggle Button */}
        <div className="shrink-0">
          {isCompleted ? (
            <Button
              size="sm"
              onClick={() => handleToggleCompletion(todo)}
              className="h-8 w-[110px] justify-center rounded-xl text-xs font-bold px-3 bg-emerald-500 hover:bg-emerald-600 text-white flex items-center gap-1 shadow-sm shadow-emerald-500/15 cursor-pointer"
            >
              <Check className="size-3.5 stroke-[3]" /> Đã xong
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleToggleCompletion(todo)}
              className="h-8 w-[110px] justify-center rounded-xl text-xs font-bold px-3 border-slate-200 hover:border-indigo-500 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/20 flex items-center gap-1 cursor-pointer"
            >
              <Check className="size-3.5 text-slate-400" /> Hoàn thành
            </Button>
          )}
        </div>

        {/* Edit and Delete Buttons */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => openEditDialog(todo)}
            title="Chỉnh sửa công việc"
            className="size-9 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            <Edit3 className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => openDeleteDialog(todo)}
            title="Xóa công việc"
            className="size-9 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
