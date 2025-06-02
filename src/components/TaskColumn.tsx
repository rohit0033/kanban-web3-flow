
import { Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import TaskCard from './TaskCard';

interface TaskColumnProps {
  title: string;
  tasks: any[];
  onEditTask: (task: any) => void;
  onDeleteTask: (taskId: string) => void;
  onStatusChange: (taskId: string, updates: any) => void;
  status: string;
}

const TaskColumn = ({ title, tasks, onEditTask, onDeleteTask, onStatusChange, status }: TaskColumnProps) => {
  const getColumnColor = () => {
    switch (status) {
      case 'todo': return 'border-blue-300 bg-blue-50';
      case 'in-progress': return 'border-yellow-300 bg-yellow-50';
      case 'done': return 'border-green-300 bg-green-50';
      default: return 'border-gray-300 bg-white';
    }
  };

  return (
    <div className={`rounded-lg border-2 p-4 min-h-[400px] ${getColumnColor()}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800">{title}</h3>
        <span className="text-sm text-gray-500">({tasks.length})</span>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
            onStatusChange={onStatusChange}
          />
        ))}
        
        {tasks.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No tasks yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskColumn;
