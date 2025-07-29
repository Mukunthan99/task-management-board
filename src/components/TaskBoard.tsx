import { useState } from "react";
import { useDebounce } from "../hooks/useDebounce";
import type { Task } from "../types/task";
import Column from "./Column";
import TaskModal from "./TaskModal";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { IoCreateOutline } from "react-icons/io5";
import {
  DndContext,
  closestCorners,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import Header from "./Header";

function TaskBoard() {
  const TASKS_KEY = "task_board_tasks";
  // States for task editing and modal
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  //Seach implementation with custom hook to avoid excessive re-renders
  const debouncedSearch = useDebounce(searchTerm, 300);

  //DnD setup using DndKit
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor,  {
      activationConstraint: {
        delay: 150,
        tolerance: 5,
      }
    }));

  // Handle drag end event to update task status or reorder tasks
  const handleDragEnd = (event: DragEndEvent) => {
    // If no active or over element, or if they are the same, do nothing
    const { active, over } = event;
    if (!active || !over || active.id === over.id) return;

    const activeTask = tasks.find((t) => t.id === active.id);
    const overTask = tasks.find((t) => t.id === over.id);
    if (!activeTask) return;

    const newColumnId = overTask?.status || over.data?.current?.columnId;
    if (!newColumnId) return;

    if (newColumnId === activeTask.status) {
      const sameColumnTasks = tasks
        .filter((task) => task.status === activeTask.status)
        .sort((a, b) => a.id.localeCompare(b.id));

      const oldIndex = sameColumnTasks.findIndex((t) => t.id === active.id);
      const newIndex = sameColumnTasks.findIndex((t) => t.id === over.id);

      const reordered = arrayMove(sameColumnTasks, oldIndex, newIndex);

      // Map the reordered tasks back to the original tasks array
      const reorderedTasks = tasks.map((task) => {
        const updated = reordered.find((r) => r.id === task.id);
        return updated ? updated : task;
      });

      // Update the tasks with the reordered list
      mutation.mutate(reorderedTasks);
      return;
    }

    // If the task is dropped in a different column, update its status
    const updatedTask = { ...activeTask, status: newColumnId };
    const updatedTasks = tasks.map((task) =>
      task.id === activeTask.id ? updatedTask : task
    );

    // Update the task in the mutation
    mutation.mutate(updatedTasks);
  };

  // Function to handle task editing
  const handleEdit = (task: Task) => {
    setTaskToEdit(task);
    setModalOpen(true);
  };

  // Function to open the modal for creating a new task
  const openCreateModal = () => {
    setTaskToEdit(null);
    setModalOpen(true);
  };

  // Function to close the modal
  const handleClose = () => {
    setModalOpen(false);
    setTaskToEdit(null);
  };

  // Query client for managing cache
  const queryClient = useQueryClient();

  // Simulate API delay for local storage operations
  function simulateApiDelay<T>(result: T): Promise<T> {
    return new Promise((resolve) => setTimeout(() => resolve(result), 300));
  }

  const loadTasks = async (): Promise<Task[]> => {
    const data = localStorage.getItem(TASKS_KEY);
    return simulateApiDelay(data ? JSON.parse(data) : []);
  };

  const saveTasks = async (tasks: Task[]) => {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    return simulateApiDelay(true);
  };

  const deleteTask = async (id: string) => {
    const existing = JSON.parse(localStorage.getItem(TASKS_KEY) || "[]");
    const updated = existing.filter((task: Task) => task.id !== id);
    localStorage.setItem(TASKS_KEY, JSON.stringify(updated));
    return id;
  };

  // Fetch tasks from local storage using React Query to manage state and cache
  const { data: tasks = [] } = useQuery<Task[]>({
    queryKey: ["tasks"],
    queryFn: loadTasks,
  });

  // Mutation for saving tasks
  const mutation = useMutation({
    mutationFn: saveTasks,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  // Mutation for deleting tasks
  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  // Filter tasks based on the search term using debounced value
  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col gap-4 bg-gray-100 p-4 sm:p-6 overflow-x-hidden">
  <Header />

  {/* Create task and search task section */}
  <div className="flex flex-col items-center gap-4 w-full">
    <button
      onClick={openCreateModal}
      type="button"
      className="w-full sm:w-auto px-6 py-3.5 flex justify-center gap-2 font-bold text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center"
    >
      <IoCreateOutline size={25} /> <span>Create Task</span>
    </button>

    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search by title..."
      className="sm:w-1/2 w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 placeholder:gray-400 placeholder:text-base"
      
    />
  </div>

  {/* Columns section */}
  <DndContext
    sensors={sensors}
    collisionDetection={closestCorners}
    onDragEnd={handleDragEnd}
  >
    <div className="columnContainer h-full flex flex-col sm:flex-row flex-1 gap-4 sm:gap-6 overflow-x-auto pb-4">
      {["Todo", "In Progress", "Completed"].map((status) => (
        <SortableContext
          key={status}
          items={filteredTasks
            .filter((t) => t.status === status)
            .map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          <Column
            title={status}
            tasks={filteredTasks.filter((t) => t.status === status)}
            deleteMutation={deleteMutation}
            handleEdit={handleEdit}
          />
        </SortableContext>
      ))}
    </div>
  </DndContext>

  {/* Modal */}
  <TaskModal
    open={modalOpen}
    onClose={handleClose}
    taskToEdit={taskToEdit}
    tasks={tasks}
    mutation={mutation}
  />
</div>

  );
}

export default TaskBoard;
