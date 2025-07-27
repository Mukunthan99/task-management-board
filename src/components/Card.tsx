import type { CardProps } from "../types/task";
import { MdDelete, MdEdit } from "react-icons/md";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function Card({ task, deleteMutation, handleEdit }: CardProps) {
  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task.id, data: { columnId: task.status } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <>
      {/* Card component layout */}
      <div
        key={task.id}
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        style={style}
        className={`m-1 w-full rounded-lg border border-gray-200 ${
          task.dueDate &&
          new Date(new Date(task.dueDate).toDateString()) <
            new Date(new Date().toDateString())
            ? "bg-red-400"
            : "bg-white"
        } shadow-sm hover:shadow-md transition-shadow`}
      >
        <div className="relative p-2 flex flex-col justify-between h-full">
          {/* Priority and Action Buttons */}
          <div className="flex justify-between items-start mb-2.5">
            {/* Priority tag section*/}
            <span
              className={`text-[10px] font-bold px-1 py-0.5 rounded-md ${
                task.priority === "High"
                  ? "bg-red-100 text-red-600"
                  : task.priority === "Medium"
                  ? "bg-orange-100 text-orange-600"
                  : "bg-yellow-100 text-yellow-600"
              }`}
            >
              {task.priority}
            </span>
            {/* Action button section */}
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(task)}
                className="text-black hover:text-blue-600 transition-colors"
              >
                <MdEdit size={16} />
              </button>
              <button
                onClick={() => handleDelete(task.id)}
                className="text-black hover:text-red-600 transition-colors"
              >
                <MdDelete size={16} />
              </button>
            </div>
          </div>

          {/* Title and Description */}
          <div className="flex-grow">
            <h5 className="text-md font-semibold text-gray-900 mb-1">
              {task.title}
            </h5>
            <p className="text-xs text-gray-700">{task.description}</p>
          </div>

          {/* Due Date */}
          {task.dueDate && (
            <div className="text-[11px] text-black text-right mt-2">
              Due: {new Date(task.dueDate).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Card;
