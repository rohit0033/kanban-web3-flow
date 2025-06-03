import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// API base URL - update this to your deployed backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority?: 'low' | 'medium' | 'high'; // Optional for backward compatibility
  dueDate?: string; // Optional for backward compatibility
  createdAt: string;
  updatedAt?: string;
}

interface TasksContextType {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  fetchTasks: () => Promise<void>;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export const TasksProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper function to get auth token
  const getAuthToken = () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No authentication token found. Please login again.');
    }
    return token;
  };

  // Helper function for API calls
  const makeAuthenticatedRequest = async (url: string, options: RequestInit = {}) => {
    const token = getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    if (!data.success) {
      throw new Error(data.message || 'Request failed');
    }

    return data;
  };

  // Fetch tasks from API
  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await makeAuthenticatedRequest('/tasks');
      
      // Define the API task interface
      interface ApiTask {
        _id: string;
        title: string;
        description?: string;
        status: 'todo' | 'in-progress' | 'done';
        priority?: 'low' | 'medium' | 'high';
        dueDate?: string;
        createdAt: string;
        updatedAt?: string;
      }
      
      // Transform backend data to match frontend interface
      const transformedTasks = data.data.map((task: ApiTask) => ({
        id: task._id,
        title: task.title,
        description: task.description || '',
        status: task.status,
        priority: task.priority || 'medium', // Default priority if not set
        dueDate: task.dueDate || '', // Default empty if not set
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
      }));

      setTasks(transformedTasks);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch tasks';
      setError(errorMessage);
      console.error('Error fetching tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load tasks when component mounts and user is authenticated
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      fetchTasks();
    }
  }, []);

  const addTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setError(null);

      // Send only the fields that backend expects
      const backendTaskData = {
        title: taskData.title,
        description: taskData.description,
        status: taskData.status,
      };

      const response = await makeAuthenticatedRequest('/tasks', {
        method: 'POST',
        body: JSON.stringify(backendTaskData),
      });

      // Log the response to see its structure
      console.log('API Response:', response);

      // Extract the task data from the response
      // Modified to handle different response structures
      const taskResponse = response.data; // The actual task object returned by your API

      if (!taskResponse) {
        throw new Error('Invalid response from server');
      }

      // Transform the response and add to local state
      const newTask: Task = {
        id: taskResponse._id,
        title: taskResponse.title,
        description: taskResponse.description || '',
        status: taskResponse.status,
        priority: taskData.priority || 'medium',
        dueDate: taskData.dueDate || '',
        createdAt: taskResponse.createdAt,
        updatedAt: taskResponse.updatedAt,
      };

      setTasks(prev => [...prev, newTask]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add task';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateTask = async (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>) => {
    try {
      setError(null);

      // Send only the fields that backend expects
      const backendUpdates = {
        title: updates.title,
        description: updates.description,
        status: updates.status,
      };

      // Remove undefined values
      const cleanUpdates = Object.fromEntries(
        Object.entries(backendUpdates).filter(([_, value]) => value !== undefined)
      );

      const response = await makeAuthenticatedRequest(`/tasks/${id}`, {
        method: 'PUT',
        body: JSON.stringify(cleanUpdates),
      });

      const taskResponse = response.data;

      // Update local state
      setTasks(prev => prev.map(task => 
        task.id === id 
          ? { 
              ...task, 
              ...updates,
              updatedAt: taskResponse.updatedAt 
            } 
          : task
      ));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update task';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      setError(null);

      await makeAuthenticatedRequest(`/tasks/${id}`, {
        method: 'DELETE',
      });

      // Update local state
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete task';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  return (
    <TasksContext.Provider value={{ 
      tasks, 
      isLoading, 
      error, 
      addTask, 
      updateTask, 
      deleteTask, 
      fetchTasks 
    }}>
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error('useTasks must be used within a TasksProvider');
  }
  return context;
};