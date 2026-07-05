import { toast } from 'sonner';
import { ApiError } from '@/services/todo';

export const errorHandler = {
  handle(error: unknown, fallbackMessage = 'Đã xảy ra lỗi hệ thống') {
    console.error(error);

    if (error instanceof ApiError) {
      // If validation error list is present
      if (error.errors && error.errors.length > 0) {
        const errorMsg = error.errors.map(e => `${e.field}: ${e.message}`).join(', ');
        toast.error(`${error.title}: ${errorMsg}`);
        return;
      }
      toast.error(error.detail || error.title || fallbackMessage);
      return;
    }

    if (error instanceof Error) {
      toast.error(error.message);
      return;
    }

    toast.error(fallbackMessage);
  }
};
