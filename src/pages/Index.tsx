import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Index = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/board');
    } else {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // This component will only render briefly during redirection
  return null;
};

export default Index;