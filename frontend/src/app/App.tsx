import { Toaster } from "sonner";
import { TodoPage } from "@/features/todo/pages/TodoPage";

function App() {
  return (
    <>
      <TodoPage />
      <Toaster position="top-right" closeButton richColors duration={3000} />
    </>
  );
}

export default App;
