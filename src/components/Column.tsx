import type { ColumnProps } from "../types/task";
import Card from "./Card";
import { useDroppable } from "@dnd-kit/core";

function Column({ title, tasks, deleteMutation, handleEdit }: ColumnProps) {
    
  // Use DndKit's useDroppable to make the column droppable
  const { setNodeRef } = useDroppable({
    id: title,
    data: { columnId: title },
  });

  // Filter tasks based on the column title
  const filteredTasks = tasks.filter((task) => task.status === title);
  return (
    <>
      {/* Todo Column */}
      <div
        ref={setNodeRef}
        className="flex-1 bg-white rounded-lg shadow-md p-4 flex flex-col"
      >
        <h3 className="text-md text-center font-bold mb-4">{title}</h3>
        {filteredTasks.length > 0 &&
          filteredTasks.map((task) => (
            <Card
              key={task.id}
              task={task}
              deleteMutation={deleteMutation}
              handleEdit={handleEdit}
            />
          ))}
      </div>
    </>
  );
}

export default Column;
