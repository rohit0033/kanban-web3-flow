
import { useState } from 'react';
import Header from '../components/Header';
import TaskBoard from '../components/TaskBoard';
import AuthModal from '../components/AuthModal';
import { useAuth } from '../hooks/useAuth';

const Index = () => {
  const { user, isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(!isAuthenticated);

  if (!isAuthenticated) {
    return <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />;
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

export default Index;
