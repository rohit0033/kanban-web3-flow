import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, Menu } from "lucide-react";
import { useAuth } from '../hooks/useAuth';
import WalletConnect from './Wallet';
import { useState } from 'react';

interface User {
  id?: string;
  name?: string;
  email?: string;
  avatar?: string;
  walletAddress?: string;
}

interface HeaderProps {
  user: User | null;
}

const Header = ({ user }: HeaderProps) => {
  const { logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-blue-800 shadow-lg w-full">
      {/* Desktop Header */}
      <div className="hidden md:flex max-w-7xl mx-auto px-4 py-3 items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-blue-800" fill="currentColor">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-white">TasksBoard</h1>
        </div>
        
        {/* User Actions */}
        <div className="flex items-center gap-4">
          <WalletConnect />
          
          <div className="flex items-center gap-2">
            <Avatar className="w-8 h-8">
              <AvatarImage src={user?.avatar} alt={user?.name} />
              <AvatarFallback className="bg-blue-100 text-blue-800">
                {user?.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <span className="text-white font-medium">
              {user?.name}
            </span>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="text-white hover:bg-blue-700 px-3"
          >
            <LogOut className="h-4 w-4 mr-2" />
            <span>Logout</span>
          </Button>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-4 py-2">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-blue-800" fill="currentColor">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-lg font-bold text-white">TasksBoard</h1>
          </div>
          
          {/* Menu Button */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white hover:bg-blue-700"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Mobile Menu - Conditionally rendered */}
        {menuOpen && (
          <div className="px-4 py-3 bg-blue-700 space-y-3 border-t border-blue-600">
            <div className="flex items-center gap-2">
              <Avatar className="w-7 h-7">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback className="bg-blue-100 text-blue-800 text-xs">
                  {user?.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <span className="text-white text-sm font-medium">
                {user?.name}
              </span>
            </div>
            
            <div className="flex flex-col space-y-2">
              <div className="w-full">
                <WalletConnect />
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-white hover:bg-blue-600 justify-start px-2 w-full"
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;