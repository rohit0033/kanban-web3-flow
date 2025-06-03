import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import TaskColumn from './TaskColumn';
import TaskModal from './TaskModal';
import { useTasks } from '../hooks/useTasks';

// Define the Task interface to match your useTasks hook
export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
  createdAt: string;
  updatedAt?: string;
}

const TaskBoard = () => {
  const { tasks, addTask, updateTask, deleteTask } = useTasks();
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleAddTask = () => {
    setEditingTask(null);
    setShowTaskModal(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask({ ...task }); // Create a copy to avoid reference issues
    setShowTaskModal(true);
  };

  const handleSaveTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (editingTask) {
        // When editing, only include fields the updateTask function accepts
        // According to useTasks.tsx, we can update title, description, status, priority, dueDate
        // but not id, createdAt, or updatedAt
        updateTask(editingTask.id, {
          title: taskData.title,
          description: taskData.description,
          status: taskData.status,
          priority: taskData.priority,
          dueDate: taskData.dueDate
        });
      } else {
        // When adding a new task
        // The addTask function in useTasks.tsx expects Omit<Task, 'id' | 'createdAt' | 'updatedAt'>
        addTask(taskData);
      }
      
      // Only close the modal and reset if operations were successful
      setShowTaskModal(false);
      setEditingTask(null);
    } catch (error) {
      console.error('Failed to save task:', error);
      // You could add error handling UI here if needed
    }
  };

  const todoTasks = tasks.filter(task => task.status === 'todo');
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress');
  const doneTasks = tasks.filter(task => task.status === 'done');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">My Tasks</h2>
        <Button 
          onClick={handleAddTask}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TaskColumn
          title="To Do"
          tasks={todoTasks}
          onEditTask={handleEditTask}
          onDeleteTask={deleteTask}
          onStatusChange={updateTask}
          status="todo"
        />
        <TaskColumn
          title="In Progress"
          tasks={inProgressTasks}
          onEditTask={handleEditTask}
          onDeleteTask={deleteTask}
          onStatusChange={updateTask}
          status="in-progress"
        />
        <TaskColumn
          title="Done"
          tasks={doneTasks}
          onEditTask={handleEditTask}
          onDeleteTask={deleteTask}
          onStatusChange={updateTask}
          status="done"
        />
      </div>

      {showTaskModal && (
        <TaskModal
          isOpen={showTaskModal}
          onClose={() => setShowTaskModal(false)}
          onSave={handleSaveTask}
          task={editingTask}
        />
      )}
    </div>
  );
};

export default TaskBoard;