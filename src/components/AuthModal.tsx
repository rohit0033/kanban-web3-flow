
import { useState } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from '../hooks/useAuth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    acceptTerms: false,
    rememberMe: false
  });
  const { login, signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSignup) {
      if (!formData.acceptTerms) return;
      await signup({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
    } else {
      await login({
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe
      });
    }
    onClose();
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-lg bg-gradient-to-br from-blue-900 to-blue-600 border-none p-0 overflow-hidden">
        <div className="p-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-8">
            {isSignup ? 'Sign up' : 'Log in!'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {isSignup && (
              <div>
                <Label htmlFor="name" className="text-white text-sm font-medium">
                  Username
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter Name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="mt-2 bg-transparent border border-white/30 text-white placeholder-white/70 focus:border-white"
                  required
                />
              </div>
            )}

            <div>
              <Label htmlFor="email" className="text-white text-sm font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="abcd@gmail.com"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="mt-2 bg-transparent border border-white/30 text-white placeholder-white/70 focus:border-white"
                required
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-white text-sm font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter Password"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                className="mt-2 bg-transparent border border-white/30 text-white placeholder-white/70 focus:border-white"
                required
              />
            </div>

            {isSignup ? (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={formData.acceptTerms}
                  onCheckedChange={(checked) => handleChange('acceptTerms', !!checked)}
                  className="border-white data-[state=checked]:bg-white data-[state=checked]:text-blue-900"
                />
                <Label htmlFor="terms" className="text-white text-sm">
                  I accept the terms & conditions
                </Label>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={formData.rememberMe}
                    onCheckedChange={(checked) => handleChange('rememberMe', !!checked)}
                    className="border-white data-[state=checked]:bg-white data-[state=checked]:text-blue-900"
                  />
                  <Label htmlFor="remember" className="text-white text-sm">
                    Remember me
                  </Label>
                </div>
                <button
                  type="button"
                  className="text-white text-sm hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-white text-blue-900 hover:bg-gray-100 font-semibold py-3"
            >
              {isSignup ? 'Sign up' : 'Log in'}
            </Button>
          </form>

          <div className="mt-6">
            <button
              onClick={() => setIsSignup(!isSignup)}
              className="text-white text-sm hover:underline"
            >
              {isSignup 
                ? 'Already have an account? Log in' 
                : "Don't have an account? Sign up"
              }
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
