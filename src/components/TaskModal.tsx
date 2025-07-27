import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { TaskModalProps } from "../types/task";
import CreateTaskBox from "./CreateTaskBox";


export default function TaskModal({
  open,
  onClose,
  taskToEdit,
  tasks,
  mutation,

}: TaskModalProps) {
  return (
    // Dialog component to handle task creation and editing
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <CreateTaskBox
          tasks={tasks}
          mutation={mutation}
          editTask={taskToEdit}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}
