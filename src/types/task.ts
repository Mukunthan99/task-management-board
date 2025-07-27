
import type {UseMutationResult} from  "@tanstack/react-query";

// Define the Task type with all necessary fields
// This type represents a task in the task management system
// It includes fields for id, title, description, status, tags, due date, and
export interface Task{
    id: string;
    title: string;
    description: string;
    status: "Todo" | "In Progress" | "Completed";
    tags?: string[];
    dueDate?: Date;
    priority: "Low" | "Medium" | "High";
}

// Define the ColumnProps interface for the Column component
// It includes the title of the column, an array of tasks, a mutation for deleting tasks
export interface ColumnProps{
    title:string,
    tasks: Task[],
    deleteMutation: UseMutationResult<string, Error, string, unknown>
    handleEdit: (task: Task) => void;
}

// Define the CardProps interface for the Card component
// It includes a task, a mutation for deleting the task, and a function to handle editing
export interface CardProps {
  key?: string;
  task: Task;
  deleteMutation: UseMutationResult<string, Error, string, unknown>;
  handleEdit: (task: Task) => void;
}

// Define the CreateTaskBoxProps interface for the CreateTaskBox component
// It includes an array of tasks, a mutation for creating or updating tasks, an optional task to edit, and a function to close the box
export interface CreateTaskBoxProps {
  tasks: Task[];
  mutation: UseMutationResult<boolean | Task[], Error, Task[], unknown>;
  editTask?: Task | null;
  onClose?: () => void;
}

// Define the TaskModalProps interface for the TaskModal component
// It includes whether the modal is open, a function to close it, an optional task to edit, an array of tasks, and a mutation for creating or updating tasks
export interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  taskToEdit?: Task | null;
  tasks: Task[];
  mutation: UseMutationResult<boolean | Task[], Error, Task[], unknown>;
}
