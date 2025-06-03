import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import TaskBoard from '../components/TaskBoard';
import { useAuth } from '../hooks/useAuth';

const Board = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-600">
      <Header user={user} />
      <main className="container mx-auto px-4 py-8">
        <TaskBoard />
      </main>
    </div>
  );
};

export default Board;