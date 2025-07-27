import { useForm } from "@tanstack/react-form";
import type { Task,CreateTaskBoxProps } from "../types/task";
import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";


function CreateTaskBox({
  tasks,
  mutation,
  editTask,
  onClose,
}: CreateTaskBoxProps) {
  // State for calendar popover
  const [calendarOpen, setCalendarOpen] = React.useState(false);


  // Form setup using react-form. This handles both task creation and editing. It initializes the form with either the existing task data or empty fields
  const form = useForm({
    defaultValues: {
      title: editTask?.title || "",
      description: editTask?.description || "",
      status: editTask?.status || "Todo",
      tags: editTask?.tags || [],
      dueDate: editTask?.dueDate ? new Date(editTask.dueDate) : new Date(),
      priority: editTask?.priority || "Low",
    },
    onSubmit: async ({ value, formApi }): Promise<void> => {
      const updatedTask: Task = {
        id: editTask?.id ?? Date.now().toString(),
        ...value,
      };

      let updatedTasks = tasks;

      if (editTask) {
        // Editing existing task
        updatedTasks = tasks.map((task) =>
          task.id === editTask.id ? updatedTask : task
        );
      } else {
        // Creating new task
        updatedTasks = [...tasks, updatedTask];
      }

      mutation.mutate(updatedTasks);
      formApi.reset();
      onClose?.(); 
    },
  });

  return (
    // Form for creating or editing a task. It includes fields for title, description, priority, due date, and a submit button
    <form
      onSubmit={(e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="w-full flex flex-col items-center p-4"
    >
      {/* Title of the form, either "Create Task" or "Edit Task" based on the presence of editTask */}
      <h2 className="text-lg text-center font-semibold mb-2">
        {editTask ? "Edit Task" : "Create Task"}
      </h2>
      {/* Task Title */}
      <div className="w-full mb-5">
        <label
          htmlFor="task-title"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          To-Do Title
        </label>

         {/* Title field with validation. The title should be more than 3 letters to be valid  */}
        <form.Field
          name="title"
          validators={{
            onChange: ({ value }) => {
              if (!value || value.length < 3)
                return "Title should be more tha 3 letters";
            },
          }}
        >
          {(field) => (
            <div className="flex flex-col gap-1">
              <input
                type="text"
                id="task-title"
                className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {!field.state.meta.isValid && (
                <p className="text-xs text-red-500">
                  {field.state.meta.errors}
                </p>
              )}
            </div>
          )}
        </form.Field>
      </div>

      {/* Description field without validation as it is treated as optional */}
      <div className="w-full mb-5">
        <label
          htmlFor="description"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          Description
        </label>
        <form.Field name="description">
          {(field) => (
            <textarea
              id="description"
              rows={2}
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            ></textarea>
          )}
        </form.Field>
      </div>

      {/* Priority and Due Date */}
      <div className="w-full mb-5 flex flex-row gap-4">
        {/* Priority Tag */}
        <div className="flex flex-col flex-1">
          <label
            htmlFor="priority"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Priority
          </label>
          <form.Field name="priority">
            {(field) => (
              <select
                id="priority"
                className="block w-full p-2 pl-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 appearance-none"
                value={field.state.value}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  field.handleChange(e.target.value)
                }
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            )}
          </form.Field>
        </div>

        {/* Due Date Calendar implemented with the help of external libraries */}
        <div className="flex flex-col flex-1">
          <label
            htmlFor="due-date"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Due Date
          </label>
          <form.Field name="dueDate">
            {(field) => (
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    id="due-date"
                    className="flex items-center justify-between w-full p-2 pl-3 text-left text-xs text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    {field.state.value
                      ? field.state.value.toLocaleDateString()
                      : "Select date"}
                    <ChevronDownIcon className="w-4 h-4 text-gray-500" />
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto overflow-hidden p-0"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={field.state.value}
                    onSelect={(date) => {
                      field.handleChange(date ?? new Date());
                      setCalendarOpen(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
            )}
          </form.Field>
        </div>
      </div>

      {/* Submit Button or Update Button.This button will either create a new task or update an existing one based on the presence of editTask */}
      <button
        type="submit"
        className="w-fit text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
      >
        {editTask ? "Update" : "Submit"}
      </button>
    </form>
  );
}

export default CreateTaskBox;
