
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import TaskColumn from './TaskColumn';
import TaskModal from './TaskModal';
import { useTasks } from '../hooks/useTasks';

const TaskBoard = () => {
  const { tasks, addTask, updateTask, deleteTask } = useTasks();
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const handleAddTask = () => {
    setEditingTask(null);
    setShowTaskModal(true);
  };

  const handleEditTask = (task: any) => {
    setEditingTask(task);
    setShowTaskModal(true);
  };

  const handleSaveTask = (taskData: any) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
    } else {
      addTask(taskData);
    }
    setShowTaskModal(false);
    setEditingTask(null);
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
