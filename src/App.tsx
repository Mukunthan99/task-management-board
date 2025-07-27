import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";
import TaskBoard from "./components/TaskBoard";

function App() {
  const queryClient = new QueryClient();
  return (
      <QueryClientProvider client={queryClient}>
        <TaskBoard />
      </QueryClientProvider>
  );
}

export default App;
